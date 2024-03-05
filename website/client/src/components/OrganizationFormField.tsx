import React from "react";
import { OrganizationFormFieldProps } from "../types";
// import "../css/Organization.scss";

const OrganizationFormField: React.FC<OrganizationFormFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
  onFocus,
}) => (
  <>
    {error && (
      <span className="error-message-organization">{error.message}</span>
    )}
    <input
      type={type}
      placeholder={placeholder}
      {...register(name, { valueAsNumber })}
      onFocus={onFocus}
      style={{
        borderColor: error ? "rgb(201, 3, 3)" : "",
        borderWidth: error ? "2px" : "2px",
        padding: "9px",
      }}
    />
  </>
);

export default OrganizationFormField;
