import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { Box, Container, Grid, Typography, Card, Stack, CircularProgress, Divider, Paper, Avatar } from '@mui/material';

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
import MapComponent from './MapContainer';

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

    // Apply background color based on theme when component mounts
    document.body.style.backgroundColor = theme.palette.background.default;

    // Cleanup the background color when component unmounts
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [poleid, theme]);

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
    <Page title="Pole Analytics" sx={{ backgroundColor: theme.palette.background.default }}>
      <Container maxWidth="xl">
        <Stack>
          <Typography variant="h3" mt={0} mb={3} color={theme.palette.text.primary}>
            Pole Analytics
          </Typography>
        </Stack>
        <Grid container spacing={0.2}>
          <Grid container spacing={0.5} item xs={12} sm={12} md={8}>
            <Grid item xs={12} sm={12} md={12}>
              <Card sx={{ p: 3, maxWidth: '95%', margin: '0 ', backgroundColor: theme.palette.background.paper }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row', md: 'row' }}
                  spacing={2}
                  justifyContent="space-evenly"
                  alignItems="center"
                  divider={<Divider orientation="vertical" flexItem />}
                >
                  <Stack>
                    <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', backgroundColor:
                          theme.palette.mode === 'light' ? '#e6f2ff' : theme.palette.background.default, }}>
                      <Stack divider={<Divider />} spacing={3}>
                        <Typography variant="h4" color={theme.palette.text.primary}>
                          #{analytics[poleid].pole.serialno}
                        </Typography>
                        <Stack direction="row" spacing={2.5} divider={<Divider orientation="vertical" flexItem />}>
                          <Stack>
                            <Box sx={{ mb: 0.5 }}>
                              <Iconify icon={'tabler:world-latitude'} color="#1877F2" width={32} height={32} />
                            </Box>

                            <Typography variant="h6" color={theme.palette.text.primary}>
                              {analytics[poleid].pole.latitude}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" fontWeight="bold">
                              Latitude
                            </Typography>
                          </Stack>
                          <Stack>
                            <Box sx={{ mb: 0.5 }}>
                              <Iconify icon={'tabler:world-longitude'} color="#1877F2" width={32} height={32} />
                            </Box>

                            <Typography variant="h6" color={theme.palette.text.primary}>
                              {analytics[poleid].pole.longitude}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" fontWeight="bold">
                              Longitude
                            </Typography>
                          </Stack>
                        </Stack>
                        <Typography variant="h6" sx={{ textTransform: 'capitalize' }} color={theme.palette.text.primary}>
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
                        sx={{ px: 3.5, py: 1.5, textAlign: 'center', backgroundColor:
                          theme.palette.mode === 'light' ? '#e6f2ff' : theme.palette.background.default, }}
                      >
                        <Box sx={{ mb: 0.5 }}>
                          <Iconify icon={'fluent:vehicle-car-24-filled'} color="#1877F2" width={32} height={32} />
                        </Box>

                        <Typography variant="h4" color={theme.palette.text.primary}>
                          {fShortenNumber(
                            analytics[poleid].v1 ? analytics[poleid].pole.vehiclesPassed : analytics[poleid].data.length
                          )}
                        </Typography>

                        <Typography variant="body2" color="text.secondary"  fontWeight="bold">
                          Vehicles Passed
                        </Typography>
                      </Paper>

                      <Paper
                        variant="outlined"
                        sx={{ px: 4.5, py: 1.5, textAlign: 'center', backgroundColor:
                          theme.palette.mode === 'light' ? '#e6f2ff' : theme.palette.background.default, }}
                      >
                        <Box sx={{ mb: 0.5 }}>
                          <Iconify icon={'eos-icons:content-modified'} color="#1877F2" width={32} height={32} />
                        </Box>

                        <Typography variant="h4" color={theme.palette.text.primary}>
                          {FormatTime(analytics[poleid].pole.lastUpdatedAt)}
                        </Typography>

                        <Typography variant="body2" color="text.secondary"  fontWeight="bold">
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
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <MapComponent />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
