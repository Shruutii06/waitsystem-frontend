import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// material
import { Card, Stack, Avatar, Button, Container, Typography, Tab, Box } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// components
import Page from '../components/Page';
import EditProfileForm from '../sections/profile/editProfile/EditProfileForm';
import ChangePasswordForm from '../sections/profile/changePassword/ChangePasswordForm';
import Label from '../components/Label';
import Iconify from '../components/Iconify';

export default function ProfileSettings() {
  const [value, setValue] = useState('1');

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

        <Card sx={{ p: 1.5, backgroundColor:'#e6f3ff' }}>
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
