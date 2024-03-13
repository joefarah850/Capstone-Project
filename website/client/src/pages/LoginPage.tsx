import React, { useState } from "react";
import httpClient from "../httpClient";
// eslint-disable-next-line
import CookieConsent, { resetCookieConsentValue } from "react-cookie-consent";
import { LoginFormData, LoginUserSchema } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginFormField from "../components/LoginFormField";
import ForgotPassword from "../components/ForgotPassword";
import "../css/login.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

const LoginPage: React.FC = () => {
  // eslint-disable-next-line
  const [cookieConsent, setCookieConsent] = useState<boolean>(false);
  // eslint-disable-next-line
  const [cookieDecline, setCookieDecline] = useState<boolean>(false);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const errorMessage = "Incorrect Email or Password";
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  library.add(faEye, faEyeSlash);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginUserSchema),
    mode: "onBlur",
  });

  const loginUser = async (data: any) => {
    try {
      await httpClient.post("http://localhost:5000/login", {
        ...data,
        cookieConsent,
      });
      localStorage.removeItem("registrationResponse");

      window.location.href = "/";
    } catch (error: any) {
      if (error.response.status === 401) {
        setIsUnauthorized(true);

        reset(
          {
            password: "",
          },
          {
            keepErrors: true, // Keeps other errors
            keepDirty: true, // Keeps other fields' dirty state
            keepIsSubmitted: false,
            keepTouched: false,
            keepIsValid: false,
            keepSubmitCount: false,
          }
        );
      }
    }
  };

  const toggleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
    reset({
      email: "",
      password: "",
    });
  };

  const clear = () => {
    reset({ email: "" });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    resetCookieConsentValue(),
    (
      <>
        {/* <CookieConsent
          enableDeclineButton
          onAccept={() => {
            setCookieConsent(true);
          }}
          onDecline={() => {
            setCookieDecline(true);
          }}
          buttonText="I accept"
          style={{ background: "#2B373B" }}
          buttonStyle={{
            background: "#62929E",
            color: "#F5F5F5",
            fontSize: "13px",
            borderRadius: "5px",
            marginLeft: "10px",
            marginRight: "30px",
          }}
          declineButtonText="I decline"
          declineButtonStyle={{
            background: "#C62828",
            color: "#F5F5F5",
            fontSize: "13px",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          This website uses cookies to enhance the user experience.{" "}
          <a href="/privacy-policy" id="policy">
            Learn more
          </a>
        </CookieConsent> */}
        {/* <div id={cookieConsent || cookieDecline ? "" : "cookie-not-answered"}> */}
        <div>
          <div id="login-container">
            <div id="login-image">
              <img src={require("../images/dubai_night.jpeg")} alt="" />
            </div>
            <form id="login-form" onSubmit={handleSubmit(loginUser)}>
              <div
                id="login-slide"
                className={forgotPassword ? "slide-left" : ""}
              >
                <h1>Login</h1>
                <div className="login-fields">
                  {isUnauthorized ? (
                    <span className="error-message-login">{errorMessage}</span>
                  ) : null}
                  <div className="fields">
                    <LoginFormField
                      type="email"
                      placeholder="Email"
                      name="email"
                      login={register}
                      error={errors.email}
                      isUnauthorized={isUnauthorized}
                      onFocus={() => {
                        setIsUnauthorized(false);
                      }}
                    />
                    <button
                      type="button"
                      id="clear"
                      onClick={clear}
                      title="clear"
                      tabIndex={-1}
                    >
                      x
                    </button>
                  </div>
                  <div className="fields" id="pass">
                    <LoginFormField
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      login={register}
                      error={errors.password}
                      isUnauthorized={isUnauthorized}
                      onFocus={() => {
                        setIsUnauthorized(false);
                      }}
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

                  <div id="buttons">
                    <button
                      id="forgot"
                      type="button"
                      onClick={toggleForgotPassword}
                    >
                      Forgot Password?
                    </button>
                    <button id="submit" type="submit">
                      Login
                    </button>
                  </div>
                  <div id="register">
                    Don't have an Account?&nbsp;
                    <a href="/register">Register</a>
                  </div>
                </div>
              </div>
              <ForgotPassword
                id="forgot-password"
                onBack={toggleForgotPassword}
                className={forgotPassword ? "" : "slide-left"}
              />
            </form>
          </div>
        </div>
      </>
    )
  );
};

export default LoginPage;
