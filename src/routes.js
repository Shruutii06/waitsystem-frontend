import { Navigate, useRoutes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import RealTimeMap from './pages/RealTimeMap';
import Blog from './pages/Blog';
import ManageDevices from './pages/ManageDevices';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import ForgotPassword from './pages/ForgotPassword';
import EnterOTP from './pages/EnterOTP';
import TwofactorOTP from './pages/TwofactorOTP';
import ProfileSettings from './pages/ProfileSettings';

import { Constants } from './utils/Constants';

import { FetchMyDetail } from './redux/AuthReducer';
// import MapFooter from './pages/PoleAnalytics';
import LocationAnalytics from './pages/LocationAnalytics';
import PoleAnalytics from './pages/PoleAnalytics';
import SearchPage from './pages/SearchPage';
// import PoleComponent from './pages/PoleComponent';
import ViewProfile from './pages/ViewProfile';

// ----------------------------------------------------------------------

export default function Router() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem(Constants.AuthToken);
    if (token) {
      dispatch(FetchMyDetail({}));
    }
  }, []);
  const notAuthenticated = !(localStorage.getItem(Constants.AuthToken) || sessionStorage.getItem(Constants.AuthToken));

  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        {
          path: '/dashboard',
          element: !notAuthenticated ? <Navigate to="/dashboard/app" /> : <Navigate to="/login" />,
        },
        { path: 'app', element: !notAuthenticated ? <DashboardApp /> : <Navigate to="/login" /> },
        { path: 'manage-devices', element: !notAuthenticated ? <ManageDevices /> : <Navigate to="/login" /> },
        { path: 'products', element: !notAuthenticated ? <Products /> : <Navigate to="/login" /> },
        { path: 'blog', element: !notAuthenticated ? <Blog /> : <Navigate to="/login" /> },
        { path: 'realtimemap', element: <RealTimeMap /> },
        {
          path: 'pole/:poleid',
          element: <PoleAnalytics key={window.location.pathname} />,
        },
        {
          path: 'location/:locationid',
          element: <LocationAnalytics key={window.location.pathname} />,
        },
      ],
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: notAuthenticated ? <Navigate to="/login" /> : <Navigate to="/dashboard/app" /> },
        { path: 'view-profile/:userid', element: notAuthenticated ? <Navigate to="/login" /> : <ViewProfile /> },
        { path: 'settings', element: notAuthenticated ? <Navigate to="/login" /> : <ProfileSettings /> },
        { path: 'search', element: notAuthenticated ? <Navigate to="/login" /> : <SearchPage /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: notAuthenticated ? <Navigate to="/login" /> : <Navigate to="/dashboard/app" /> },
        { path: 'twofactorotp', element: notAuthenticated ? <TwofactorOTP /> : <Navigate to="/dashboard/app" /> },
        { path: 'login', element: notAuthenticated ? <Login /> : <Navigate to="/dashboard/app" /> },
        { path: 'register', element: notAuthenticated ? <Register /> : <Navigate to="/dashboard/app" /> },
        { path: 'forgotpassword', element: notAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard/app" /> },
        { path: 'enterotp', element: notAuthenticated ? <EnterOTP /> : <Navigate to="/dashboard/app" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}