import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="page-panel home-hero">
      <div className="hero-content">
        <span className="eyebrow">Welcome to Study Planner</span>
        <h1>Master Your Academic Schedule</h1>
        <p className="subtitle">
          An intuitive, secure, and modern study planner designed to organize your tasks, prioritize your subjects, and boost your productivity.
        </p>

        <div className="hero-actions">
          {user ? (
            <Link to="/dashboard" className="cta-button primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="cta-button primary">
                Sign In
              </Link>
              <Link to="/register" className="cta-button secondary">
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="features-grid">
        <article className="feature-card card">
          <span className="feature-icon">📝</span>
          <h3>Task Management</h3>
          <p>Easily create, edit, and organize your tasks with subject tagging and notes.</p>
        </article>
        <article className="feature-card card">
          <span className="feature-icon">⚡</span>
          <h3>Priority Sorting</h3>
          <p>Tag tasks as High, Medium, or Low priority to tackle what matters most first.</p>
        </article>
        <article className="feature-card card">
          <span className="feature-icon">🔒</span>
          <h3>Private Access</h3>
          <p>Secure authentication ensures your study schedule is yours alone.</p>
        </article>
      </div>
    </section>
  );
};

export default Home;
