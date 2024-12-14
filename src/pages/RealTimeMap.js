import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
// Leaflet dependencies
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Leaflet assets
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// Custom components and data
import Page from '../components/Page';
import Marker from './Marker';
import places from '../utils/Places.json';


const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  const defaultProps = {
    center: [29.8646495, 77.8938784],
    zoom: 9,
  };

  return (
    <Page title="Realtime Map">
      <Container>
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

          {/* Add additional UI elements as needed */}

        </ContentStyle>
      </Container>
    </Page>
  );
}
