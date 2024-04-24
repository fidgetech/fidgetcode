import { createTheme } from '@mui/material';
import { red, green, orange, grey, cyan } from '@mui/material/colors';
import { responsiveFontSizes } from '@mui/material/styles';

const breakpoints = {
  values: { xs: 0, sm: 674, md: 900, lg: 1190, xl: 1536 }
};

let lightTheme = createTheme({
  breakpoints,
  palette: {
    mode: 'light',
    background: { default: '#ffffff', paper: '#f5f5f5' },
    green: { main: green[200] },
    orange: { main: orange[200] },
    red: { main: red[200] },
    // error: { main: red[800] },
    // warning: { main: orange[800] },
    greyButton: { main: grey[800], hover: grey[900], active: grey[900], background: grey[200] },
  },
});
lightTheme = responsiveFontSizes(lightTheme);

let darkTheme = createTheme({
  breakpoints,
  palette: {
    mode: 'dark',
    primary: cyan,
    secondary: cyan,
    background: { default: '#000000', paper: '#424242' },
    green: { main: green[600] },
    orange: { main: orange[600] },
    red: { main: red[600] },
    // error: { main: red[200] },
    // warning: { main: orange[200] },
    greyButton: { main: grey[300], hover: grey[200], active: grey[200], background: grey[800] },
  },
});
darkTheme = responsiveFontSizes(darkTheme);

const rootStyle = (theme) => ({
  width: 'auto',
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  [theme.breakpoints.up('md')]: {
    width: 800,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

const paperStyle = (theme, extraStyles) => ({
  ...{
    maxWidth: 674,
    margin: 'auto',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 900,
      padding: theme.spacing(4),
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: 1190,
      padding: theme.spacing(5),
    },
    [theme.breakpoints.up('xl')]: {
      maxWidth: 1536,
      padding: theme.spacing(6),
    },
  },
  ...extraStyles
});

export { darkTheme, lightTheme, rootStyle, paperStyle };
