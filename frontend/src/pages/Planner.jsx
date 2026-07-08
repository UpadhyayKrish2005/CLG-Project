import React from "react";
import TaskManager from "../components/TaskManager.jsx";

const Planner = () => {
  return (
    <>
      <section className="app-header">
        <h1>Study Planner</h1>
        <p className="subtitle">Add, view, edit, and delete your study tasks in one simple place.</p>
      </section>

      <div className="single-panel">
        <TaskManager view="form" />
      </div>
    </>
  );
};

export default Planner;
