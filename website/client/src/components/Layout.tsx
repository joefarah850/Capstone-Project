import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import "../css/layout.scss";

interface LayoutProps {
  user: any;
  getProfilePic: () => string;
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  user,
  getProfilePic,
  children,
  onLogout,
}) => {
  const location = useLocation();

  return (
    <>
      {(location.pathname === "/" || location.pathname === "/user-page") && (
        <>
          <Navbar
            profilePic={getProfilePic()}
            isLoggedIn={!!user}
            onLogout={onLogout} // Remove the parentheses here
          />
          <video autoPlay muted loop id="background">
            <source src={require("../videos/dubai.mp4")} type="video/mp4" />
          </video>
        </>
      )}
      {children}
    </>
  );
};

export default Layout;