import React, { useState } from "react";
import httpClient from "../httpClient";
import { LoginFormData, LoginUserSchema } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginFormField from "./LoginFormField";
import "../css/login.scss";

interface ForgotPasswordProps {
  className?: string;
  id?: string;
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  id,
  className,
  onBack,
}) => {
  const {
    register,
    watch,
    formState: { errors },
    setError,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginUserSchema),
  });

  const email = watch("email");
  const errorMessage = "Invalid Email Address";
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const clear = () => {
    reset({ email: "" });
  };

  const handleForgotPassword = async () => {
    try {
      await httpClient.post("http://localhost:5000/forgot-password", {
        email: email,
      });
      setEmailSent(true);
    } catch (error: any) {
      if (error.response.status === 400) {
        setIsUnauthorized(true);
      }
    }
  };

  const handleBack = () => {
    setEmailSent(false);
    reset({ email: "" });
    onBack();
  };

  return (
    <div id={id} className={className}>
      <h2>Forgot Password</h2>
      {emailSent ? (
        <>
          <span className="email-sent">
            Password reset link was sent to your email
          </span>
          <div id="buttons">
            <button id="cancel" type="button" onClick={handleBack}>
              Back
            </button>
          </div>
        </>
      ) : (
        <>
          <div id="recovery-email">
            {isUnauthorized ? (
              <span className="error-message-login">{errorMessage}</span>
            ) : null}
            <LoginFormField
              type="email"
              placeholder="Email"
              name="email"
              login={register}
              error={undefined}
              isUnauthorized={isUnauthorized}
              onFocus={() => {
                setIsUnauthorized(false);
              }}
            />
            <button type="button" id="clear" onClick={clear} title="clear">
              x
            </button>
          </div>
          <div id="buttons">
            <button id="cancel" type="button" onClick={onBack}>
              Back
            </button>
            <button id="submit" type="button" onClick={handleForgotPassword}>
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
