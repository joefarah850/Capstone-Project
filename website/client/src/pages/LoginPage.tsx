import React, { useState } from "react";
import httpClient from "../httpClient";
import CookieConsent, { resetCookieConsentValue } from "react-cookie-consent";
import { LoginFormData, LoginUserSchema } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginFormField from "../components/LoginFormField";

const LoginPage: React.FC = () => {
  const [cookieConsent, setCookieConsent] = useState<boolean>(false);

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
      const resp = await httpClient.post("http://localhost:5000/login", {
        ...data,
        cookieConsent,
      });
      window.location.href = "/";
    } catch (error: any) {
      if (error.response.status === 401) {
        console.log("Invalid Credentials");
      }
    }
  };

  return (
    resetCookieConsentValue(),
    (
      <>
        <CookieConsent
          onAccept={() => {
            // Set consent flag in localStorage or make an API call to backend
            setCookieConsent(true);
          }}
        >
          This website uses cookies to enhance the user experience.
        </CookieConsent>
        <div>
          <h1>Login</h1>
          <form onSubmit={handleSubmit(loginUser)}>
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
                type="password"
                placeholder="Password"
                name="password"
                login={register}
                error={errors.password}
              />
            </div>
            <button type="submit">Submit</button>
            Implement a Register link here Implement a "Forgot Password" link
            here Implement a Login with Google button here
          </form>
        </div>
      </>
    )
  );
};

export default LoginPage;
