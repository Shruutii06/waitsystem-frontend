import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import 'leaflet/dist/leaflet.css';
import './MapContainerStyles.css'; // External CSS file
import Iconify from '../components/Iconify';

const MapComponent = () => {
  const mapRef = useRef(null); // Ref for the map container
  const [isFullscreen, setIsFullscreen] = useState(false); // Fullscreen state
  const [zoom, setZoom] = useState(localStorage.getItem('mzoom') || 13);

  const handleZoomIn = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setZoom(map.getZoom() + 1);
      setZoom(map.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setZoom(map.getZoom() - 1);
      setZoom(map.getZoom() - 1);
    }
  };

  const toggleFullscreen = () => {
    const element = document.querySelector('.map-container');

    if (!isFullscreen) {
      try {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        }
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        }
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('mzoom', zoom);
  }, [zoom]);

  return (
    <Box ref={mapRef} className="map-container">
      <MapContainer
        center={[29.863738515409022, 77.89554683298778]}
        zoom={zoom}
        scrollWheelZoom
        className="map"
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>

      <IconButton className="map-button layers-button" onClick={toggleFullscreen}>
        <Iconify icon={!isFullscreen ? 'eva:expand-fill' : 'eva:collapse-fill'} />
      </IconButton>

      <IconButton className="map-button zoom-in-button" onClick={handleZoomIn}>
        <Iconify icon="eva:plus-fill" />
      </IconButton>

      <IconButton className="map-button zoom-out-button" onClick={handleZoomOut}>
        <Iconify icon="eva:minus-fill" />
      </IconButton>
    </Box>
  );
};

export default MapComponent;