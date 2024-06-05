import { Field } from 'formik';
import { Typography, Checkbox, FormControlLabel, RadioGroup, Radio, TextField, Select, MenuItem } from '@mui/material';

export const TextInput = ({ name, label, required, ...props }) => {
  return (
    <>
      <Field name={name}>
        {({ field, meta }) => (
          <TextField
            id={name}
            fullWidth
            autoComplete='off'
            label={label}
            required={required}
            {...field}
            {...props}
            error={meta.touched && Boolean(meta.error)}
            helperText={meta.touched && meta.error}
          />
        )}
      </Field>
    </>
  );
};

export const TextAreaInput = ({ label, name, rows, ...props }) => {
  return (
    <>
      <Typography gutterBottom sx={{ mb: 1 }} htmlFor={name}>
        {label}
      </Typography>
      <Field
        as={TextField}
        name={name}
        multiline
        minRows={rows}
        {...props}
        sx={{ width: '100%' }}
      />
    </>
  );
};

export const SelectInput = ({ name, label, options, ...props }) => {
  return (
    <>
      <Typography gutterBottom htmlFor={name}>{label}</Typography>
      <Field name={name}>
        {({ field }) => (
          <Select
            id={name}
            {...field}
            {...props}
            value={field.value || ''}
          >
            {options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      </Field>
    </>
  );
}

export const CheckboxInput = ({ name, label, options, ...props }) => {
  return (
    <>
      {label && <Typography gutterBottom htmlFor={name}>{label}</Typography>}
      {options.map(option => (
        <div key={option}>
          <Field name={name}>
            {({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    id={option}
                    checked={field.value.includes(option)}
                    {...field}
                    value={option}
                    color="secondary"
                    {...props}
                  />
                }
                label={option}
              />
            )}
          </Field>
        </div>
      ))}
    </>
  );
};

export const RadioInput = ({ name, label, options, required, ...props }) => {
  return (
    <>
      {label && <Typography gutterBottom htmlFor={name}>
        {label}
        {required && <Typography component="span" color='error'> *</Typography>}
      </Typography>}
      <RadioGroup sx={{ '.MuiFormControlLabel-asterisk': { display: 'none' } }}>
        {options.map(option => (
          <div key={option}>
            <Field name={name}>
              {({ field }) => (
                <FormControlLabel
                  control={
                    <Radio
                      id={option}
                      checked={field.value === option}
                      {...field}
                      value={option}
                      color="secondary"
                      required={required}
                      {...props}
                    />
                  }
                  label={option}
                />
              )}
            </Field>
          </div>
        ))}
      </RadioGroup>
    </>
  );
};
