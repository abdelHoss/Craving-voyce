import React from "react";
import {
  Dialog,
  IconButton,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
  Slide,
  Typography,
  Container,
  Fade,
  Box,
  useMediaQuery,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import { appClasses } from "../frontend/styles/theme";

const slideUp = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RegisterEmail = (props) => {
  const [emailForm, setEmailForm] = React.useState("");
  const [emailValid, setEmailValid] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [openSecurityPin, setOpenSecurityPin] = React.useState(false);
  const [securityPinError, setSecurityPinError] = React.useState(false);

  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("xs"));

  window.onload = () => {
    const element = localStorage.getItem("emailAddress");
    if (element !== "null" && element !== null) setOpenSecurityPin(true);
  };

  const analyseEmail = (elem) => {
    removeEmailErr();
    const email_regex =
      /^([a-zA-Z\d._-]+)@([a-zA-Z\d-]+)\.([a-zA-Z]{2,8})(\.[a-zA-Z]{2,8})?$/;
    elem.target.value.match(email_regex)
      ? setEmailValid(true)
      : setEmailValid(false);
  };

  const analyseChar = (event) => {
    const value = event.target.value;
    if (value.length > 7) {
      event.target.value = value.slice(0, 8);
      verifyPin(value);
    }
  };

  const verifyEmail = () => {
    setTimeout(() => setEmailValid(false), 10);
    const email = document.getElementById("emailInput").value;
    fetch(process.env.REACT_APP_SERVER + "/verify/email/exist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret_key: process.env.REACT_APP_SECRET_KEY,
        fingerprint: props.fingerprint,
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.response) {
          removeEmailErr();
          setSecurityPinError("");
          if (res.length === 0) {
            setEmailForm(email);
            setOpenSecurityPin(true);
            localStorage.setItem("emailAddress", emailForm);
          } else {
            props.dialogState(false);
            localStorage.setItem("emailAddress", "null");
          }
        } else {
          setEmailError(true);
          setEmailErrorMessage(res.error);
          setEmailValid(false);
        }
      })
      .catch((err) => err);
  };

  const removeEmailErr = () => {
    setEmailError(false);
    setEmailErrorMessage("");
  };

  const verifyPin = (value) => {
    fetch(process.env.REACT_APP_SERVER + "/verify/security/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret_key: process.env.REACT_APP_SECRET_KEY,
        security_pin: value,
        fingerprint: props.fingerprint,
        email: emailForm,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (!res.valid && !res.deleted)
          setSecurityPinError("Invalid security code");
        else if (res.expired || res.deleted)
          setSecurityPinError(
            "Resend another confirmation to your email, this one has expired"
          );
        else {
          props.dialogState(false);
          setOpenSecurityPin(false);
          setSecurityPinError("");
          localStorage.setItem("emailAddress", "null");
        }
      });
  };

  const deleteToken = () => {
    setOpenSecurityPin(false);
    setEmailValid(false);
    setSecurityPinError("");
    localStorage.setItem("emailAddress", "null");
    fetch(process.env.REACT_APP_SERVER + "/delete/security/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret_key: process.env.REACT_APP_SECRET_KEY,
        fingerprint: props.fingerprint,
      }),
    });
  };

  const classes = appClasses();

  return (
    <Dialog
      open={props.open}
      TransitionComponent={slideUp}
      fullWidth={true}
      style={{
        textAlign: "center",
      }}
    >
      <IconButton
        className={classes.closeButton}
        onClick={() => {
          props.dialogState(false);
          setEmailValid(false);
          removeEmailErr();
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle
        disableTypography={smallScreen}
        className={classes.emailModalTitle}
      >
        {openSecurityPin
          ? "Confirm the security number sent to your email mailbox"
          : "Confirm your email"}
      </DialogTitle>
      <Box
        width={{ xs: 1, sm: "90%" }}
        mx="auto"
        display={openSecurityPin ? "" : "none"}
      >
        <Alert severity="warning">
          <Typography variant={smallScreen ? "caption" : "body2"}>
            If you dont find the email, please verify your Junk and Spam folder.
          </Typography>
          <Typography variant={smallScreen ? "caption" : "body2"}>
            You have a limit of 5 minutes to verify your security number.
          </Typography>
        </Alert>
      </Box>
      {!openSecurityPin && (
        <Container>
          <TextField
            onChange={analyseEmail}
            autoFocus
            id="emailInput"
            margin="normal"
            label="Email Address"
            type="email"
            color="secondary"
            variant="filled"
            error={emailError}
            helperText={emailErrorMessage}
            style={{
              width: "80%",
              margin: "0 10%",
            }}
            disabled={props.fingerprintExist}
          />
          <Typography
            variant="subtitle1"
            style={{
              color: "#388e3c",
              display: props.fingerprintExist ? "" : "none",
            }}
            align="center"
            gutterBottom={true}
          >
            Your device is already registered
          </Typography>

          <DialogActions>
            <Button
              onClick={verifyEmail}
              className={
                emailValid && !props.fingerprintExist
                  ? classes.verifyEmailButton + " " + classes.cravingVoyceButton
                  : classes.verifyEmailButton
              }
              variant="contained"
              disabled={!emailValid || props.fingerprintExist}
              size="large"
              endIcon={<AlternateEmailIcon />}
            >
              Confirm
            </Button>
          </DialogActions>
        </Container>
      )}

      {openSecurityPin && (
        <Fade in={openSecurityPin}>
          <Container style={{ margin: "5% auto" }}>
            <TextField
              onInput={analyseChar}
              type="number"
              label="Security number"
              onKeyDown={(e) =>
                [69, 107, 190, 189].includes(e.keyCode) && e.preventDefault()
              }
              InputProps={{ className: classes.pinInput }}
              InputLabelProps={{ className: classes.pinLabelInput }}
              error={securityPinError.length > 0}
              variant="outlined"
              color="secondary"
              disabled={
                securityPinError.length > 0 &&
                securityPinError.charAt(0) === "R"
              }
            />
            <Typography align="center" color="error" variant="body2">
              {securityPinError}
            </Typography>
            <Button
              onClick={deleteToken}
              variant="outlined"
              color="secondary"
              fullWidth={smallScreen ? true : false}
              size="large"
              className={classes.anotherButton}
            >
              Send another confirmation
            </Button>
          </Container>
        </Fade>
      )}
    </Dialog>
  );
};

export default RegisterEmail;
