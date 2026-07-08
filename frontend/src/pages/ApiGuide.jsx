import React from "react";

const ApiGuide = () => {
  return (
    <section className="page-panel">
      <div className="page-title">
        <p className="eyebrow">Backend Reference</p>
        <h1>API Guide</h1>
        <p className="subtitle">Use these REST APIs in Postman to test the backend directly.</p>
      </div>

      <div className="api-list">
        <article className="api-card">
          <span className="method get">GET</span>
          <div>
            <h2>/tasks</h2>
            <p>Fetches all study tasks from MongoDB.</p>
          </div>
        </article>

        <article className="api-card">
          <span className="method post">POST</span>
          <div>
            <h2>/tasks</h2>
            <p>Adds a new study task.</p>
            <pre>{`{
  "title": "Complete DBMS Notes",
  "subject": "DBMS",
  "priority": "High"
}`}</pre>
          </div>
        </article>

        <article className="api-card">
          <span className="method put">PUT</span>
          <div>
            <h2>/tasks/:id</h2>
            <p>Updates an existing task by MongoDB id.</p>
          </div>
        </article>

        <article className="api-card">
          <span className="method delete">DELETE</span>
          <div>
            <h2>/tasks/:id</h2>
            <p>Deletes a task by MongoDB id.</p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default ApiGuide;
