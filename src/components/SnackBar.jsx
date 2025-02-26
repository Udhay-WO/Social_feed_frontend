/* eslint-disable react/prop-types */
import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";

export default function SnackBar({ open, set, message }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    set(false);
  };
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      ></IconButton>
    </React.Fragment>
  );
  return (
    <div>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </div>
  );
}
