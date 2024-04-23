import { createContext, useContext, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const DialogContext = createContext();

export const useDialog = () => useContext(DialogContext);

export const DialogProvider = ({ children }) => {
  const initialState = { isOpen: false, title: '', message: '', onConfirm: () => {} };  
  const [dialogConfig, setDialogConfig] = useState(initialState);

  const showConfirm = ({ title, message, onConfirm }) => {
    setDialogConfig({ isOpen: true, title, message, onConfirm });
  };

  const handleClose = () => {
    setDialogConfig(initialState);
  };

  return (
    <DialogContext.Provider value={{ showConfirm }}>
      {children}
      <ConfirmDialog
        open={dialogConfig.isOpen}
        onClose={handleClose}
        onConfirm={() => {
          dialogConfig.onConfirm();
          handleClose();
        }}
        title={dialogConfig.title}
        message={dialogConfig.message}
      />
    </DialogContext.Provider>
  );
};

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
