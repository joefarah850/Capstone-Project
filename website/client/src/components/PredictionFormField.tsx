import React from "react";
import { PredictionFormFieldProps } from "../types";

const PredictionFormField: React.FC<PredictionFormFieldProps> = ({
  type,
  placeholder,
  name,
  predict,
  error,
  valueAsNumber,
  options,
}) => {
  return (
    <>
      {type === "dropdown" ? (
        <select {...predict(name)}>
          <option value="">{placeholder}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          {...predict(name, { valueAsNumber })}
        />
      )}
      {error && <span className="error-message">{error.message}</span>}
    </>
  );
};

export default PredictionFormField;
