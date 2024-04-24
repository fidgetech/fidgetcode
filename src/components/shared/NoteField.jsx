import { TextField } from '@mui/material';

export const NoteField = ({ label, onChange }) => {
  return (
    <TextField
      multiline
      minRows={4}
      margin="normal"
      fullWidth
      id="note"
      name="note"
      label={label}
      autoComplete="off"
      onChange={onChange}
    />
  );
}
