import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card } from '@mui/material';
import Page from '../components/Page';
import HighTrafficLocations from '../components/HighTrafficLocations';
import MostTrafficPoles from '../components/MostTrafficPoles';
import WeeklyVechilesPassed from '../components/WeeklyVechilesPassed';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();

  // Apply background color to the entire body when the component is mounted
  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;

    // Cleanup the background color when the component is unmounted
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme]);

  return (
    <Page title="Dashboard" sx={{ maxWidth: '100%' }}>
      <Container maxWidth="xl">
        <Typography 
          sx={{ 
            mb: 5, 
            fontSize: '1.8rem', 
            fontWeight: 'bold', 
            color: theme.palette.text.primary // Text color based on theme
          }}
        >
          Hi, Welcome back
        </Typography>

        <Grid container spacing={2}>
          {/* Top 5 High Traffic Locations */}
          <Grid container spacing={2} item xs={12} sm={12} md={12}>
            <Card sx={{ p: 4, width: '100%', backgroundColor: 'background.default', boxShadow: 'none' }}>
              <Typography 
                sx={{ 
                  mb: 3, 
                  ml: 2, 
                  color: theme.palette.text.primary // Text color based on theme
                }} 
                variant="h4"
              >
                Top 5 High Traffic Locations
              </Typography>
              <HighTrafficLocations />
            </Card>
          </Grid>

          {/* Top 5 Traffic Poles */}
          <Grid container spacing={2} item xs={12} sm={12} md={12}>
            <Card sx={{ p: 4, width: '100%', backgroundColor: 'transparent', boxShadow: 'none' }}>
              <Typography 
                sx={{ 
                  mb: 3, 
                  ml: 2, 
                  color: theme.palette.text.primary // Text color based on theme
                }} 
                variant="h4"
              >
                Top 5 Traffic Poles
              </Typography>
              <MostTrafficPoles />
            </Card>
          </Grid>

          {/* Weekly Vehicles Passed */}
          <WeeklyVechilesPassed />
        </Grid>
      </Container>
    </Page>
  );
}
