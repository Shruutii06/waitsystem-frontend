import { useEffect, useState } from 'react';
import { Card, Stack, Container, Typography, Tab, Box } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import Page from '../components/Page';
import EditProfileForm from '../sections/profile/editProfile/EditProfileForm';
import ChangePasswordForm from '../sections/profile/changePassword/ChangePasswordForm';

export default function ProfileSettings() {
  const [value, setValue] = useState('1');
  const theme = useTheme();

  useEffect(() => {
    // Apply background color based on theme when component mounts
    document.body.style.backgroundColor = theme.palette.background.default;

    // Cleanup the background color when component unmounts
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Page title="Account Settings">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h3" gutterBottom>
            Account Settings
          </Typography>
        </Stack>

        <Card sx={{ p: 1.5, backgroundColor: 'background.default' }}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange}>
                  <Tab label="Edit Profile" value="1" />
                  <Tab label="Change Password" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <EditProfileForm />
              </TabPanel>
              <TabPanel value="2">
                <ChangePasswordForm />
              </TabPanel>
            </TabContext>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
