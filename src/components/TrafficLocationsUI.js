// @mui
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Avatar, Paper, Typography, Stack } from '@mui/material'; // Import Stack for alignment
import { useNavigate } from 'react-router-dom';
// utils
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // Import car icon

import { fShortenNumber } from '../utils/formatNumber';
// components

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  width: theme.spacing(10),
  height: theme.spacing(10),
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2.5),
}));

// ----------------------------------------------------------------------

TrafficLocationsUI.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  subtitle1: PropTypes.string,
  subtitle2: PropTypes.string,
  title: PropTypes.string.isRequired,
  total: PropTypes.oneOfType([PropTypes.number, PropTypes.element]).isRequired, // Update to allow JSX element
  sx: PropTypes.object,
};

export default function TrafficLocationsUI({ title, subtitle1, subtitle2, bgcolor, total, id, icon, color = 'primary', sx, ...other }) {
  const navigate = useNavigate();

  return (
    <Paper
      variant="outlined"
      onClick={() => navigate(`/dashboard/location/${id}`)}
      sx={{
        width: '100%',
        cursor: 'pointer',
        p: 1.5,
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        bgcolor,
        ...sx,
      }}
      {...other}
    >
       <IconWrapperStyle
        sx={{
          color: (theme) => theme.palette[color].dark,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(theme.palette[color].dark, 0.24)} 100%)`,
        }}
      >
        <Avatar alt="Remy Sharp" src={icon} sx={{ width: '100%', height: '100%' }} />
      </IconWrapperStyle>

      <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
        <DirectionsCarIcon fontSize="large" sx={{ color: (theme) => theme.palette.text.primary }} /> {/* Icon color based on theme */}
        <Typography variant="h3" sx={{ color: (theme) => theme.palette.text.primary }}>
          {fShortenNumber(total)}
        </Typography>
      </Stack>

      <Typography variant="h6" sx={{  textTransform: 'capitalize', color: (theme) => theme.palette.text.primary }}>
        {title}
      </Typography>
      <Typography variant="subtitle1" sx={{  textTransform: 'capitalize', color: (theme) => theme.palette.text.primary }}>
        {subtitle1}
      </Typography>
      <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', color: (theme) => theme.palette.text.secondary }}>
        {subtitle2}
      </Typography>
    </Paper>
  );
}
