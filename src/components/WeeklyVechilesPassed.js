import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import PenaltyStatsUI from './PenaltyStatsUI';

export default function PenaltyStats() {
  const theme = useTheme();

  // Generate past 7 days for the chart labels
  const past7Days = [...Array(7).keys()].map((index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    return date.toDateString().slice(4); // Date format e.g., 'Dec 11'
  });

  // Initialize vehicle counts array
  const vehicles = [0, 0, 0, 0, 0, 0, 0];
  const poles = useSelector(({ pole }) => pole.poles);

  console.log('Poles:', poles); // Debugging the poles data

  // Process poles data and sum up vehicles passed each day for the last 7 days
  if (poles != null) {
    poles.forEach((pole) => {
      for (let i = 0; i < 7; i += 1) {
        vehicles[i] += pole.pastResults?.[i] || 0; // Ensure `pastResults` exists
      }
    });
  }

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Typography variant="h2" align="center" gutterBottom width='25%'>
          Weekly Vehicles Passed
        </Typography>
      <Grid item xs={12} md={6} lg={8}>
        {/* Add the weekly vehicles passed heading here */}
        

        
        <PenaltyStatsUI
          title="Vehicles Passed"
          subheader="(+30%) than last Week"
          chartData={past7Days.map((day, index) => ({
            label: day,
            value: vehicles[index],
          }))}
          chartColors={theme.palette.mode === 'dark' ? ['#FFFFFF', '#D3D3D3'] : ['#000000', '#707070']}
            // Background color for the chart
        />
      </Grid>
    </Grid>
  );
}
