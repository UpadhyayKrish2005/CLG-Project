import React, { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', subject: '', priority: 'Medium' });
  const [loading, setLoading] = useState(false);

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add Task
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.subject.trim()) {
      return toast.error("Title and Subject are required");
    }

    try {
      await api.post('/tasks', newTask);
      toast.success('Task added!');
      setNewTask({ title: '', subject: '', priority: 'Medium' });
      fetchTasks();
    } catch (err) {
      toast.error('Failed to add task');
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };


  return (
    <>
      <section className="app-header">
        <p className="eyebrow">User Dashboard</p>
        <h1>📚 My Study Tasks</h1>
        <p className="subtitle">Manage and track your personalized study plan in real time.</p>
      </section>

      <section className="planner-grid">
        {/* Add Task Form */}
        <form onSubmit={addTask} className="task-form card">
          <div className="form-heading">
            <span className="section-icon">AD</span>
            <div>
              <h2>Add Task</h2>
              <p>Add to your dashboard.</p>
            </div>
          </div>

          <label htmlFor="title">Task Title</label>
          <input
            id="title"
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            required
          />

          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            type="text"
            placeholder="Subject"
            value={newTask.subject}
            onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
            required
          />

          <label htmlFor="priority">Priority</label>
          <div className="priority-picker" style={{ marginBottom: '20px' }}>
            {['Low', 'Medium', 'High'].map((p) => (
              <button
                type="button"
                key={p}
                className={newTask.priority === p ? `selected ${p.toLowerCase()}` : ""}
                onClick={() => setNewTask({...newTask, priority: p})}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" style={{ width: '100%' }}>Add Task</button>
          </div>
        </form>

        {/* Tasks List */}
        <div className="task-list card">
          <div className="list-header">
            <div>
              <h2>Your Tasks</h2>
              <p>Your personalized study tasks.</p>
            </div>
            <span>{tasks.length} task{tasks.length === 1 ? "" : "s"}</span>
          </div>

          {loading ? (
            <p className="empty-state">Loading your tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="empty-state">No tasks yet. Add some!</p>
          ) : (
            <div className="task-items">
              {tasks.map(task => (
                <article className="task-card" key={task._id}>
                  <div className="task-main">
                    <span className="subject-badge">{task.subject.slice(0, 2).toUpperCase()}</span>
                    <div>
                      <h3>{task.title}</h3>
                      <p>{task.subject}</p>
                      <small>Updated {new Date(task.updatedAt).toLocaleDateString()}</small>
                    </div>
                  </div>

                  <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>

                  <div className="task-actions">
                    <button
                      type="button"
                      onClick={() => deleteTask(task._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;