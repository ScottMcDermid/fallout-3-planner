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
      default: '#1e1e1e',
      paper: '#252525',
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
