import { Provider } from 'react-redux';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
import './base.css'
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';

// ----------------------------------------------------------------------

import store from './store';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Router />
      </ThemeProvider>
    </Provider>
  );
}