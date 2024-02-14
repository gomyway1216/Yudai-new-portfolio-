import React, { useState, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const ALERT_DURATION = 5000;

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Define PropTypes for Alert
Alert.propTypes = {
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  onClose: PropTypes.func,
};

const InstantMessage = ({ message, onClose }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, [message]);

  const handleCloseForSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
    setOpen(false);
  };

  const handleCloseForAlert = () => {
    onClose();
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={ALERT_DURATION} onClose={handleCloseForSnackbar}>
      <Alert onClose={handleCloseForAlert} severity="error">{message}</Alert>
    </Snackbar>
  );
};

// Define PropTypes for InstantMessage
InstantMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InstantMessage;
