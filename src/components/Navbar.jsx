import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Slide,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import HelpIcon from "@material-ui/icons/Help";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import UnsubscribeIcon from "@material-ui/icons/Unsubscribe";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CloseIcon from "@material-ui/icons/Close";
import FingerPrintJS from "@fingerprintjs/fingerprintjs";
import RegisterEmail from "./RegisterEmail";
import { appClasses } from "../styles/theme";

const environment = {
  request: {
    key: "TmV3T3JkZXI4NTQzMmZvckdyZWVuQ3JhdmluZ3RoZURlbGl2ZXJ5Vm95Y2VBbG90TW9yZWV4dHJhdmFnYW50RWFzaWVyU0ltcGxlckJlYXV0aWZ1bE1pa2VSb3RoODk1NjMyQXN0cmF6V2FybmVyQ3V6",
  },
};

const BASE_URL = "http://localhost:5000";

const slideUp = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Navbar = () => {
  const [drawerState, setDrawerState] = React.useState(false);
  const [openRegisterModal, setOpenRegisterModal] = React.useState(false);
  const [openUnsubscribeModal, setOpenUnsubscribeModal] = React.useState(false);
  const [fingerprintExist, setFingerprintExist] = React.useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = React.useState(null);
  const [actualEmail, setActualEmail] = React.useState(null);

  window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    event.returnValue = "";
    fetch(BASE_URL + "/close/browser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret_key: environment.request.key }),
    });
  });

  const verifyFingerprint = () => {
    const fpPromise = FingerPrintJS.load();
    (async () => {
      const fp = await fpPromise;
      const result = await fp.get();
      setDeviceFingerprint(result.visitorId);
      fetch(BASE_URL + "/verify/fingerprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret_key: environment.request.key,
          fingerprint: result.visitorId,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.found_record) {
            setFingerprintExist(true);
            setActualEmail(res.email_record);
          } else setFingerprintExist(false);
        })
        .catch((err) => err);
    })();
  };

  const unregister = () => {
    fetch(BASE_URL + "/delete/device/fingerprint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret_key: environment.request.key,
        fingerprint: deviceFingerprint,
      }),
    })
      .then((response) => response.json())
      .then((confirm) => {
        if (confirm === true) {
          setOpenUnsubscribeModal(false);
          setFingerprintExist(false);
        }
      })
      .catch((err) => err);
  };

  const classes = appClasses();

  return (
    <Container>
      <AppBar
        position="fixed"
        style={{
          zIndex: 2,
        }}
      >
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            <Typography edge="start" className="header-title">
              Craving Voyce
            </Typography>
          </Box>
          <IconButton
            onClick={() => {
              setDrawerState(true);
              verifyFingerprint();
            }}
          >
            <MenuIcon
              style={{
                fontSize: "2.5rem",
              }}
            />
          </IconButton>
          <Drawer
            className={classes.navbarDrawer}
            anchor="right"
            open={drawerState}
            onClose={() => {
              setDrawerState(false);
            }}
          >
            <Box color="primary">
              <Typography
                align="center"
                style={{
                  margin: "1.5rem auto",
                }}
                variant="h4"
              >
                Menu
              </Typography>
            </Box>
            <Box
              style={{
                width: 250,
              }}
              role="presentation"
              onClick={() => {
                setDrawerState(false);
              }}
              onKeyDown={() => {
                setDrawerState(false);
              }}
            >
              <List>
                <Divider />
                <Link to="/" className={classes.navbarLink}>
                  <ListItem button key="home">
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItem>
                </Link>
                <Divider />
                <ListItem
                  button
                  key="register"
                  onClick={() => setOpenRegisterModal(true)}
                >
                  <ListItemIcon>
                    <PersonAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItem>
                <Divider />
                <ListItem
                  button
                  key="unregister"
                  onClick={() => setOpenUnsubscribeModal(true)}
                >
                  <ListItemIcon>
                    <UnsubscribeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Unregister" />
                </ListItem>
                <Divider />
                <Link to="/about/us" className={classes.navbarLink}>
                  <ListItem button key="about">
                    <ListItemIcon>
                      <HelpIcon />
                    </ListItemIcon>
                    <ListItemText primary="About us" />
                  </ListItem>
                </Link>
                <Divider />
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </AppBar>
      <RegisterEmail
        open={openRegisterModal}
        fingerprint={deviceFingerprint}
        dialogState={setOpenRegisterModal}
        fingerprintExist={fingerprintExist}
      />
      <Dialog
        open={openUnsubscribeModal}
        TransitionComponent={slideUp}
        fullWidth={true}
        style={{
          textAlign: "center",
        }}
      >
        <IconButton
          className={classes.closeButton}
          edge="start"
          onClick={() => setOpenUnsubscribeModal(false)}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle className={classes.emailModalTitle}>
          {fingerprintExist
            ? "Are you sure to unregister all devices linked with " +
              actualEmail
            : "You're device is not registered"}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={unregister}
            variant="contained"
            disabled={!fingerprintExist}
            size="large"
            className={fingerprintExist ? classes.deleteButton : ""}
            style={{
              width: "60%",
              margin: "auto",
            }}
            endIcon={<DeleteForeverIcon />}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Navbar;
