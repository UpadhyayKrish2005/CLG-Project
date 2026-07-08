import React from "react";

const Navbar = ({ activePage, setActivePage }) => {
  return (
    <nav className="navbar">
      <div>
        <span className="brand-mark">SP</span>
        <span className="brand-name">Study Planner</span>
      </div>

      <div className="nav-links">
        <button
          type="button"
          className={activePage === "planner" ? "active" : ""}
          onClick={() => setActivePage("planner")}
        >
          Planner
        </button>
        <button
          type="button"
          className={activePage === "tasks" ? "active" : ""}
          onClick={() => setActivePage("tasks")}
        >
          All Tasks
        </button>
        <button
          type="button"
          className={activePage === "overview" ? "active" : ""}
          onClick={() => setActivePage("overview")}
        >
          Overview
        </button>
        <button
          type="button"
          className={activePage === "api" ? "active" : ""}
          onClick={() => setActivePage("api")}
        >
          API Guide
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
