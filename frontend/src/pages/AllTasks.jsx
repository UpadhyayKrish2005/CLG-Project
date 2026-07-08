import React from "react";
import TaskManager from "../components/TaskManager.jsx";

const AllTasks = () => {
  return (
    <>
      <section className="app-header">
        <p className="eyebrow">Saved Tasks</p>
        <h1>All Study Tasks</h1>
        <p className="subtitle">View, edit, and delete all tasks stored in MongoDB.</p>
      </section>

      <TaskManager view="list" />
    </>
  );
};

export default AllTasks;
