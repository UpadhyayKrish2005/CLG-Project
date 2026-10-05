import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../api";
import { TaskCard } from "../components/TaskManager";

const initialFilters = { query: "", subject: "All", priority: "All", status: "All", due: "All", sort: "due-asc" };
const dayStart = (value) => { const date = new Date(value); date.setHours(0, 0, 0, 0); return date; };

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const load = async () => { try { setLoading(true); const { data } = await api.get("/tasks"); setTasks(data); } catch { toast.error("Unable to load tasks."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const subjects = useMemo(() => [...new Set(tasks.map((task) => task.subject).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [tasks]);
  const displayed = useMemo(() => {
    const today = dayStart(new Date());
    return tasks.filter((task) => {
      const q = filters.query.trim().toLowerCase();
      const due = task.dueDate ? dayStart(task.dueDate) : null;
      return (!q || task.title.toLowerCase().includes(q)) &&
        (filters.subject === "All" || task.subject === filters.subject) &&
        (filters.priority === "All" || task.priority === filters.priority) &&
        (filters.status === "All" || (filters.status === "Completed" ? task.completed : !task.completed)) &&
        (filters.due === "All" || (filters.due === "No date" ? !due : filters.due === "Overdue" ? !task.completed && due && due < today : filters.due === "Upcoming" ? due && due >= today : due && due.getTime() === dayStart(new Date()).getTime()));
    }).sort((a, b) => {
      if (filters.sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (filters.sort === "due-desc") return (b.dueDate ? new Date(b.dueDate).getTime() : 0) - (a.dueDate ? new Date(a.dueDate).getTime() : 0);
      return (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) - (b.dueDate ? new Date(b.dueDate).getTime() : Infinity);
    });
  }, [tasks, filters]);
  const update = async (task) => { try { await api.delete(`/tasks/${task._id}`); setTasks((current) => current.filter((item) => item._id !== task._id)); toast.success("Task completed and removed."); } catch { toast.error("Unable to complete task."); } };
  const remove = async (task) => { if (!window.confirm(`Delete “${task.title}”?`)) return; try { await api.delete(`/tasks/${task._id}`); toast.success("Task deleted."); await load(); } catch { toast.error("Unable to delete task."); } };
  const set = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));
  return <><section className="app-header left-header"><p className="eyebrow">Task library</p><h1>All Study Tasks</h1><p className="subtitle">Search, organize, and update your academic work.</p></section>
    <section className="card filters" aria-label="Task filters"><input aria-label="Search task titles" placeholder="Search task titles..." value={filters.query} onChange={set("query")} />
      <select aria-label="Filter by subject" value={filters.subject} onChange={set("subject")}><option>All</option>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select>
      <select aria-label="Filter by priority" value={filters.priority} onChange={set("priority")}><option>All</option>{["High", "Medium", "Low"].map((value) => <option key={value}>{value}</option>)}</select>
      <select aria-label="Filter by status" value={filters.status} onChange={set("status")}><option>All</option><option>Pending</option><option>Completed</option></select>
      <select aria-label="Filter by due date" value={filters.due} onChange={set("due")}><option>All</option><option>Today</option><option>Upcoming</option><option>Overdue</option><option>No date</option></select>
      <select aria-label="Sort tasks" value={filters.sort} onChange={set("sort")}><option value="due-asc">Due date: earliest</option><option value="due-desc">Due date: latest</option><option value="newest">Newest first</option></select>
      <button className="secondary-button clear-filters" type="button" onClick={() => setFilters(initialFilters)}>Clear Filters</button></section>
    <p className="filter-count">Showing {displayed.length} of {tasks.length} tasks</p>
    {loading ? <p className="empty-state">Loading tasks…</p> : displayed.length ? <div className="task-items all-task-list">{displayed.map((task) => <TaskCard key={task._id} task={task} onToggle={update} onDelete={remove} onEdit={() => toast.info("Edit tasks from the Planner page.")} />)}</div> : <p className="empty-state">{tasks.length ? "No tasks match these filters." : "No tasks yet. Add your first task in the Planner."}</p>}
  </>;
};
export default AllTasks;
