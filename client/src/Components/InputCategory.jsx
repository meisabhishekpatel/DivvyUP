import React from "react";

const InputCategory = ({
  type,
  label,
  values,
  selectedValue,
  onValueChange,
}) => {
  return (
    <div className="my-2">
      <label htmlFor={type} className="block text-sm font-medium text-gray-700  dark:bg-gray-900">
        {label}
      </label>
      <select
        className="w-full px-2 py-2 md:px-3 mt-1 rounded border border-gray-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200  focus:ring-offset-0  dark:bg-gray-900 dark:text-white"
        value={selectedValue}
        onChange={(e) => onValueChange(e.target.value)}
      >
        {values.map((value) => (
          <option
            key={value}
            value={value}
            className="w-full px-2 py-2 md:px-3 mt-1 rounded border border-gray-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200  focus:ring-offset-0  dark:bg-gray-900 dark:text-white"
          >
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputCategory;
