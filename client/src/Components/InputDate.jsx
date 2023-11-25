import React, { useState } from "react";

const DateInput = ({ selectedDate, onValueChange }) => {
  return (
    <div>
      
      <label className="dark:text-white" htmlFor="dateInput">Select a date:</label>
      <input
        type="date"
        className="dark:bg-gray-700 text:gray"
        id="dateInput"
        name="dateInput"
        value={selectedDate}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </div>
  );
};

export default DateInput;
