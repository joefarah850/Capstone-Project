import React, { useEffect } from "react";
import { resetCookieConsentValue } from "react-cookie-consent";
import httpClient from "../httpClient";
import { User } from "../types";
import { log } from "console";
import { get } from "http";
import PredictionForm from "../components/PredictionForm";

const LandingPage = () => {
  const [user, setUser] = React.useState<User | null>(null);

  const logoutUser = async () => {
    await httpClient.post("http://localhost:5000/logout");

    resetCookieConsentValue();

    window.location.href = "/";
  };

  const getProfilePic = () => {
    if (user != null) {
      if (user.data.profile_pic === "../images/noprofilepic.png") {
        return require("../images/noprofilepic.png");
      }
      return user.data.profile_pic;
    }
  };

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const resp = await httpClient.get("http://localhost:5000/@me");

  //       setUser(resp.data);
  //     } catch (error: any) {
  //       console.log(error);
  //     }
  //   })();
  // }, []);

  return (
    <>
      <div>
        {user != null ? (
          <div>
            <h2>Logged in</h2>
            <img src={getProfilePic()} alt="Profile Pic" />
            <h3>Email: {user.data.email}</h3>
            <h3>ID: {user.data.id}</h3>
            <h3>{user.message}</h3>

            <button onClick={logoutUser}>Logout</button>
          </div>
        ) : (
          <div>
            <p>You are not logged in</p>
            <div>
              <a href="/login">
                <button>Login</button>
              </a>
              <a href="/register">
                <button>Register</button>
              </a>
            </div>
            <div>
              <PredictionForm />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LandingPage;
