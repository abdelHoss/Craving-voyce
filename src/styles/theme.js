import {
  unstable_createMuiStrictModeTheme,
  makeStyles
} from "@material-ui/core/styles";
import {
  cyan,
  green,
  purple
} from "@material-ui/core/colors";
import OpenSans from "../fonts/open-sans-all-600-normal.woff";
// import OpenSans from "@fontsource/open-sans/files/open-sans-all-400-normal.woff";
import HomeImage from "../images/background/craving_voyce_home_bg.jpg";
import HomeImageMobile from "../images/background/craving_voyce_home_bg_mobile.jpg";

const openSans = {

  fontFamily: 'Open Sans',
  fontStyle: 'normal',
  fontWeight: 600,
  fontDisplay: 'swap',
  src: `url(${OpenSans}) format('woff2')`,
  unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',

}

const appTheme = unstable_createMuiStrictModeTheme({
  typography: {
    fontFamily: 'Open Sans',
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [openSans],
        html: {
          WebkitFontSmoothing: 'auto',
        },
      },
    },
  },
  palette: {
    primary: {
      main: cyan[200],
      dark: cyan[700],
    },
    secondary: {
      main: purple[600],
      dark: purple[900]
    },
    info: {
      main: green['A200'],
      dark: green['A400'],
    }
  },

});


const appClasses = makeStyles((theme) => ({

  navbarDrawer: {
    width: '30%'
  },
  listingRoot: {
    display: 'flex',
  },

  navbarLink: {
    textDecoration: 'none',
    color: '#000',
  },

  filterButton: {
    position: 'absolute',
    top: 70,
    left: 10,
    width: '60px !important',
    height: '60px !important',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },

  drawer: {
    width: '25%',
    flexShrink: 0,
    textAlign: 'center',
    zIndex: 1,
    position: 'relative',
    minHeight: '70vh',
    [theme.breakpoints.down('sm')]: {
      width: '50%'
    },
    [theme.breakpoints.down('xs')]: {
      width: '70%'
    }

  },

  thePaper: {
    paddingTop: '3rem',
    width: '25%',
    [theme.breakpoints.down('sm')]: {
      width: '50%'
    },
    [theme.breakpoints.down('xs')]: {
      width: '70%'
    }
  },

  cardBox: {
    flexGrow: 1,
    minHeight: '100vh !important'
  },

  foodCard: {
    height: 160,
    width: '60%',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '80%'
    },
    [theme.breakpoints.down('xs')]: {
      height: 210
    }
  },

  footer: {
    padding: '3%',
    marginBottom: '-20px'
  },

  animationText: {
    fontWeight: 'bolder',
    width: '45%',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      width: '75%'
    },
    [theme.breakpoints.down('xs')]: {
      width: '85%',
      height: '80px'
    },
  },

  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },

  emailModalTitle: {
    margintop: 0,
    [theme.breakpoints.down('xs')]: {
      marginTop: '10%'
    }
  },

  verifyDeviceButton: {
    margin: '30px 25%',
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '80%',
      margin: '30px 10%',
    }
  },

  verifyEmailButton: {
    margin: '20px 25% 10px',
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '80%',
      margin: '20px 10% 10px',
    }
  },
  deleteButton: {
    background: '#e31212',
    color: '#fff',
    '&:hover': {
      background: '#ed5353'
    }
  },

  cravingVoyceButton: {
    color: 'white',
    background: 'linear-gradient(45deg , #2196f3 30%, #d500f9 60%)',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .30)',
  },

  styledUnderline: {
    backgroundColor: '#00acc1',
    border: 'none',
    height: '6px',
    diplay: 'fit-content'
  },

  aboutTitle: {
    fontWeight: 'bolder',
    width: 'auto',
    display: 'inline-block',
  },

  homeLink: {
    fontSize: "40px",
    textDecoration: "none",
    color: "#e0f7fa",
    '&:hover': {
      color: '#fff'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: "25px"
    }
  }
}));


/* Styles for the Home Class Component */
const styleClass = (theme) => ({
  searchAddress: {
    display: 'flex',
    width: '45%',
    borderRadius: '10px 5px 5px 10px',
    margin: '20% auto',
    [theme.breakpoints.down('md')]: {
      width: '60%'
    },
    [theme.breakpoints.down('xs')]: {
      width: '80%',
      maxHeight: '40px'
    },

  },

  homeContainer: {
    height: '90vh',
    width: '100%',
    marginTop: '60px',
    backgroundImage: `url(${HomeImage})`,
    backgroundSize: 'cover',
    backgrounRepeat: 'no-repeat',
    borderRadius: '0 0 10% 10%',
    textAlign: 'center',
    overflow: 'hidden',
    [theme.breakpoints.down('md') + ' and (orientation: portrait)']: {
      height: '40vh'
    },
    [theme.breakpoints.down('xs')]: {
      backgroundImage: `url(${HomeImageMobile})`
    }

  },

  locationIconBox: {
    width: '10%',
  },

  locationOn: {
    fontSize: '2.5rem',
    marginTop: '5px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.8rem'
    }
  },

  autocomplete: {
    width: '65%',
    [theme.breakpoints.down('xs')]: {
      width: '75%'
    }

  },
  searchAddressButton: {
    width: '15%',
    borderRadius: '0px 5px 5px 0px',

  },
  sendAddressIcon: {
    fontSize: 40,
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.8rem'
    }
  },

  marginTop10: {
    marginTop: '10%',
    minHeight: '20vh'
  },

  width30: {
    width: '30%'
  },
  width60: {
    width: '60%'
  },
  rotatingPaper: {
    padding: '20px',
    background: cyan[100],
  },

});



export {
  appTheme,
  appClasses,
  styleClass
};