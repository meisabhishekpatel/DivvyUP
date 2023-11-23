import React, { useState } from "react";

const DateInput = ({ selectedDate, onValueChange }) => {
  return (
    <div>
      <label htmlFor="dateInput">Select a date:</label>
      <input
        type="date"
        id="dateInput"
        name="dateInput"
        value={selectedDate}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </div>
  );
};

export default DateInput;
