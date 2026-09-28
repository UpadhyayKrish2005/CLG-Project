import React, { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand-logo" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}>
        <span className="brand-mark">SP</span>
        <span className="brand-name">Study Planner</span>
      </Link>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
          Home
        </NavLink>

        {user ? (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
              Dashboard
            </NavLink>
            <NavLink to="/planner" className={({ isActive }) => isActive ? "active" : ""}>
              Planner
            </NavLink>
            <NavLink to="/tasks" className={({ isActive }) => isActive ? "active" : ""}>
              All Tasks
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => isActive ? "active" : ""}>Analytics</NavLink>
            <NavLink to="/assistant" className={({ isActive }) => isActive ? "active" : ""}>AI Assistant</NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink>
            <span className="user-welcome">Hi, {user.name}!</span>
            <button type="button" onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>
              Login
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
