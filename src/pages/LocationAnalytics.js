import { CircularProgress, Grid, Card, Paper, Box, Typography, Divider, Stack, Container, CardContent } from '@mui/material';  // Move MUI imports here
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import LocationPieChart from '../components/LocationPieChart';  // Other imports below MUI imports
import Iconify from '../components/Iconify';
import Page from '../components/Page';
import { FetchLocation, FetchLocationAnalytics, FetchPolesOfLocation } from '../redux/locationReducer';
import Error from './Error';
import { fShortenNumber } from '../utils/formatNumber';

const DEFAULT_IMAGE =
  'https://media.istockphoto.com/vectors/city-urban-streets-roads-abstract-map-vector-id1137117479?k=20&m=1137117479&s=612x612&w=0&h=56n_1vX4IdhkyNZ0Xj6NfSPA0jZSwf6Ru2K68udk4H4=';

export default function LocationAnalytics() {
  const theme = useTheme();
  const navigate = useNavigate();

  const { locationid } = useParams();
  const dispatch = useDispatch();

  const location = useSelector(({ location }) => location.analytics[locationid]);
  const poles = useSelector(({ location }) => location.poles[locationid]);

  const [Fetchingerror, setFetchingerror] = useState(false);

  useEffect(() => {
    if (locationid && locationid.length === 24) {
      dispatch(
        FetchLocation({
          payload: { id: locationid },
          callback: (msg, data, recall) => {
            if (msg === 'error') {
              setFetchingerror(true);
              toast.error(typeof data === 'string' ? data : 'Error in fetching location analytics', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            } else {
              dispatch(FetchLocationAnalytics({ payload: { id: locationid } }));
              dispatch(FetchPolesOfLocation({ payload: { id: locationid } }));
              recall();
            }
          },
        })
      );
    } else {
      setFetchingerror(true);
    }
  }, [locationid]);

  if (Fetchingerror) {
    return <Error />;
  }

  if (!location)
    return (
      <center style={{ marginTop: '180px' }}>
        <CircularProgress size={20} />
      </center>
    );

  return (
    <Page title="Location Analytics">
      <Container maxWidth="xl">
        <Stack>
          <Typography variant="h3" mt={0} mb={3}>
            Location Analytics
          </Typography>
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7} md={8} lg={8} xl={8}>
            <Card sx={{ p: 3, backgroundColor: '#e6f3ff' }}>
              <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row' }}
                spacing={{ xs: 1.2, sm: 1.2, md: 3 }}
                divider={<Divider orientation="vertical" flexItem />}
              >
                <Stack
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <img
                      style={{ width: '100%', borderRadius: 10 }}
                      src={location.photo || DEFAULT_IMAGE}
                      alt={location.name}
                    />
                  </Box>
                  <Typography sx={{ mt: 2, textTransform: 'capitalize' }} variant="subtitle2" color="text.primary">
                    {location.name}
                  </Typography>
                  <Typography sx={{ textTransform: 'capitalize' }} variant="subtitle2" color="text.primary">
                    {location.district}
                    {', '}
                  </Typography>
                  <Typography sx={{ textTransform: 'capitalize' }} variant="subtitle2" color="text.primary">
                    {location.state}
                  </Typography>
                  <Typography sx={{ textTransform: 'capitalize' }} variant="subtitle2" color="text.primary">
                    {'PinCode: '}
                    {location.pincode}
                  </Typography>
                </Stack>

                <Stack divider={<Divider />} spacing={3} justifyContent="center">
                  <Stack
                    direction="column"
                    spacing={3}
                    divider={<Divider orientation="vertical" flexItem />}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Paper
                      variant="outlined"
                      sx={{ px: 2.5, py: 2.5, textAlign: 'center', backgroundColor: '#ffe9a6' }}
                    >
                      <Box sx={{ mb: 0.5 }}>
                        <Iconify icon={'emojione-monotone:barber-pole'} color="#1877F2" width={32} height={32} />
                      </Box>

                      <Typography variant="h3">
                        {Number.isNaN(location.poles?.length) ? '...' : fShortenNumber(location.poles?.length)}
                      </Typography>

                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Poles Installed
                      </Typography>
                    </Paper>

                    <Paper
                      variant="outlined"
                      sx={{ px: 2.5, py: 2.5, textAlign: 'center', backgroundColor: '#ffe9a6' }}
                    >
                      <Box sx={{ mb: 0.5 }}>
                        <Iconify icon={'fluent:vehicle-car-24-filled'} color="#1877F2" width={32} height={32} />
                      </Box>

                      <Typography variant="h3">
                        {Number.isNaN(location.analytics?.totalVehicles)
                          ? '...'
                          : fShortenNumber(location.analytics?.totalVehicles)}
                      </Typography>

                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Vehicles Passed
                      </Typography>
                    </Paper>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={5} md={4} lg={4} xl={4} textAlign="center">
            <Card>
              <CardContent>
                {location.analytics?.totalVehicles > 0 && Array.isArray(poles) && poles?.length ? (
                  <LocationPieChart
                    title="Vehicles Passed"
                    chartData={poles?.map((pole) => ({
                      label: `#${pole.serialno}`,
                      value: pole.vehiclesPassed,
                    }))}
                  />
                ) : (
                  <Stack direction="column" spacing={6} justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" component="div">
                      Sorry, No Data to Show!
                    </Typography>
                    <img alt="nodata" src="/static/illustrations/illustration_nodata.jpg" />
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card
          sx={{
            height: '40vh',
            width: '100%',
            marginTop: '3%',
            borderRadius: '10px',
          }}
        >
          {/* React Leaflet Map Component */}
          <MapContainer
            center={[56.2, 36.1]}
            zoom={9}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[25.2, 36.2]}>
              <Popup>
                My Marker
              </Popup>
            </Marker>
          </MapContainer>
        </Card>
      </Container>
    </Page>
  );
}
