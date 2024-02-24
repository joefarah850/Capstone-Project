import React from "react";
import { LoginFormFieldProps } from "../types";
import "../css/login.scss";

const LoginFormField: React.FC<LoginFormFieldProps> = ({
  type,
  placeholder,
  name,
  login,
  error,
  valueAsNumber,
  isUnauthorized,
  onFocus,
}) => (
  <>
    {error && <span className="error-message-login">{error.message}</span>}
    <input
      type={type}
      placeholder={placeholder}
      {...login(name, { valueAsNumber })}
      onFocus={onFocus}
      style={{
        borderColor: error || isUnauthorized ? "rgb(201, 3, 3)" : "",
        borderWidth: error || isUnauthorized ? "2px" : "2px",
        padding: "9px",
      }}
    />
  </>
);

export default LoginFormField;
