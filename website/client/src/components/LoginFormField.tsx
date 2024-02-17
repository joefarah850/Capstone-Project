import React from "react";
import { LoginFormFieldProps } from "../types";

const LoginFormField: React.FC<LoginFormFieldProps> = ({
  type,
  placeholder,
  name,
  login,
  error,
  valueAsNumber,
}) => (
  <>
    <input
      type={type}
      placeholder={placeholder}
      {...login(name, { valueAsNumber })}
    />
    {error && <span className="error-message">{error.message}</span>}
  </>
);

export default LoginFormField;
