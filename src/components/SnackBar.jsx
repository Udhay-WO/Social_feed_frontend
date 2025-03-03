/* eslint-disable react/prop-types */
import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
export default function SnackBar({ open, message, set }) {
  const handleClose = () => set();
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  return (
    <div>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={message.includes("successful") ? "success" : "error"}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
