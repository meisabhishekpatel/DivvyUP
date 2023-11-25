import React, { useState } from "react";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";

const FormInput = ({
    children,
    label,
    type,
    placeholder,
    onChange,
    value,
    error,
    name,
    showLeadingIcon = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="flex flex-col max-w-80 w-full my-2">
            <label htmlFor={type} className="block text-sm font-medium text-gray-700 dark:text-white">
                {label}
            </label>
            <div className="relative w-full  dark:bg-gray-900">
                {showLeadingIcon && (
                    <div className="absolute mt-1 inset-y-1 left-0 pl-3 flex items-center pointer-events-none  dark:bg-gray-900">
                        <span className="text-gray-500">₹</span>
                    </div>
                )}
                <input
                    type={showPassword ? "text" : type}
                    id={type}
                    placeholder={placeholder}
                    onChange={onChange}
                    value={value}
                    name={name}
                    className={` dark:bg-gray-900 dark:text-white w-full px-2 py-2 md:px-3 mt-1 rounded border border-gray-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200  focus:ring-offset-0 
        ${error
                            ? "border-red-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200  focus:ring-offset-0"
                            : " border-zinc-400"
                        }
            ${showLeadingIcon ? "md:pl-7" : ""}
            `}
                    {...props}
                />
                {type === "password" && !error && (
                    <span className="absolute inset-y-2 right-1 text-zinc-500 ">
                        <button type="icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </span>
                )}
                {error && (
                    <span className="absolute inset-y-2 p-2 right-1 text-lg text-red-600">
                        <FiAlertCircle />
                    </span>
                )}
            </div>
            {
                error && (
                    <p className="mt-1 flex  items-center text-red-600">
                        <span>{error}</span>
                    </p>
                )
            }
        </div>
    );
};
export default FormInput;
