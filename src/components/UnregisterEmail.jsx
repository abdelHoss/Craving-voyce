import React from "react";

import {
  Dialog,
  IconButton,
  DialogTitle,
  DialogActions,
  Button,
  Slide,
  useMediaQuery,
} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CloseIcon from "@material-ui/icons/Close";
import { appClasses } from "../frontend/styles/theme";

const slideUp = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UnregisterEmail = (props) => {
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const unregister = () => {
    fetch(process.env.REACT_APP_SERVER + "/delete/device/fingerprint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret_key: process.env.REACT_APP_SECRET_KEY,
        fingerprint: props.fingerprint,
      }),
    })
      .then((response) => response.json())
      .then((confirm) => {
        if (confirm === true) {
          props.dialogState(false);
        }
      })
      .catch((err) => err);
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
        edge="start"
        onClick={() => props.dialogState(false)}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle
        disableTypography={smallScreen}
        className={
          props.fingerprintExist
            ? classes.unregisterModalTitle
            : classes.emailModalTitle
        }
      >
        {props.fingerprintExist
          ? "Are you sure to unregister all devices linked with " + props.email
          : "You're device is not registered"}
      </DialogTitle>
      <DialogActions>
        <Button
          onClick={unregister}
          variant="contained"
          disabled={!props.fingerprintExist}
          size="large"
          className={props.fingerprintExist ? classes.deleteButton : ""}
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
  );
};

export default UnregisterEmail;
