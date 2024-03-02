import React from "react";
import { NavLink } from "react-router-dom";
import "../css/navbar.scss";

interface NavbarProps {
  className?: string;
  id?: string;
  profilePic?: string;
  isLoggedIn?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  className,
  id,
  profilePic = require("../images/noprofilepic.png"),
  isLoggedIn,
}) => {
  return (
    <header className="header">
      <nav className="nav-container">
        <NavLink to="/" className="nav__logo">
          TechProp.AI
        </NavLink>

        <div className={"nav__menu"} id="nav-menu">
          <ul className="nav__list">
            <li className="nav__item">
              <NavLink to="/" className="nav__link">
                Home
              </NavLink>
            </li>
            <li className={`nav__item ${!isLoggedIn ? "disabled" : ""}`}>
              <NavLink to="/favorite" className="nav__link">
                Favorites
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/about-us" className="nav__link">
                About Us
              </NavLink>
            </li>
            <li className={`nav__item ${!isLoggedIn ? "disabled" : ""}`}>
              <NavLink to="/user-profile" className="nav__link">
                <img src={profilePic} alt="profile-pic" />
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
