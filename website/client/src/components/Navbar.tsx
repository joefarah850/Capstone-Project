import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
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
  const [showMenu, setShowMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenuOnMobile = () => {
    if (window.innerWidth <= 768) {
      setShowMenu(false);
    }
  };

  window.addEventListener("resize", () => {
    setWindowWidth(window.innerWidth);
    if (window.innerWidth > 768) {
      setShowMenu(false);
    }
  });

  return (
    <header className="header">
      <nav className="nav-container">
        <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
          {showMenu ? <IoClose /> : <IoMenu />}
        </div>
        <NavLink to="/" className="nav__logo">
          <img src={require("../images/logo.png")} alt="" />
          TechProp.ai
        </NavLink>

        <div
          className={`nav__menu ${showMenu ? "show-menu" : ""}`}
          id="nav-menu"
        >
          <ul className="nav__list">
            <li className="nav__item">
              <NavLink to="/" className="nav__link" onClick={closeMenuOnMobile}>
                Home
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/favorites-page"
                className={`nav__link ${!isLoggedIn ? "disabled" : ""}`}
                onClick={closeMenuOnMobile}
              >
                Favorites
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/about-us"
                className="nav__link"
                onClick={closeMenuOnMobile}
              >
                About Us
              </NavLink>
            </li>
            {windowWidth > 768 ? (
              <li className="nav__item profile-dropdown">
                <NavLink
                  to="/user-page"
                  className={`nav__link ${!isLoggedIn ? "disabled" : ""}`}
                >
                  <img
                    src={profilePic}
                    alt="profile-pic"
                    style={{ borderRadius: "50%" }}
                  />
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
            ) : (
              <>
                <li className="nav__item">
                  <NavLink
                    to="/user-page"
                    className={`nav__link ${!isLoggedIn ? "disabled" : ""}`}
                    onClick={closeMenuOnMobile}
                  >
                    Profile
                  </NavLink>
                </li>
                <li className="nav__item">
                  {isLoggedIn ? (
                    <button
                      onClick={onLogout}
                      className="nav__link"
                      style={{ color: "#133C55" }}
                    >
                      Logout
                    </button>
                  ) : (
                    <button>
                      <NavLink
                        to="/login"
                        className="nav__link"
                        style={{ color: "#133C55" }}
                      >
                        Login
                      </NavLink>
                    </button>
                  )}
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
