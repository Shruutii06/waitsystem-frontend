import { Grid, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // Import vehicle icon

import TrafficLocationsUI from './TrafficLocationsUI';
import { FetchHighTrafficPlaces } from '../redux/locationReducer';

export default function HighTrafficLocations() {
  const dispatch = useDispatch();
  const places = useSelector(({ location }) => location.highTrafficPlaces);
  const navigate = useNavigate();

  useEffect(() => {
    if (!places || !places.length) {
      dispatch(
        FetchHighTrafficPlaces({
          callback: (msg, data, recall) => {
            if (msg === 'error') {
              console.log(msg, data);
              toast.error(typeof data === 'string' ? data : 'Error in fetching top five locations', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            } else {
              recall();
            }
          },
        })
      );
    }
  }, []);

  const getBgcolor = (index) => {
    switch (index) {
      case 1:
        return '#003366'; // Dark Blue (Highest rank)
      case 2:
        return '#0066cc'; // Medium Blue (Second rank)
      case 3:
        return '#3399ff'; // Light Blue (Third rank)
      case 4:
        return '#66ccff'; // Soft Light Blue (Fourth rank)
      case 5:
        return '#99ccff'; // Very Light Blue (Fifth rank)
      default:
        return '#e6f2ff'; // Very Light Blue-gray (Fallback for others)
    }
  };

  if (!places || !places.length) return null;

  return (
    <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'left' }}>
      {places.map((place, index) => (
        <Grid item style={{ cursor: 'pointer' }} xs={12} sm={6} md={4} key={index}>
          <TrafficLocationsUI
            title={place.name}
            subtitle1={place.district}
            subtitle2={place.pincode}
            icon={place.photo} // Keep the original photo icon
            total={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body1">{place.vehiclesPassed}</Typography>
                <DirectionsCarIcon fontSize="small" /> {/* Add car icon beside the total */}
              </Stack>
            }
            bgcolor={getBgcolor(index + 1)}
            id={place._id}
            color="secondary"
            sx={{ color: 'white' }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
