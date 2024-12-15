import { useEffect } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Container, Stack, Typography } from '@mui/material'; 
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Page from '../components/Page';
import places from '../utils/Places.json';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
  backgroundColor: theme.palette.background.default, // Ensures background color is applied
}));

export default function RealTimeMap() {
  const theme = useTheme();  // Access theme for dynamic styling

  // Apply background color to the entire body when the component is mounted
  useEffect(() => {
    // Apply background color to the body and root container
    document.body.style.backgroundColor = theme.palette.background.default;
    document.getElementById('root').style.backgroundColor = theme.palette.background.default;

    // Cleanup the background color when component unmounts
    return () => {
      document.body.style.backgroundColor = '';
      document.getElementById('root').style.backgroundColor = '';
    };
  }, [theme]);

  const defaultProps = {
    center: [29.8646495, 77.8938784],
    zoom: 9,
  };

  return (
    <Page title="Realtime Map">
      <Container sx={{ backgroundColor: theme.palette.background.default }}>
        <Stack sx={{ mt: '0', mb: '0' }}>
          <Typography variant="h3" color={theme.palette.text.primary}>
            Realtime Map
          </Typography>
        </Stack>

        {/* Apply background color for content */}
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <div style={{ height: '100vh', width: '100%' }}>
            <MapContainer
              center={defaultProps.center}
              zoom={defaultProps.zoom}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              />
              {places.results.map((place) => (
                <LeafletMarker
                  key={place.id}
                  position={[place.geometry.location.lat, place.geometry.location.lng]}
                >
                  <Popup>{place.name}</Popup>
                </LeafletMarker>
              ))}
            </MapContainer>
          </div>
        </ContentStyle>
      </Container>
    </Page>
  );
}
