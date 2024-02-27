import React, { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import httpClient from "../httpClient";
import RegisterFormField from "./RegisterFormField";
import { set, useForm } from "react-hook-form";
import { RegisterFormData, UserSchema } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import "../css/login.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [confirmPasswordError, setConfirmPasswordError] =
    useState<ReactNode>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordReset, setPasswordReset] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [pass, setPass] = useState<string>("");

  library.add(faEye, faEyeSlash);

  const {
    register,
    watch,
    formState: { errors },
    setError,
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(UserSchema),
    mode: "onBlur",
  });

  const newPassword = watch("password");

  const handleResetPassword = async (data: any) => {
    try {
      await httpClient.post(`http://localhost:5000/reset-password/${token}`, {
        password: newPassword,
      });
      setPasswordReset(true);
    } catch (error: any) {
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.message);

        reset({
          password: "",
        });

        setConfirmPassword("");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    console.log(newPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  useEffect(() => {
    if (
      pass !== confirmPassword &&
      confirmPassword.length >= pass.length - 1 &&
      confirmPassword !== ""
    ) {
      setConfirmPasswordError(
        <span className="error-message-register">Passwords do not match</span>
      );
    } else {
      setConfirmPasswordError(null);
    }
  }, [pass, confirmPassword]);

  const handleConfirmPassword = (pass: string, confirmPassword: string) => {
    if (pass !== confirmPassword) {
      setConfirmPasswordError(
        <span className="error-message-register">Passwords do not match</span>
      );
    } else {
      setConfirmPasswordError(null);
    }
  };

  return (
    <div>
      <div id="login-container">
        <div id="login-image">
          <img src={require("../images/dubai_night.jpeg")} alt="" />
        </div>
        <form id="reset-pass-form">
          <h2>Reset Password</h2>
          {passwordReset ? (
            <>
              <span className="email-sent">
                Your password has been updated.
              </span>
            </>
          ) : (
            <div className="reset-fields">
              {errorMessage !== "" ? (
                <span
                  className="error-message-register"
                  style={{
                    fontSize: "18px",
                    top: "-5%",
                    textAlign: "center",
                    width: "100%",
                    marginLeft: "0",
                  }}
                >
                  {errorMessage}
                </span>
              ) : null}
              <div className="fields" id="pass">
                <RegisterFormField
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  register={register}
                  error={errors.password}
                  onChange={(e) => setPass(e.target.value)}
                />
                <button
                  id="eye"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? (
                    <FontAwesomeIcon icon={["fas", "eye-slash"]} />
                  ) : (
                    <FontAwesomeIcon icon={["fas", "eye"]} />
                  )}
                </button>
              </div>
              <div className="fields" id="confirm-pass">
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleConfirmPassword(pass, confirmPassword)}
                  style={
                    confirmPasswordError
                      ? {
                          borderWidth: "2px",
                          borderColor: "rgb(201, 3, 3)",
                          padding: "9px",
                        }
                      : { padding: "9px", borderWidth: "2px" }
                  }
                />
                {confirmPasswordError}
                <button
                  id="eye"
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {isConfirmPasswordVisible ? (
                    <FontAwesomeIcon icon={["fas", "eye-slash"]} />
                  ) : (
                    <FontAwesomeIcon icon={["fas", "eye"]} />
                  )}
                </button>
              </div>
              <div id="buttons">
                <button id="submit" type="button" onClick={handleResetPassword}>
                  Reset Password
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
