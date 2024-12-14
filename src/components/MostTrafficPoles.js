import { Box, Card, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TrafficLocationsUI from './TrafficLocationsUI';
import { FetchAllPoles } from '../redux/PolesReducer';
import Iconify from './Iconify';

export default function MostTrafficPoles() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let poles = useSelector(({ pole }) => pole.poles);

  if (poles != null) {
    poles = poles
      .slice()
      .sort((a, b) => parseInt(b.serialno, 10) - parseInt(a.serialno, 10))
      .slice(0, 5);
  }

  console.log(poles);

  const getBgcolor = (index) => {
    switch (index) {
      case 1:
        return '#daa606';
      case 2:
        return '#ebbd2f';
      case 3:
        return '#ffc000';
      case 4:
        return '#ffdb6c';
      case 5:
        return '#ffe9a6';
      default:
        return '#D1E9FC';
    }
  };

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
  }, []);

  if (!poles || !poles.length) return null;

  return (
    <>
      <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'left' }}>
        {poles != null &&
          poles.map((pole, index) => {
            return (
              <Grid
                item
                style={{ cursor: 'pointer' }}
                xs={12}
                sm={6}
                md={4}
                key={index}
                onClick={() => navigate(`/dashboard/pole/${pole._id}`)}
              >
                <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', backgroundColor: getBgcolor(index + 1) }}>
                  <Stack
                    justifyContent="center"
                    alignItems="center"
                    divider={<Divider orientation="horizontal" flexItem />}
                    spacing={3}
                  >
                    <Typography variant="h4">#{pole.serialno}</Typography>
                    <Stack direction="row" spacing={2.5} divider={<Divider orientation="vertical" flexItem />}>
                      <Stack>
                        <Box sx={{ mb: 0.5 }}>
                          <Iconify icon={'tabler:world-latitude'} color="#1877F2" width={32} height={32} />
                        </Box>

                        <Typography variant="h6">{pole.latitude}</Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Latitude
                        </Typography>
                      </Stack>
                      <Stack>
                        <Box sx={{ mb: 0.5 }}>
                          <Iconify icon={'tabler:world-longitude'} color="#1877F2" width={32} height={32} />
                        </Box>

                        <Typography variant="h6">{pole.longitude}</Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Longitude
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                      {pole.location?.name}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
}