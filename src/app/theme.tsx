import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e5e7eb',
    },
    secondary: {
      main: '#4ade80',
    },
    error: {
      main: '#ef4444',
    },
    background: {
      default: '#1a1e1b',
      paper: '#212620',
    },
    text: {
      primary: '#e5e7eb',
      secondary: '#4ade80',
    },
  },
  typography: {
    fontSize: 12,
  },
});

export default theme;
