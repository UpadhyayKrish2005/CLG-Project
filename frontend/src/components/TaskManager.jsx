import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api";

const emptyForm = {
  title: "",
  subject: "",
  priority: "Medium",
};

const priorities = ["Low", "Medium", "High"];
const apiErrorMessage = "❌ Something went wrong. Please try again.";

const TaskManager = ({ view = "full" }) => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to load tasks");
      toast.error(apiErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePriorityChange = (priority) => {
    setFormData({
      ...formData,
      priority,
    });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingTaskId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.subject.trim()) {
      setErrorMessage("Please enter both title and subject");
      return;
    }

    try {
      setErrorMessage("");

      if (editingTaskId) {
        await api.put(`/tasks/${editingTaskId}`, formData);
        toast.success("✏️ Task updated successfully!");
      } else {
        await api.post("/tasks", formData);
        toast.success("✅ Task added successfully!");
      }

      resetForm();
      fetchTasks();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to save task");
      toast.error(apiErrorMessage);
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      subject: task.subject,
      priority: task.priority,
    });
    setEditingTaskId(task._id);
    setErrorMessage("");
  };

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
  };

  const closeDeleteModal = () => {
    setTaskToDelete(null);
  };

  const handleDelete = async () => {
    if (!taskToDelete) {
      return;
    }

    try {
      setErrorMessage("");
      await api.delete(`/tasks/${taskToDelete._id}`);
      toast.success("🗑️ Task deleted successfully!");
      closeDeleteModal();
      fetchTasks();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to delete task");
      toast.error(apiErrorMessage);
    }
  };

  const showForm = view !== "list" || editingTaskId;
  const showList = view !== "form";

  return (
    <section className={view === "full" ? "planner-grid" : "planner-grid single-column"}>
      {showForm && (
      <form className="task-form card" onSubmit={handleSubmit}>
        <div className="form-heading">
          <span className="section-icon">{editingTaskId ? "ED" : "AD"}</span>
          <div>
            <h2>{editingTaskId ? "Edit Task" : "Add Study Task"}</h2>
            <p>{editingTaskId ? "Update the selected study task." : "Plan your next study session."}</p>
          </div>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Example: Revise algebra"
        />

        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="Example: Mathematics"
        />

        <label htmlFor="priority">Priority</label>
        <div className="priority-picker" id="priority">
          {priorities.map((priority) => (
            <button
              type="button"
              key={priority}
              className={formData.priority === priority ? `selected ${priority.toLowerCase()}` : ""}
              onClick={() => handlePriorityChange(priority)}
            >
              {priority}
            </button>
          ))}
        </div>

        <div className="form-actions">
          <button type="submit">{editingTaskId ? "Update Task" : "Add Task"}</button>
          {editingTaskId && (
            <button type="button" className="secondary-button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
      )}

      {showList && (
      <div className="task-list card">
        <div className="list-header">
          <div>
            <h2>All Tasks</h2>
            <p>Manage your saved study plan.</p>
          </div>
          <span>{tasks.length} task{tasks.length === 1 ? "" : "s"}</span>
        </div>

        {loading ? (
          <p className="empty-state">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty-state">No tasks added yet.</p>
        ) : (
          <div className="task-items">
            {tasks.map((task) => (
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
                  <button type="button" className="edit-button" onClick={() => handleEdit(task)}>
                    Edit
                  </button>
                  <button type="button" className="delete-button" onClick={() => openDeleteModal(task)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      )}

      {taskToDelete && (
        <div className="modal-backdrop">
          <div className="confirm-modal">
            <span className="modal-icon">DL</span>
            <h2>Delete Task?</h2>
            <p>
              Are you sure you want to delete <strong>{taskToDelete.title}</strong>? This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button type="button" className="delete-button" onClick={handleDelete}>
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TaskManager;
