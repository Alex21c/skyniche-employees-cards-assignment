import * as React from "react";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function MuiSnackbar({ open, setOpen, snackbarState }) {
  // console.log(snackbarState)

  // const [open, setOpen] = React.useState(false);

  // default message
  if (snackbarState?.msg === null) {
    snackbarState.msg = "test message";
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      {/* <Button onClick={()=>{openTheSnackBar(setOpen)}}>Open Snackbar</Button> */}
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarState?.successOrError}
          sx={{ width: "100%" }}
        >
          {snackbarState?.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export function useSetInitialStateSnackbar() {
  const [open, setOpen] = React.useState(false);
  return [open, setOpen];
}
export function openTheSnackBar(setOpen) {
  setOpen(true);
}

export function showErrorMsg(msg, setSnackbarState, setOpen) {
  setSnackbarState({
    msg,
    successOrError: "error",
  });
  setOpen(true);
}
