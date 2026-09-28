import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api";
import { formatDate } from "../taskUtils";

const StudyAssistant = () => {
  const [tasks, setTasks] = useState([]);
  const [action, setAction] = useState("plan");
  const [taskId, setTaskId] = useState("");
  const [answer, setAnswer] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [generating, setGenerating] = useState(false);
  useEffect(() => { api.get("/tasks").then(({ data }) => setTasks(data.filter((task) => !task.completed))).catch(() => toast.error("Unable to load your pending tasks.")).finally(() => setLoadingTasks(false)); }, []);
  const generate = async () => {
    if (action === "breakdown" && !taskId) { toast.info("Choose a task to break down."); return; }
    setGenerating(true); setAnswer("");
    try { const { data } = await api.post("/api/ai/assist", { action, ...(action === "breakdown" ? { taskId } : {}) }); setAnswer(data.text); }
    catch (error) { toast.error(error.response?.data?.message || "Unable to reach the AI assistant."); }
    finally { setGenerating(false); }
  };
  const task = tasks.find((item) => item._id === taskId);
  return <><section className="app-header left-header"><p className="eyebrow">Personalized study help</p><h1>AI Study Assistant</h1><p className="subtitle">Get suggestions based on your pending tasks. The assistant never changes your planner.</p></section>
    <section className="assistant-layout"><div className="card assistant-controls"><div className="section-heading"><p className="eyebrow">Your study data</p><h2>What would you like help with?</h2></div>
      <label>Study support<select value={action} onChange={(event) => { setAction(event.target.value); setAnswer(""); }}><option value="plan">Generate today's study plan</option><option value="suggestions">Suggest what to focus on</option><option value="breakdown">Break a task into smaller steps</option></select></label>
      {action === "breakdown" && <label>Pending task<select value={taskId} onChange={(event) => setTaskId(event.target.value)}><option value="">Choose a task</option>{tasks.map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}</select></label>}
      {loadingTasks ? <p className="empty-state">Loading your pending tasks…</p> : tasks.length ? <p className="assistant-context">Using {tasks.length} pending task{tasks.length === 1 ? "" : "s"} from your planner{task ? ` · ${task.subject}, ${task.priority} priority${task.dueDate ? ` · due ${formatDate(task.dueDate)}` : ""}` : ""}.</p> : <p className="empty-state">Add a pending task in your Planner to get personalized help.</p>}
      <button className="primary-button" type="button" disabled={generating || loadingTasks || !tasks.length} onClick={generate}>{generating ? "Thinking…" : "Generate suggestions"}</button>
    </div><div className="card assistant-response"><div className="section-heading"><p className="eyebrow">Your assistant</p><h2>{answer ? "Study suggestions" : "Ready when you are"}</h2></div>{generating ? <p className="empty-state">Reviewing your pending tasks…</p> : answer ? <div className="assistant-answer">{answer}</div> : <p className="empty-state">Choose a type of help to get a study plan, focused suggestions, or smaller steps for a task.</p>}</div></section>
  </>;
};
export default StudyAssistant;
