import React, { useEffect } from "react";
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
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import HelpIcon from "@material-ui/icons/Help";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import UnsubscribeIcon from "@material-ui/icons/Unsubscribe";
import FingerPrintJS from "@fingerprintjs/fingerprintjs";
import RegisterEmail from "./RegisterEmail";
import UnregisterEmail from "./UnregisterEmail";
import { appClasses } from "../frontend/styles/theme";

const Navbar = () => {
  const [drawerState, setDrawerState] = React.useState(false);
  const [openRegisterModal, setOpenRegisterModal] = React.useState(false);
  const [openUnsubscribeModal, setOpenUnsubscribeModal] = React.useState(false);
  const [fingerprintExist, setFingerprintExist] = React.useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = React.useState(null);
  const [actualEmail, setActualEmail] = React.useState(null);

  const verifyFingerprint = () => {
    const fpPromise = FingerPrintJS.load();
    (async () => {
      const fp = await fpPromise;
      const result = await fp.get();
      setDeviceFingerprint(result.visitorId);
      fetch(process.env.REACT_APP_SERVER + "/verify/fingerprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret_key: process.env.REACT_APP_SECRET_KEY,
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

  useEffect(() => verifyFingerprint());

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
            <Link className={classes.navbarLink} to="/">
              <Typography edge="start" className="header-title">
                Craving Voyce
              </Typography>
            </Link>
          </Box>
          <IconButton onClick={() => setDrawerState(true)}>
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
            onClose={() => setDrawerState(false)}
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
              onClick={() => setDrawerState(false)}
              onKeyDown={() => setDrawerState(false)}
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

      <UnregisterEmail
        open={openUnsubscribeModal}
        dialogState={setOpenUnsubscribeModal}
        fingerprintState={setFingerprintExist}
        fingerprint={deviceFingerprint}
        fingerprintExist={fingerprintExist}
        email={actualEmail || localStorage.getItem("emailAddress")}
      />
    </Container>
  );
};

export default Navbar;
