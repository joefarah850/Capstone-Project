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

const Router = () => {
  const [user, setUser] = React.useState<User | null>(null);

  const onLogout = async () => {
    await httpClient.post("http://localhost:5000/logout");

    resetCookieConsentValue();

    window.location.href = "/";
  };

  const getProfilePic = () => {
    if (user != null) {
      console.log(user.data.profile_pic);
      if (user.data.profile_pic === "../images/noprofilepic.png") {
        return require("./images/noprofilepic.png");
      }
      return user.data.profile_pic;
    }
  };

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
