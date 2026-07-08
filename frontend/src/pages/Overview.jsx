import React, { useEffect, useState } from "react";
import api from "../api";

const Overview = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        setTasks([]);
      }
    };

    loadTasks();
  }, []);

  const highPriorityTasks = tasks.filter((task) => task.priority === "High").length;
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "Medium").length;
  const lowPriorityTasks = tasks.filter((task) => task.priority === "Low").length;

  return (
    <section className="page-panel">
      <div className="page-title">
        <p className="eyebrow">Project Overview</p>
        <h1>Mini Project Summary</h1>
        <p className="subtitle">A simple full-stack CRUD application made with React, Express, MongoDB, and Mongoose.</p>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </article>
        <article className="stat-card">
          <span>High Priority</span>
          <strong>{highPriorityTasks}</strong>
        </article>
        <article className="stat-card">
          <span>Medium Priority</span>
          <strong>{mediumPriorityTasks}</strong>
        </article>
        <article className="stat-card">
          <span>Low Priority</span>
          <strong>{lowPriorityTasks}</strong>
        </article>
      </div>

      <div className="info-grid">
        <article className="info-card">
          <h2>Frontend</h2>
          <p>React with Vite is used to build the user interface. React Hooks manage form data, task list data, and page state.</p>
        </article>
        <article className="info-card">
          <h2>Backend</h2>
          <p>Node.js and Express.js provide REST APIs for creating, reading, updating, and deleting study tasks.</p>
        </article>
        <article className="info-card">
          <h2>Database</h2>
          <p>MongoDB stores task documents in the studyplanner database, and Mongoose defines the Task schema.</p>
        </article>
      </div>

      <div className="feature-list card">
        <h2>Project Features</h2>
        <ul>
          <li>Add study tasks with title, subject, and priority.</li>
          <li>View all saved tasks from MongoDB.</li>
          <li>Edit existing task details.</li>
          <li>Delete completed or unwanted tasks.</li>
          <li>Responsive layout for desktop and mobile screens.</li>
        </ul>
      </div>
    </section>
  );
};

export default Overview;
