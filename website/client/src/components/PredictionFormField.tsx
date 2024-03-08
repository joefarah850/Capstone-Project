import React from "react";
import { PredictionFormFieldProps } from "../types";
import "../css/prediction.scss";

const PredictionFormField: React.FC<PredictionFormFieldProps> = ({
  type,
  placeholder,
  name,
  predict,
  error,
  valueAsNumber,
  options,
  disabled,
  min,
  max,
  id,
  style,
}) => {
  return (
    <>
      {type === "dropdown" ? (
        <>
          <select
            {...predict(name)}
            className="pred-fields"
            style={{
              borderColor: error ? "rgb(201, 3, 3)" : "",
              borderWidth: error ? "2px" : "2px",
              // padding: "9px",
            }}
            disabled={disabled}
          >
            <option value="">{placeholder}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </>
      ) : (
        <>
          <input
            type={type}
            placeholder={placeholder}
            {...predict(name, { valueAsNumber })}
            style={
              style
                ? style
                : {
                    borderColor: error ? "rgb(201, 3, 3)" : "",
                    borderWidth: error ? "2px" : "2px",
                    // padding: "9px",
                  }
            }
            className="pred-fields"
            disabled={disabled}
            min={min}
            max={max}
            id={id}
          />
        </>
      )}
    </>
  );
};

export default PredictionFormField;
