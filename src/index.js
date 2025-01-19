// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom/client'; // Import createRoot from ReactDOM
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';

// ----------------------------------------------------------------------

// Create a root element with createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App inside the root element
root.render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);
