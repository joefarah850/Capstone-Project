import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import ResetPassword from "./components/ResetPassword";
import UserPage from "./pages/UserPage";
import { useEffect } from "react";
import httpClient from "./httpClient";
import React from "react";
import { User } from "./types";
import Layout from "./components/Layout";
import { resetCookieConsentValue } from "react-cookie-consent";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import { useIdleTimer } from "react-idle-timer";
import emitter from "./eventEmitter";

const Router = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [profilePic, setProfilePic] = React.useState<string>(
    "../images/noprofilepic.png"
  );

  const onLogout = async () => {
    await httpClient.post("http://localhost:5000/logout");

    resetCookieConsentValue();

    localStorage.removeItem("registrationResponse");

    window.location.href = "/";
  };

  useIdleTimer({
    timeout: 1000 * 60 * 30, // 30 minutes
    onIdle: onLogout,
    debounce: 500,
  });

  const getProfilePic = () => {
    if (user != null) {
      if (
        user.data.profile_pic === "../images/noprofilepic.png" &&
        profilePic === "../images/noprofilepic.png"
      ) {
        return require("./images/noprofilepic.png");
      }
      if (profilePic !== "../images/noprofilepic.png") {
        return profilePic;
      }
      return user.data.profile_pic;
    }
  };

  useEffect(() => {
    const updateProfilePic = (newProfilePic: string): void => {
      setProfilePic(newProfilePic);
    };

    emitter.on("profilePicUpdated", updateProfilePic);

    return () => {
      emitter.off("profilePicUpdated", updateProfilePic);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get("http://localhost:5000/@me");

        setUser(resp.data);
      } catch (error: any) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              user={user}
              getProfilePic={getProfilePic}
              onLogout={onLogout}
            >
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/about-us"
          element={
            <Layout
              user={user}
              getProfilePic={getProfilePic}
              onLogout={onLogout}
            >
              <AboutUs />
            </Layout>
          }
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/user-page"
          element={
            <Layout
              user={user}
              getProfilePic={getProfilePic}
              onLogout={onLogout}
            >
              <UserPage />
            </Layout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
