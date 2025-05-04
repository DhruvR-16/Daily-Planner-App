import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Sidebar from "./components/Dashboard/sidebar.jsx";
import PomodoroTimer from "./components/Dashboard/PomodoroTimer.jsx";
import "./index.css";
import Tasks from "./components/Dashboard/Tasks.jsx";

const Goals = () => <div className="p-8">Goals page content</div>;
const Summary = () => <div className="p-8">Summary page content</div>;

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);


  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setLoggedIn(loggedIn);
  }, []);


  const handleLogin = (value) => {
    setLoggedIn(value);
    localStorage.setItem("isLoggedIn", value.toString());
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("username");
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }
  
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
          <Routes>
            <Route path="/" element={<Tasks />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/pomodoro" element={<PomodoroTimer />} />
            <Route path="*" element={<Tasks />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;