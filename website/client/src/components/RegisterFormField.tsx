import React from "react";
import { RegisterFormFieldProps } from "../types";

const RegisterFormField: React.FC<RegisterFormFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  error,
  options, // Added options to destructure from props
  valueAsNumber,
}) => {
  // Check if the input type is 'radio' and options are provided
  if (type === "radio" && options) {
    return (
      <>
        {options.map((option, index) => (
          <label key={index}>
            {option.label}
            <input type="radio" value={option.value} {...register(name)} />
          </label>
        ))}
        {error && <span className="error-message">{error.message}</span>}
      </>
    );
  }

  // Fallback for other types of inputs
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, { valueAsNumber })}
      />
      {error && <span className="error-message">{error.message}</span>}
    </>
  );
};

export default RegisterFormField;
