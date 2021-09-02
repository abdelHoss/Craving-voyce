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
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import { appClasses } from "../styles/theme";

const slideUp = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const environment = {
  request: {
    key: "TmV3T3JkZXI4NTQzMmZvckdyZWVuQ3JhdmluZ3RoZURlbGl2ZXJ5Vm95Y2VBbG90TW9yZWV4dHJhdmFnYW50RWFzaWVyU0ltcGxlckJlYXV0aWZ1bE1pa2VSb3RoODk1NjMyQXN0cmF6V2FybmVyQ3V6",
  },
};

const BASE_URL = "http://localhost:5000";

const RegisterEmail = (props) => {
  const [emailValid, setEmailValid] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");

  const analyseEmail = (elem) => {
    removeEmailErr();
    const email_regex =
      /^([a-zA-Z\d._-]+)@([a-zA-Z\d-]+)\.([a-zA-Z]{2,8})(\.[a-zA-Z]{2,8})?$/;
    elem.target.value.match(email_regex)
      ? setEmailValid(true)
      : setEmailValid(false);
  };

  const verifyEmail = () => {
    const email = document.getElementById("emailInput").value;
    fetch(BASE_URL + "/verify/email/exist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret_key: environment.request.key,
        fingerprint: props.fingerprint,
        email: email,
      }),
    })
      .then((response) => response.json())
      .then(res => {
        if (res.response) {
          props.dialogState(false);
          removeEmailErr();
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
      <DialogTitle className={classes.emailModalTitle}>
        {" "}
        Confirm your email{" "}
      </DialogTitle>
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
      {props.fingerprintExist && (
        <Typography
          variant="subtitle1"
          style={{
            color: "#388e3c",
          }}
          align="center"
          gutterBottom={true}
        >
          Your device is already registered
        </Typography>
      )}
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
    </Dialog>
  );
};

export default RegisterEmail;
