import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Box, Container, Stack, TextField, IconButton, InputAdornment, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Iconify from '../../../components/Iconify';
import { UpdatePassword } from '../../../redux/AuthReducer';

// ----------------------------------------------------------------------

export default function ChangePasswordForm() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const location = useLocation();
  const ChangePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Password is required'),
    newPassword: Yup.string().required('Password is required'),
    confirmPassword: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: (values, actions) => {
      // console.log(values,actions)
      // values.email = location.state?.email;
      // values.OTP = values.otp;
      setSubmitting(true);
      dispatch(
        UpdatePassword({
          payload: {
            oldpwd: values.oldPassword,
            password: values.newPassword,
            cnfpwd: values.confirmPassword,
          },
          callback: (msg, data, recall) => {
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
              formik.resetForm();
              toast.success('Password changed successfully', {
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

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps, setSubmitting } = formik;

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const [showPassword1, setShowPassword1] = useState(false);
  const handleShowPassword1 = () => {
    setShowPassword1((show) => !show);
  };
  const [showPassword2, setShowPassword2] = useState(false);
  const handleShowPassword2 = () => {
    setShowPassword2((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Container maxWidth="md">
          <Stack spacing={3}>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Old Password"
              sx={{backgroundColor:'#FFFBEE', borderRadius:'8px'}}
              {...getFieldProps('oldPassword')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(touched.oldPassword && errors.oldPassword)}
              helperText={touched.oldPassword && errors.oldPassword}
            />

            <TextField
              fullWidth
              type={showPassword1 ? 'text' : 'password'}
              label="New Password"
              sx={{backgroundColor:'#FFFBEE', borderRadius:'8px'}}
              {...getFieldProps('newPassword')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword1} edge="end">
                      <Iconify icon={showPassword1 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(touched.newPassword && errors.newPassword)}
              helperText={touched.newPassword && errors.newPassword}
            />

            <TextField
              fullWidth
              type={showPassword2 ? 'text' : 'password'}
              label="Confirm Password"
              sx={{backgroundColor:'#FFFBEE', borderRadius:'8px'}}
              {...getFieldProps('confirmPassword')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword2} edge="end">
                      <Iconify icon={showPassword2 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />
          </Stack>

          <Stack direction="column" alignItems="flex-end" sx={{ my: 5 }}>
            <LoadingButton
              sx={{ maxWidth: 200 }}
              startIcon={<Iconify icon="fa-solid:save" />}
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Change Password
            </LoadingButton>
          </Stack>
        </Container>
      </Form>
    </FormikProvider>
  );
}
