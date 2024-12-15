import * as Yup from 'yup';
import { useState, useRef } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';

import { useFormik, Form, FormikProvider } from 'formik';

// material
import {
  Box,
  Grid,
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Button,
  Switch,
  Avatar,
  Input,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
// component
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Iconify from '../../../components/Iconify';
import { MakeRequest } from '../../../utils/ApiManager';
import { profileRoutes } from '../../../utils/Constants';
import { EditProfile } from '../../../redux/AuthReducer';

// reducers
// import { Login } from '../../../redux/AuthReducer';

// ----------------------------------------------------------------------

export default function ProfileForm() {
  const authData = useSelector(({ auth }) => auth);
  const theme = useTheme();
  const [profileuploading, setProfileuploading] = useState(false);

  const account = {
    profilePhoto: authData.user.photo,
    displayName: authData.user.name,
    email: authData.user.email,
    location: authData.user.location,
    twofactor: authData.user.twoFactorEnabled,
  };
  const navigate = useNavigate();
  const [twofactor, setTwoFactor] = useState(Boolean(authData.user.twoFactorEnabled));
  const dispatch = useDispatch();

  const ProfileSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      photo: account.profilePhoto,
      name: account.displayName,
      email: account.email,
      location: account.location,
      twofactor: account.twofactor,
    },
    validationSchema: ProfileSchema,
    onSubmit: (values, actions) => {
      console.log(values);
      if (profileuploading) {
        toast.error('Photo upload is in progress.Please try in a while', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSubmitting(false);
        return;
      }
      setSubmitting(true);
      dispatch(
        EditProfile({
          payload: {
            ...values,
            photo: getPhoto(),
            twoFactorEnabled: twofactor,
          },
          callback: (msg, data, recall) => {
            console.log(data);
            setSubmitting(false);
            if (msg === 'error') {
              toast.error(typeof data === 'string' ? data : 'Something went wrong', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            } else {
              toast.success('Profile updated successfully', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              recall();
            }
          },
        })
      );
    },
  });
  // const [checked, setChecked] = useState(account.twofactor);
  // const handleChange = (event) => {
  //   setChecked(event.target.checked);
  // };

  const [photoState, setPhotoState] = useState(null);
  const pastPhoto = useRef();
  const UploadFile = async (e) => {
    if (e.target.files[0] && e.target.files[0].size > 1024 * 1024 * 5) {
      toast.error("Image size should not exceed 5Mb", {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return;
    }
    if (pastPhoto.current) return;
    pastPhoto.current = getPhoto();
    setPhotoState(e.target.files[0]);
    setProfileuploading(true);
    const resp = await MakeRequest(
      'FILE',
      {
        url: profileRoutes.image,
        file: e.target.files[0],
      },
      null
    );

    if (resp && resp.resp && resp.resp.data) setPhotoState(resp.resp.data);
    else {
      setPhotoState(pastPhoto.current);
      toast.error(typeof resp.err === 'string' ? resp.err : 'Could not upload picture', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setProfileuploading(false);
    pastPhoto.current = null;
  };

  const getPhoto = () => {
    if (!photoState) return account.profilePhoto;
    if (typeof photoState === 'string') return photoState;
    return URL.createObjectURL(photoState);
  };

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={10}>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Box
              sx={{
                minWidth: 150,
                maxWidth: 600,
              }}
            >
              <Stack spacing={3} direction="column" justifyContent="center" alignItems="center" sx={{ my: 4 }}>
                <Avatar src={getPhoto()} alt={account.displayName} sx={{ width: 150, height: 150 }} />
                <label htmlFor="profile-pic">
                  <input
                    style={{ display: 'none' }}
                    accept="image/*"
                    id="profile-pic"
                    multiple
                    type="file"
                    onChange={UploadFile}
                  />
                  <Button variant="contained" component="span">
                    Change Photo
                  </Button>
                </label>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <Box
              sx={{
                minWidth: 150,
                maxWidth: 600,
              }}
            >
              <Stack spacing={3} alignItems="flex-start">
                <TextField
                  fullWidth
                  type="text"
                  label="Name"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{
                    backgroundColor: theme.palette.mode === 'light' ? '#e6f2ff' : '#002a51',
                    borderRadius: '8px',
                    color: theme.palette.text.dark,
                  }}
                />
                <TextField
                  fullWidth
                  disabled
                  type="email"
                  label="Email address"
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{
                    backgroundColor: theme.palette.mode === 'light' ? '#e6f2ff' : '#002a51',
                    borderRadius: '8px',
                    color: theme.palette.text.dark,
                  }}
                />
                <TextField
                  fullWidth
                  type="text"
                  label="Office Location"
                  {...getFieldProps('location')}
                  error={Boolean(touched.location && errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{
                    backgroundColor: theme.palette.mode === 'light' ? '#e6f2ff' : '#002a51',
                    borderRadius: '8px',
                    color: theme.palette.text.dark,
                  }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      {...getFieldProps('twofactor')}
                      checked={twofactor}
                      onChange={(e) => setTwoFactor(e.target.checked)}
                    />
                  }
                  label="Two-factor Authentication"
                  labelPlacement="start"
                />
              </Stack>

              <Stack direction="column" alignItems="flex-end" sx={{ my: 4 }}>
                <LoadingButton
                  sx={{ maxWidth: 170 }}
                  startIcon={<Iconify icon="fa-solid:save" />}
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Save Changes
                </LoadingButton>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
