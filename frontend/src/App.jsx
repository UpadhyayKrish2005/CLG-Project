import React from "react";
import { useState } from "react";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar.jsx";
import AllTasks from "./pages/AllTasks.jsx";
import ApiGuide from "./pages/ApiGuide.jsx";
import Overview from "./pages/Overview.jsx";
import Planner from "./pages/Planner.jsx";

const App = () => {
  const [activePage, setActivePage] = useState("planner");

  const renderPage = () => {
    if (activePage === "overview") {
      return <Overview />;
    }

    if (activePage === "tasks") {
      return <AllTasks />;
    }

    if (activePage === "api") {
      return <ApiGuide />;
    }

    return <Planner />;
  };

  return (
    <main className="app">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      {renderPage()}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeButton
        transition={Slide}
      />
    </main>
  );
};

export default App;
