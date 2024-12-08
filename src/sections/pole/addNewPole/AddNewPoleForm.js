import * as Yup from 'yup';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';

// material
import {
  Box,
  Autocomplete,
  Button,
  Link,
  Stack,
  Divider,
  Grid,
  Checkbox,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  InputAdornment,
  FormControlLabel,
  createFilterOptions,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AddNewLocationDialogBox from '../../../components/AddNewLocationDialogBox';
import Iconify from '../../../components/Iconify';
import statesJSON from '../addNewLocation/states.json';
import { FetchAllPlaces } from '../../../redux/locationReducer';
import { AddPole } from '../../../redux/PolesReducer';

import { isValidSerialNo, isValidLatitude, isValidLongitude } from '../../../utils/validation';
// reducers

// ----------------------------------------------------------------------

export default function AddNewPoleForm({ handleClose, editing, data, callback }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const places = useSelector(({ location }) => location.Places);

  useEffect(() => {
    if (!places || !places.length) {
      dispatch(
        FetchAllPlaces({
          callback: (msg, data, recall) => {
            recall();
          },
        })
      );
    }
  }, [places]);

  const AddNewLocationSchema = Yup.object().shape({
    serialno: Yup.string().required('Serial No. is required'),
    latitude: Yup.string().required('Latitude is required'),
    longitude: Yup.string().required('Longitude is required'),
    
    // location: Yup.string().required('Location is required'),
  });

  const formik = useFormik({
    initialValues: {
      serialno: editing ? data.serialno : '',
      latitude: editing ? data.latitude : '',
      longitude: editing ? data.longitude : '',
      location: editing ? data.location : '',
    },
    validationSchema: AddNewLocationSchema,
    onSubmit: (values, actions) => {
      if (locationid && isValidSerialNo(values.serialno) &&
        isValidLongitude(values.longitude) &&
        isValidLatitude(values.latitude) && !editing) {
        dispatch(
          AddPole({
            payload: {
              ...values,
              location: locationid,
              name: state.name,
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
                handleClose();
                recall();
              }
            },
          })
        );
      } else if (!editing) {
        setSubmitting(false);
        toast.error("Invalid values in one or more field.Please fill only valid values", {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else if (editing) {
        if (callback && state._id && isValidSerialNo(values.serialno) &&
          isValidLongitude(values.longitude) &&
          isValidLatitude(values.latitude)) {
          callback('EDIT_DONE', { ...values, location: state._id, name: state.name, poleid: data._id });
          handleClose();
        }
        else {
          toast.error("Invalid values in one or more field.Please fill only valid values", {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting } = formik;

  const [state, setState] = useState(editing ? data.location : { name: '', _id: '' });
  const [locationid, setLocationid] = useState();
  const [input, setInput] = useState('');

  const [jsonResults, setJsonResults] = useState([]);
  const filterOptions = createFilterOptions({
    limit: 5
  });

  useEffect(() => {
    setJsonResults(
      statesJSON.filter((x) => x.country_code === 'IN' && x.name.toLowerCase().includes(input.toLowerCase()))
    );
  }, [input]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={5}>
          <Stack spacing={3}>
            <TextField
              autoFocus
              margin="dense"
              id="standard-basic"
              label="Serial No."
              type="text"
              fullWidth
              disabled={editing}
              variant="standard"
              {...getFieldProps('serialno')}
              error={Boolean((touched.serialno && errors.serialno) || touched.serialno && !isValidSerialNo(values.serialno))}
              helperText={touched.serialno && errors.serialno}
            />
            <TextField
              margin="dense"
              id="standard-basic"
              label="Latitude"
              type="text"
              fullWidth
              variant="standard"
              {...getFieldProps('latitude')}
              error={Boolean((touched.latitude && errors.latitude) || touched.latitude && !isValidLatitude(values.latitude))}
              helperText={touched.latitude && errors.latitude}
            />
            <TextField
              margin="dense"
              id="standard-basic"
              label="Longitude"
              type="text"
              fullWidth
              variant="standard"
              {...getFieldProps('longitude')}
              error={Boolean((touched.longitude && errors.longitude) || touched.longitude && !isValidLongitude(values.longitude))}
              helperText={touched.longitude && errors.longitude}
            />
            <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
              <Autocomplete
                fullWidth
                disablePortal
                value={state}
                options={places}
                onChange={(e, n) => {
                  setState(n);
                  setLocationid(n?._id);
                }}
                id="location-autocomplete"
                getOptionLabel={(jsonResults) => `${jsonResults.name}`}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                noOptionsText={'No options'}
                onInputChange={(event, newInputValue) => {
                  setInput(newInputValue);
                }}
                renderOption={(props, jsonResults) => (
                  <Box component="li" {...props} key={jsonResults.id}>
                    {jsonResults.name}
                  </Box>
                )}
                filterOptions={filterOptions}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    margin="dense"
                    id="location"
                    label="Location"
                    type="text"
                    variant="standard"
                    error={Boolean(touched.location && errors.location)}
                    helperText={touched.location && errors.location}
                  />
                )}
              />
              <AddNewLocationDialogBox />
            </Stack>
          </Stack>
          <Stack spacing={3}>
            <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting}>
              {editing ? 'Update Pole' : 'Add Pole'}
            </LoadingButton>
          </Stack>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
