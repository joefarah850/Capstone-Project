import React from "react";
import { RegisterFormFieldProps } from "../types";
import "../css/register.scss";

const RegisterFormField: React.FC<RegisterFormFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  error,
  options,
  max,
  valueAsNumber,
  onChange,
}) => {
  const getErrorStyle = (errorMessage: any) => {
    return { top: errorMessage.length > 45 ? "-43%" : "3%" };
  };
  if (type === "radio" && options) {
    return (
      <>
        {options.map((option, index) => (
          <label key={index}>
            {option.label}
            <input type="radio" value={option.value} {...register(name)} />
          </label>
        ))}
        {error && (
          <span className="error-message" style={getErrorStyle(error.message)}>
            {error.message}
          </span>
        )}
      </>
    );
  }

  // Fallback for other types of inputs
  return (
    <>
      {error && (
        <span
          className="error-message-register"
          style={getErrorStyle(error.message)}
        >
          {error.message}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        max={max}
        {...register(name, { valueAsNumber })}
        style={{
          borderColor: error ? "rgb(201, 3, 3)" : "",
          borderWidth: error ? "2px" : "2px",
          padding: "9px",
        }}
        onChange={onChange}
      />
    </>
  );
};

export default RegisterFormField;
