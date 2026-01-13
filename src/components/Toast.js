import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Snackbar, Alert, Slide } from "@mui/material";
import { setToastHandler } from "../utility/toastService";

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

const Toast = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  // This exposes the "show" function to the parent component
  useImperativeHandle(ref, () => ({
    show(msg, type = "success") {
      setMessage(msg);
      setSeverity(type);
      setOpen(true);
    },
  }));

  useEffect(() => {
    // register global handler
    setToastHandler((msg, type = "success") => {
      setMessage(msg);
      setSeverity(type);
      setOpen(true);
    });

    return () => setToastHandler(null);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={TransitionLeft}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%", borderRadius: 2, fontWeight: "medium" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
});

export default Toast;
