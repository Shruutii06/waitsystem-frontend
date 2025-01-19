import { Grid, Stack, Typography, Box } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // Import vehicle icon
import { motion } from 'framer-motion'; // Import Framer Motion

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

  // Animation variants for cards
  const cardVariant = {
    hidden: { opacity: 0, x: 50 }, // Start off-screen
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  // Staggered transition for child elements
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delay each card animation by 0.3 seconds
      },
    },
  };

  return (
    <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'left' }} component={motion.div} initial="hidden" animate="visible" variants={containerVariant}>
      {places.map((place, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={index}
          style={{ cursor: 'pointer' }}
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={cardVariant}
          whileHover={{ scale: 1.05 }} // Increase size on hover
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: getBgcolor(index + 1),
              borderRadius: 2,
              padding: 2,
              boxShadow: 1,
              height: '15rem',
              justifyContent: 'space-between',
            }}
          >
            {/* Left Section: Place Photo */}
            <Box
              component="img"
              src={place.photo}
              alt={place.name}
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />

            {/* Right Section: Place Details */}
            <Stack spacing={1.5} width="60%">
              <Typography
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '1.35rem',
                }}
              >
                {place.name}
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: 'white', textTransform: 'capitalize' }}
              >
                {place.district}
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: 'white', textTransform: 'capitalize' }}
              >
                {place.pincode}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {place.vehiclesPassed}
                </Typography>
                <DirectionsCarIcon fontSize="small" sx={{ color: 'white' }} />
              </Stack>
            </Stack>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
