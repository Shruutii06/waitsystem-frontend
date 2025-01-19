import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card, Divider } from '@mui/material';
import { motion } from 'framer-motion'; // Import Framer Motion
import Page from '../components/Page';
import HighTrafficLocations from '../components/HighTrafficLocations';
import MostTrafficPoles from '../components/MostTrafficPoles';
import WeeklyVechilesPassed from '../components/WeeklyVechilesPassed';

export default function DashboardApp() {
  const theme = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme]);

  // Animation variants
  const textVariant = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4, // Stagger each child animation by 0.3 seconds
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <Page title="Dashboard" sx={{ maxWidth: '100%' }}>
      <Container maxWidth="xl">
        {/* Welcome Section */}
        <Container
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={staggerVariant}
          sx={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            marginBottom: '80px',
            marginTop: '15px',
          }}
        >
          <Typography
            component={motion.div}
            variants={textVariant}
            sx={{
              fontSize: '2.6rem',
              fontWeight: 'bold',
              color: theme.palette.text.primary,
            }}
          >
            Welcome
          </Typography>
          <Typography
            component={motion.div}
            variants={textVariant}
            sx={{
              fontSize: '2.6rem',
              fontWeight: 'bold',
              color: theme.palette.text.primary,
            }}
          >
            to
          </Typography>
          <Typography
            component={motion.div}
            variants={textVariant}
            sx={{
              fontFamily: 'Times New Roman',
              fontSize: '2.7rem',
              fontWeight: 'bold',
              color: '#2b8205',
            }}
          >
            LINEAR
          </Typography>
          <Typography
            component={motion.div}
            variants={textVariant}
            sx={{
              fontFamily: 'Times New Roman',
              fontSize: '2.7rem',
              fontWeight: 'bold',
              color: '#bc0a0a',
            }}
          >
            AMP-
          </Typography>
          <Typography
            component={motion.div}
            variants={textVariant}
            sx={{
              fontFamily: 'Times New Roman',
              fontSize: '2.7rem',
              fontWeight: 'bold',
              color: '#0868bf',
            }}
          >
            TECH
          </Typography>
        </Container>

        {/* Dashboard Content */}
        <Grid
          container
          spacing={1}
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={staggerVariant}
        >
          {/* Top 5 High Traffic Locations */}
          <Grid
            container
            spacing={2}
            xs={12}
            sm={12}
            md={12}
            component={motion.div}
            variants={itemVariant}
          >
            <Card
              sx={{
                p: { xs: 2, sm: 4 },
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '50px',
                alignItems: 'center',
                backgroundColor: 'transparent',
                boxShadow: 'none',
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: theme.palette.mode === 'light' ? '#002446' : '#e3f1ff',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                Top 5 High Traffic Locations
              </Typography>
              {/* HighTrafficLocations Component */}
              <HighTrafficLocations />
            </Card>
          </Grid>

          {/* Divider */}
          <Grid item xs={12} component={motion.div} variants={itemVariant}>
            <Divider
              sx={{
                borderColor: theme.palette.divider,
                marginY: 2,
                height: '0.1rem',
                backgroundColor: 'darkgrey',
              }}
            />
          </Grid>

          {/* Top 5 Traffic Poles */}
          <Grid
            container
            spacing={2}
            item
            xs={12}
            sm={12}
            md={12}
            component={motion.div}
            variants={itemVariant}
          >
            <Card
              sx={{
                p: { xs: 2, sm: 4 },
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '50px',
                alignItems: 'center',
                backgroundColor: 'transparent',
                boxShadow: 'none',
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: theme.palette.mode === 'light' ? '#002446' : '#e3f1ff',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                Top 5 Traffic Poles
              </Typography>
              {/* MostTrafficPoles Component */}
              <MostTrafficPoles />
            </Card>
          </Grid>

          {/* Weekly Vehicles Passed */}
          <Grid
            container
            spacing={2}
            item
            xs={12}
            sm={12}
            md={12}
            component={motion.div}
            variants={itemVariant}
          >
            <WeeklyVechilesPassed />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
