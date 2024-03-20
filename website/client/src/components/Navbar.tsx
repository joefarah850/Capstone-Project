import React from "react";
import { NavLink } from "react-router-dom";
import "../css/navbar.scss";

interface NavbarProps {
  profilePic?: string;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  profilePic = require("../images/noprofilepic.png"),
  isLoggedIn,
  onLogout,
}) => {
  return (
    <header className="header">
      <nav className="nav-container">
        <NavLink to="/" className="nav__logo">
          <img src={require("../images/logo.png")} alt="" />
          TechProp.ai
        </NavLink>

        <div className={"nav__menu"} id="nav-menu">
          <ul className="nav__list">
            <li className="nav__item">
              <NavLink to="/" className="nav__link">
                Home
              </NavLink>
            </li>
            <li className="nav__item" title="Coming soon!">
              <NavLink
                to="/favorites-page"
                className={`nav__link ${!isLoggedIn ? "disabled" : ""}`}
              >
                {/* <NavLink to="/favorite" className="nav__link disabled"> */}
                Favorites
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/about-us" className="nav__link">
                About Us
              </NavLink>
            </li>
            {/* {isLoggedIn && (
              <li className="nav__item">
                <button onClick={onLogout} className="nav__link logout-button">
                  Logout
                </button>
              </li>
            )}*/}
            <li className="nav__item profile-dropdown">
              <NavLink
                to="/user-page"
                className={`nav__link ${!isLoggedIn ? "disabled" : ""}`}
              >
                <img src={profilePic} alt="profile-pic" />
              </NavLink>
              {isLoggedIn && (
                <div className="dropdown-content">
                  <button
                    onClick={() => (window.location.href = "/user-page")}
                    className="dropdown-item"
                  >
                    Profile
                  </button>
                  <button onClick={onLogout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
