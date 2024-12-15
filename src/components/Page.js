import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { forwardRef } from 'react';
// @mui
import { Box } from '@mui/material';
import { useTheme } from '@mui/system'; // Import useTheme to access the theme

// ----------------------------------------------------------------------

const Page = forwardRef(({ children, title = '', meta, ...other }, ref) => {
  const theme = useTheme(); // Get the theme

  return (
    <>
      <Helmet>
        <title>{`${title} | Linear-AmpTech`}</title>
        {meta}
      </Helmet>

      <Box
        ref={ref}
        {...other}
        sx={{
          backgroundColor: theme.palette.background.default, // Apply the background color from the theme
          minHeight: '200vh',
          m:'0' // Optional: ensure the page takes full height
        }}
      >
        {children}
      </Box>
    </>
  );
});

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node,
};

export default Page;
