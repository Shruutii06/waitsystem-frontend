import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { Box, Container, Grid, Typography, Card, Stack, CircularProgress, Divider, Paper } from '@mui/material';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme, styled } from '@mui/material/styles';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { fShortenNumber } from '../utils/formatNumber';

import { FetchPoleAnalytics } from '../redux/PolesReducer';
import Error from './Error';

const AnyReactComponent = ({ text }) => (
  <div style={{ width: '20px', height: '20px', background: 'red', borderRadius: '100%' }} />
);

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 25,
  borderRadius: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function PoleAnalytics() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { poleid } = useParams();
  const analytics = useSelector(({ pole }) => pole.analytics);

  const defaultProps = {
    center: [59.938043, 30.337157],
    zoom: 9,
  };
  const [Fetchingerror, setError] = useState(false);

  const handleApiLoaded = (map, maps) => {
    // use map and maps objects
  };

  useEffect(() => {
    if (poleid && poleid.length === 24) {
      dispatch(
        FetchPoleAnalytics({
          payload: { poleid },
          callback: (msg, data, recall) => {
            console.log(msg, data);
            if (msg === 'error') {
              setError(true);
              toast.error(typeof data === 'string' ? data : 'Error in fetching pole analytics', {
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
    } else {
      setError(true);
    }
  }, [poleid]);

  const FormatTime = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 5) return 'Just now';
    if (diff < 60) return `${diff}s`;
    if (diff < 60 * 60) return `${Math.floor(diff / 60)}m`;
    if (diff < 3600 * 24) return `${Math.floor(diff / 3600)}h`;
    if (diff < 3600 * 24 * 365) return `${Math.floor(diff / (3600 * 24))}d`;
    return `${Math.floor(diff / (3600 * 24 * 365))}y`;
  };

  if (Fetchingerror) {
    return <Error />;
  }

  if (!analytics[poleid] || !analytics[poleid].pole)
    return (
      <center style={{ marginTop: '180px' }}>
        <CircularProgress size={20} />
      </center>
    );

  return (
    <Page title="Pole Analytics">
      <Container maxWidth="xl">
        <Stack>
          <Typography variant="h3" mt={0} mb={3}>
            Pole Analytics
          </Typography>
        </Stack>
        <Grid container spacing={0.2} >
          <Grid container spacing={1} item xs={12} sm={12} md={8}>
            <Grid item xs={12} sm={12} md={12}>
              <Card sx={{ p: 3, maxWidth: '90%', margin: '0 ' }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row', md: 'row' }}
                  spacing={2}
                  justifyContent="space-evenly"
                  alignItems="center"
                  divider={<Divider orientation="vertical" flexItem />}
                >
                  <Stack>
                    <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', backgroundColor: '#D1E9FC' }}>
                      <Stack divider={<Divider />} spacing={3}>
                        <Typography variant="h4">#{analytics[poleid].pole.serialno}</Typography>
                        <Stack direction="row" spacing={2.5} divider={<Divider orientation="vertical" flexItem />}>
                          <Stack>
                            <Box sx={{ mb: 0.5 }}>
                              <Iconify icon={'tabler:world-latitude'} color="#1877F2" width={32} height={32} />
                            </Box>

                            <Typography variant="h6">{analytics[poleid].pole.latitude}</Typography>

                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Latitude
                            </Typography>
                          </Stack>
                          <Stack>
                            <Box sx={{ mb: 0.5 }}>
                              <Iconify icon={'tabler:world-longitude'} color="#1877F2" width={32} height={32} />
                            </Box>

                            <Typography variant="h6">{analytics[poleid].pole.longitude}</Typography>

                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Longitude
                            </Typography>
                          </Stack>
                        </Stack>
                        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                          {analytics[poleid].pole.location?.name}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Stack>
                  <Stack divider={<Divider />} spacing={3}>
                    <Stack
                      direction="column"
                      spacing={3}
                      divider={<Divider orientation="vertical" flexItem />}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Paper
                        variant="outlined"
                        sx={{ px: 2.5, py: 1.5, textAlign: 'center', backgroundColor: '#D1E9FC' }}
                      >
                        <Box sx={{ mb: 0.5 }}>
                          <Iconify icon={'fluent:vehicle-car-24-filled'} color="#1877F2" width={32} height={32} />
                        </Box>

                        <Typography variant="h4">
                          {fShortenNumber(
                            analytics[poleid].v1 ? analytics[poleid].pole.vehiclesPassed : analytics[poleid].data.length
                          )}
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Vehicles Passed
                        </Typography>
                      </Paper>

                      <Paper
                        variant="outlined"
                        sx={{ px: 2.5, py: 1.5, textAlign: 'center', backgroundColor: '#D1E9FC' }}
                      >
                        <Box sx={{ mb: 0.5 }}>
                          <Iconify icon={'eos-icons:content-modified'} color="#1877F2" width={32} height={32} />
                        </Box>

                        <Typography variant="h4">{FormatTime(analytics[poleid].pole.lastUpdatedAt)}</Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Last Updated
                        </Typography>
                      </Paper>
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Card
              sx={{
                height: '70vh',
                width: '100%',
                borderRadius: '15px',
              }}
            >
              {console.log('analytics', [
                Number(Number(analytics[poleid].pole.latitude).toFixed(1)),
                Number(Number(analytics[poleid].pole.longitude).toFixed(1)),
              ])}
              <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyAd1gCmyfr8mAbDmHj09b6bhe4lEB_qffw' }}
                defaultCenter={[
                  Number(Number(analytics[poleid].pole.latitude).toFixed(1)),
                  Number(Number(analytics[poleid].pole.longitude).toFixed(1)),
                ]}
                defaultZoom={defaultProps.zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
              >
                <AnyReactComponent
                  lat={analytics[poleid].pole.latitude}
                  lng={analytics[poleid].pole.longitude}
                  text="My Marker"
                />
              </GoogleMapReact>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
