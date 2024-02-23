import React, { useState } from "react";
import httpClient from "../httpClient";
import CookieConsent, { resetCookieConsentValue } from "react-cookie-consent";
import { LoginFormData, LoginUserSchema } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginFormField from "../components/LoginFormField";
import ForgotPassword from "../components/ForgotPassword";
import "../css/login.scss";

const LoginPage: React.FC = () => {
  const [cookieConsent, setCookieConsent] = useState<boolean>(false);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
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
      window.location.href = "/";
    } catch (error: any) {
      if (error.response.status === 401) {
        console.log("Invalid Credentials");
        alert("Invalid Credentials");
      }
    }
  };

  const toggleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    resetCookieConsentValue(),
    (
      <>
        <CookieConsent
          onAccept={() => {
            setCookieConsent(true);
          }}
        ></CookieConsent>
        <div id="login-container">
          <div id="login-image">
            <img src={require("../images/dubai_night.jpeg")} alt="" />
          </div>
          <form id="login-form" onSubmit={handleSubmit(loginUser)}>
            <h1>Login</h1>
            <div>
              <LoginFormField
                type="email"
                placeholder="Email"
                name="email"
                login={register}
                error={errors.email}
              />
            </div>
            <div>
              <LoginFormField
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
                name="password"
                login={register}
                error={errors.password}
              />
              <button type="button" onClick={togglePasswordVisibility}>
                {isPasswordVisible ? "Hide" : "Show"}
              </button>
            </div>
            <button type="button" onClick={toggleForgotPassword}>
              Forgot
            </button>
            {forgotPassword ? <ForgotPassword /> : null}
            <button type="submit">Submit</button>
            {/*Implement a Login with Google button here 
            Implement email verification*/}
            <div>
              Don't have an Account?
              <a href="/register">Register</a>
            </div>
          </form>
        </div>
      </>
    )
  );
};

export default LoginPage;
