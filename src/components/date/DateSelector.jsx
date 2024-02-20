import React from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PropTypes } from 'prop-types';

const DateSelector = ({ date, setDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Date"
        value={date}
        onChange={setDate}
        renderInput={({ inputRef, inputProps, InputProps }) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input ref={inputRef} {...inputProps} style={{ width: '100%' }} />
            {InputProps?.endAdornment}
          </div>
        )}
      />
    </LocalizationProvider>
  );
};

DateSelector.propTypes = {
  date: PropTypes.object.isRequired,
  setDate: PropTypes.func.isRequired,
};

export default DateSelector;