import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for type checking
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const DeleteItemDialog = (props) => {
  const { open: openProp, onClose, callback, errorMessage } = props;
  const [open, setOpen] = useState(openProp);

  useEffect(() => {
    setOpen(openProp);
  }, [openProp]);

  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Deleting Item</DialogTitle>
        <DialogContent>
          {errorMessage ? errorMessage : 'Is that really ok?'}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button onClick={callback}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Define PropTypes for DeleteItemDialog
DeleteItemDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
};

export default DeleteItemDialog;
