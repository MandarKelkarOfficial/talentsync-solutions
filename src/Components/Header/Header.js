import React from "react";
import { useLocation, Link } from "react-router-dom";

import "./Header.css";

const Header = () => {
  const location = useLocation();
  const userName = location.state?.userName || "User"; // Default to 'User' if no name is passed
  return (
    <div className="header-container">
      <div className="overlay">
        <h1>Hello {userName}!</h1>
        <p>
          This is your profile page. You can see the progress you've made with{" "}
          <br /> your work and manage your projects or assigned tasks.
        </p>
        <Link to="/">

          <button className="edit-profile-btn">Logout</button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
