import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Sidebar from "./components/Dashboard/sidebar.jsx";
import PomodoroTimer from "./components/Dashboard/PomodoroTimer.jsx";
import "./index.css";

const Tasks = () => <div className="p-8">Tasks page content</div>;
const Goals = () => <div className="p-8">Goals page content</div>;
const Summary = () => <div className="p-8">Summary page content</div>;

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  // Load login status on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setLoggedIn(loggedIn);
  }, []);

  // Update localStorage when login state changes
  const handleLogin = (value) => {
    setLoggedIn(value);
    localStorage.setItem("isLoggedIn", value.toString());
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }
  
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
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