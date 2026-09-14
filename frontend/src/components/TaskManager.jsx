import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api";
import { dateInputValue, formatDate } from "../taskUtils";

const blankTask = { title: "", description: "", subject: "", priority: "Medium", dueDate: "", completed: false };

export const TaskCard = ({ task, onEdit, onDelete, onToggle, onOpen }) => (
  <article className={`task-card ${task.completed ? "is-complete" : ""}`}>
    <button className="status-toggle" onClick={() => onToggle(task)} aria-label={`Mark ${task.title} as ${task.completed ? "pending" : "completed"}`}>{task.completed ? "✓" : ""}</button>
    <button className="task-content" onClick={() => onOpen?.(task)}><div className="task-card-top"><span className="subject-badge">{task.subject.slice(0, 2).toUpperCase()}</span><div><h3>{task.title}</h3><p>{task.subject}</p></div></div>{task.description && <p className="task-description">{task.description}</p>}<div className="task-meta"><span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority.toUpperCase()}</span><span>{formatDate(task.dueDate)}</span></div></button>
    {(onEdit || onDelete) && <div className="task-actions"><button className="text-button" onClick={() => onEdit(task)}>Edit</button><button className="text-button danger" onClick={() => onDelete(task)}>Delete</button></div>}
  </article>
);

const TaskManager = () => {
  const [tasks, setTasks] = useState([]); const [form, setForm] = useState(blankTask); const [editingId, setEditingId] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const fetchTasks = async () => { try { setLoading(true); setError(""); const { data } = await api.get("/tasks"); setTasks(data); } catch (e) { setError(e.response?.data?.message || "Unable to load tasks."); } finally { setLoading(false); } };
  useEffect(() => { fetchTasks(); }, []);
  const save = async (event) => { event.preventDefault(); if (!form.title.trim() || !form.subject.trim()) return setError("Title and subject are required."); try { if (editingId) await api.put(`/tasks/${editingId}`, form); else await api.post("/tasks", form); toast.success(editingId ? "Task updated." : "Task added."); setForm(blankTask); setEditingId(null); fetchTasks(); } catch (e) { setError(e.response?.data?.message || "Unable to save task."); } };
  const edit = (task) => { setForm({ ...task, dueDate: dateInputValue(task.dueDate) }); setEditingId(task._id); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const remove = async (task) => { if (!window.confirm(`Delete “${task.title}”?`)) return; try { await api.delete(`/tasks/${task._id}`); toast.success("Task deleted."); fetchTasks(); } catch { toast.error("Unable to delete task."); } };
  const toggle = async (task) => { try { await api.put(`/tasks/${task._id}`, { ...task, completed: !task.completed, dueDate: dateInputValue(task.dueDate) }); toast.success(task.completed ? "Marked as pending." : "Marked complete."); fetchTasks(); } catch { toast.error("Unable to update task."); } };
  return <section className="planner-layout"><form className="card task-form" onSubmit={save}><div className="section-heading"><p className="eyebrow">{editingId ? "Update task" : "New task"}</p><h2>{editingId ? "Edit study task" : "Plan a study task"}</h2></div>{error && <p className="error-message">{error}</p>}<label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Complete DBMS assignment" /></label><label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional notes or requirements" maxLength="500" /></label><div className="form-row"><label>Subject<input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. DBMS" /></label><label>Due date<input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label></div><label>Priority<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></label><div className="form-actions"><button className="primary-button">{editingId ? "Save changes" : "Add task"}</button>{editingId && <button type="button" className="secondary-button" onClick={() => { setForm(blankTask); setEditingId(null); }}>Cancel</button>}</div></form><div className="card task-preview"><div className="section-heading"><p className="eyebrow">Your plan</p><h2>Recently added</h2></div>{loading ? <p className="empty-state">Loading tasks…</p> : tasks.length ? <div className="task-items">{tasks.slice(0, 4).map((task) => <TaskCard key={task._id} task={task} onEdit={edit} onDelete={remove} onToggle={toggle} />)}</div> : <p className="empty-state">Start by adding your first academic task.</p>}</div></section>;
};
export default TaskManager;
