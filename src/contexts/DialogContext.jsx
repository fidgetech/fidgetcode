import { createContext, useContext, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';

const DialogContext = createContext();

export const useDialog = () => useContext(DialogContext);

export const DialogProvider = ({ children }) => {
  const initialState = { isOpen: false, title: '', message: '', onConfirm: () => {}, inputFields: [] };
  const [dialogConfig, setDialogConfig] = useState(initialState);

  const showDialog = ({ title, message, onConfirm, inputFields = [] }) => {
    setDialogConfig({ isOpen: true, title, message, onConfirm, inputFields });
  };

  const handleClose = () => {
    setDialogConfig(initialState);
  };

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      <ConfirmDialog
        open={dialogConfig.isOpen}
        onClose={handleClose}
        onConfirm={(inputValue) => {
          dialogConfig.onConfirm(inputValue);
          handleClose();
        }}
        title={dialogConfig.title}
        message={dialogConfig.message}
        inputFields={dialogConfig.inputFields}
      />
    </DialogContext.Provider>
  );
};

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, inputFields }) => {
  const initialValues = inputFields.reduce((values, field) => {
    values[field.id] = '';
    return values;
  }, {});

  const handleFormSubmit = (values) => {
    onConfirm(values);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>

        <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
          {({ handleSubmit }) => (
            <Form>
              {inputFields.map((props, index) => (
                <Field
                  key={props.id}
                  name={props.id}
                  as={TextField}
                  // autoFocus={index === 0}
                  margin="dense"
                  fullWidth
                  variant="standard"
                  {...props}
                />
              ))}
              <DialogActions>
                <Button onClick={onClose} color="info">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" autoFocus>
                  Confirm
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>

      </DialogContent>
    </Dialog>
  );
}
