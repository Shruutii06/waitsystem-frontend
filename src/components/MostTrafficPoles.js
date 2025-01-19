// External Libraries (import from node_modules)
import { Box, Card, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import Framer Motion

// Internal Modules/Components
import TrafficLocationsUI from './TrafficLocationsUI';
import { FetchAllPoles } from '../redux/PolesReducer';
import Iconify from './Iconify';


export default function MostTrafficPoles() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme(); // Get the current theme
  let poles = useSelector(({ pole }) => pole.poles);

  // Sort poles to get top 5 based on serial number
  if (poles != null) {
    poles = poles
      .slice()
      .sort((a, b) => parseInt(b.serialno, 10) - parseInt(a.serialno, 10))
      .slice(0, 5);
  }

  // Get background color based on the rank
  const getBgcolor = (index) => {
    switch (index) {
      case 1:
        return '#daa606'; // Gold (Highest rank)
      case 2:
        return '#ebbd2f'; // Yellow (Second rank)
      case 3:
        return '#ffc000'; // Orange (Third rank)
      case 4:
        return '#ffdb6c'; // Light Orange (Fourth rank)
      case 5:
        return '#ffe9a6'; // Very Light Orange (Fifth rank)
      default:
        return '#D1E9FC'; // Light Blue (Fallback)
    }
  };

  // Fetch poles if not already available
  useEffect(() => {
    if (!poles || !poles.length) {
      dispatch(
        FetchAllPoles({
          callback: (msg, data, recall) => {
            recall();
          },
        })
      );
    }
  }, [poles, dispatch]);

  if (!poles || !poles.length) return null;

  // Animation for each card
  const cardVariant = {
    hidden: { opacity: 0, x: 50 }, // Cards start from the right
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  // Staggered animation for the whole grid
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
      {poles != null &&
        poles.map((pole, index) => {
          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              marginTop={1}
              key={index}
              onClick={() => navigate(`/dashboard/pole/${pole._id}`)}
              component={motion.div}
              initial="hidden"
              animate="visible"
              variants={cardVariant}
              style={{ cursor: 'pointer' }}
              whileHover={{ scale: 1.05 }} // Increase size on hover
            >
              <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', backgroundColor: getBgcolor(index + 1) }}>
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  divider={
                    <Divider
                      orientation="horizontal"
                      flexItem
                      sx={{
                        backgroundColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                      }}
                    />
                  }
                  spacing={2}
                >
                  <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
                    #{pole.serialno}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    divider={
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                          backgroundColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                        }}
                      />
                    }
                  >
                    <Stack>
                      <Box sx={{ mb: 0.5 }}>
                        <Iconify icon={'tabler:world-latitude'} color="#1877F2" width={32} height={32} />
                      </Box>

                      <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                        {pole.latitude}
                      </Typography>

                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Latitude
                      </Typography>
                    </Stack>
                    <Stack>
                      <Box sx={{ mb: 0.5 }}>
                        <Iconify icon={'tabler:world-longitude'} color="#1877F2" width={32} height={32} />
                      </Box>

                      <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                        {pole.longitude}
                      </Typography>

                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Longitude
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="h6" sx={{ textTransform: 'capitalize', color: theme.palette.text.primary }}>
                    {pole.location?.name}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
    </Grid>
  );
}
