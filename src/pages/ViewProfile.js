import { useEffect, useState } from 'react';
// material
import {
  Card,
  Stack,
  Avatar,
  Button,
  Container,
  Typography,
  Tab,
  Tabs,
  Box,
  Divider,
  Link,
  Skeleton,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useTheme } from '@mui/material/styles';

import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FetchProfileInfoViewProfile } from '../redux/ProfileReducer';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Error from './Error';
import Page from '../components/Page';
import ViewProfile1 from '../components/ViewProfile1';
import ViewProfile2 from '../components/ViewProfile2';
import ViewProfile3 from '../components/ViewProfile3';

export default function ViewProfile() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { userid } = useParams();

  const profileInfo = useSelector(({ profile }) => profile.profileInfo[userid]);

  const [profileFetchingerror, setProfileFetchingError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const FetchProfile = (data) => {
    setProfileFetchingError(false);
    dispatch(
      FetchProfileInfoViewProfile({
        payload: { id: data },
        callback: (msg, data, recall) => {
          if (msg === 'error') {
            setProfileFetchingError(true);
          }
          recall();
          setIsLoading(true);
        },
      })
    );
  };
  useEffect(() => {
    // Apply background color based on theme when component mounts
    document.body.style.backgroundColor = theme.palette.background.default;

    // Cleanup the background color when component unmounts
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme]);

  useEffect(() => {
    setProfileFetchingError(false);
    if (!profileInfo || !profileInfo.name) {
      FetchProfile(userid);
    }
  }, [userid]);

  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  if (profileFetchingerror) {
    return <Error />;
  }
  return (
    <Page title="Profile">
      <Container>
        {/* <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4" gutterBottom>
            Your Profile
          </Typography>
        </Stack> */}

        {mdUp && (
          <Card sx={{ mt: 4, mb: 2 }}>
            <img
              src="https://wallpaperaccess.com/full/3659764.jpg"
              alt="Profile Cover"
              style={{ width: '100%', height: 200, zIndex: -100, opacity: 0.5 }}
            />
            {profileInfo ? (
              <Avatar
                src={profileInfo.photo}
                alt={profileInfo.name}
                sx={{
                  width: 130,
                  height: 130,
                  ml: 10,
                  mt: -13,
                  position: 'absolute',
                  border: 2.5,
                  borderColor: 'white',
                  zIndex: 1,
                }}
              />
            ) : (
              <Skeleton
                variant="circular"
                sx={{
                  width: 130,
                  height: 130,
                  ml: 10,
                  mt: -13,
                  position: 'absolute',
                  border: 2.5,
                  borderColor: 'white',
                  zIndex: 1,
                }}
              />
            )}

            <Stack
              flexDirection="row"
              justifyContent="flex-end"
              sx={{
                width: '100%',
                typography: 'body1',
                mx: -4.5,
                my: 0,
                zIndex: -1,
              }}
            >
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange}>
                    <Tab
                      sx={{ mt: -1, mb: -1.5 }}
                      icon={<AccountCircleIcon />}
                      iconPosition="start"
                      label="Profile"
                      value="1"
                    />
                    <Tab
                      sx={{ mt: -1, mb: -1.5 }}
                      icon={<AddToQueueIcon />}
                      iconPosition="start"
                      label="Poles"
                      value="2"
                    />
                    <Tab
                      sx={{ mt: -1, mb: -1.5 }}
                      icon={<AddLocationAltIcon />}
                      iconPosition="start"
                      label="Locations"
                      value="3"
                    />
                  </TabList>
                </Box>
              </TabContext>
            </Stack>
          </Card>
        )}
        {!mdUp && (
          <Card
            sx={{ mt: 1, mb: 2 }}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          >
            <img
              src="https://wallpaperaccess.com/full/3659764.jpg"
              alt="Profile Cover "
              style={{ width: '100%', height: 200, zIndex: -100, opacity: 0.5 }}
            />
            {profileInfo ? (
              <Avatar
                src={profileInfo.photo}
                alt={profileInfo.name}
                sx={{
                  width: 130,
                  height: 130,
                  position: 'absolute',
                  mt: -7,
                  border: 2.5,
                  borderColor: 'white',
                  zIndex: 1,
                }}
              />
            ) : (
              <Skeleton
                variant="circular"
                sx={{
                  width: 130,
                  height: 130,
                  position: 'absolute',
                  mt: -7,
                  border: 2.5,
                  borderColor: 'white',
                  zIndex: 1,
                }}
              />
            )}

            <Stack
              flexDirection="row"
              justifyContent="center"
              sx={{
                width: '100%',
                typography: 'body1',
                mt: 0,
                mb: 0,
                zIndex: -1,
              }}
            >
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange}>
                    <Tab
                      sx={{ mt: -1, mb: -1.5 }}
                      icon={<AccountCircleIcon />}
                      iconPosition="start"
                      label="Profile"
                      value="1"
                    />
                    <Tab
                      sx={{ mt: -1, mb: -1.5 }}
                      icon={<AddToQueueIcon />}
                      iconPosition="start"
                      label="Poles"
                      value="2"
                    />
                    <Tab
                      sx={{ mt: -1, mb: -1.5 }}
                      icon={<AddLocationAltIcon />}
                      iconPosition="start"
                      label="Locations"
                      value="3"
                    />
                  </TabList>
                </Box>
              </TabContext>
            </Stack>
          </Card>
        )}
        <Divider />
        <Card sx={{ my: 2, minWidth: 200, maxWidth: 700, px: 1 }}>
          <TabContext value={value}>
            <TabPanel value="1">
              <ViewProfile1 />
            </TabPanel>
          </TabContext>
        </Card>
        <Card sx={{ my: -2, minWidth: 200, px: 1 }}>
          <TabContext value={value}>
            <TabPanel value="2">
              <ViewProfile2 />
            </TabPanel>
          </TabContext>
        </Card>
        {/* <Card sx={{ my: 2, minWidth: 200, px: 1 }}> */}
        <TabContext value={value}>
          <TabPanel value="3">
            <ViewProfile3 />
          </TabPanel>
        </TabContext>
        {/* </Card> */}
      </Container>
    </Page>
  );
}