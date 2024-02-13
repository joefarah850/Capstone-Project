import React, { useState } from "react";
import httpClient from "../httpClient";
import CookieConsent, { resetCookieConsentValue } from "react-cookie-consent";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cookieConsent, setCookieConsent] = useState<boolean>(false);

  const loginUser = async () => {
    console.log(email, password);
    try {
      const resp = await httpClient.post("http://localhost:5000/login", {
        email,
        password,
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
          <form action="">
            <div>
              <label>Email: </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id=""
              />
            </div>
            <div>
              <label>Password: </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id=""
              />
            </div>
            <button type="button" onClick={() => loginUser()}>
              Submit
            </button>
          </form>
        </div>
      </>
    )
  );
};

export default LoginPage;
