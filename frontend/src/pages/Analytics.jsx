import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../api";

const colors = ["#254e70", "#14827d", "#6d5ba8", "#e49b2f", "#c84b50"];
const Bar = ({ label, value, total, color }) => <div className="bar-row"><span>{label}</span><div className="bar-track"><i style={{ width: `${total ? (value / total) * 100 : 0}%`, background: color }} /></div><strong>{value}</strong></div>;

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/tasks").then(({ data }) => setTasks(data)).catch(() => toast.error("Unable to load analytics." )).finally(() => setLoading(false)); }, []);
  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    const priorities = Object.fromEntries(["High", "Medium", "Low"].map((priority) => [priority, tasks.filter((task) => task.priority === priority).length]));
    const subjects = Object.entries(tasks.reduce((counts, task) => { const name = task.subject || "Uncategorized"; counts[name] = (counts[name] || 0) + 1; return counts; }, {})).sort((a, b) => b[1] - a[1]);
    const months = Object.entries(tasks.reduce((counts, task) => { if (task.dueDate) { const date = new Date(task.dueDate); const key = date.toLocaleDateString(undefined, { month: "short", year: "numeric" }); counts[key] = (counts[key] || 0) + 1; } return counts; }, {}));
    return { completed, pending: tasks.length - completed, priorities, subjects, months };
  }, [tasks]);
  return <><section className="app-header left-header"><p className="eyebrow">Your study data</p><h1>Study Progress</h1><p className="subtitle">Live summaries based on your saved tasks.</p></section>
    {loading ? <p className="empty-state">Loading analytics…</p> : !tasks.length ? <p className="empty-state">Add tasks to see your academic analytics.</p> : <>
      <section className="stats-grid analytics-stats"><article className="card stat-card"><span>Total Tasks</span><strong>{tasks.length}</strong></article><article className="card stat-card"><span>Completed</span><strong>{stats.completed}</strong></article><article className="card stat-card"><span>Pending</span><strong>{stats.pending}</strong></article><article className="card stat-card"><span>Completion</span><strong>{Math.round((stats.completed / tasks.length) * 100)}%</strong></article><article className="card stat-card"><span>High Priority</span><strong>{stats.priorities.High}</strong></article><article className="card stat-card"><span>Medium Priority</span><strong>{stats.priorities.Medium}</strong></article><article className="card stat-card"><span>Low Priority</span><strong>{stats.priorities.Low}</strong></article></section>
      <section className="analytics-grid"><div className="card panel"><h2>Completed vs Pending</h2><Bar label="Completed" value={stats.completed} total={tasks.length} color="#14827d"/><Bar label="Pending" value={stats.pending} total={tasks.length} color="#e49b2f"/></div>
        <div className="card panel"><h2>Tasks by Priority</h2>{["High", "Medium", "Low"].map((priority, index) => <Bar key={priority} label={priority} value={stats.priorities[priority]} total={tasks.length} color={["#c84b50", "#e49b2f", "#14827d"][index]}/>)}</div>
        <div className="card panel"><h2>Tasks by Subject</h2>{stats.subjects.map(([subject, count], index) => <Bar key={subject} label={subject} value={count} total={tasks.length} color={colors[index % colors.length]}/>)}</div>
        {stats.months.length > 0 && <div className="card panel"><h2>Tasks by Due Month</h2>{stats.months.map(([month, count], index) => <Bar key={month} label={month} value={count} total={tasks.length} color={colors[index % colors.length]}/>)}</div>}
      </section></>}
  </>;
};
export default Analytics;
