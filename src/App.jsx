import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Sidebar from "./components/Dashboard/Sidebar.jsx";
import Tasks from "./components/Dashboard/Tasks.jsx";
import Notes from "./components/Dashboard/Notes.jsx";
import "./index.css";


const Analytics = () => (
  <div className="container mx-auto">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h1>
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-[#1B9CFC] to-[#4D9EFF] text-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Completed</h3>
          <p className="text-3xl font-bold">8</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold">67%</p>
        </div>
      </div>
      <p className="text-gray-600">Analytics dashboard coming soon. This will show task completion rates, productivity patterns, and goal tracking metrics.</p>
    </div>
  </div>
);

const Summary = () => <div className="p-8">Summary page content</div>;

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUsername = localStorage.getItem("username");
    setLoggedIn(loggedIn);
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleLogin = (data) => {
    setLoggedIn(true);
    setUsername(data.username);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", data.username);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("username");
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }
  
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[#F5F7FA]">
        <Sidebar username={username} />
        <div className="flex-1 overflow-auto">
          <div className="p-4 flex justify-between items-center bg-white shadow-sm">
            <h1 className="text-xl font-semibold text-gray-800">
              Welcome, {username}
            </h1>
            <button
              onClick={handleLogout}
              className="bg-[#1B9CFC] hover:bg-[#1b9afcdf] text-white px-4 py-2 rounded-md transition duration-300 flex items-center"
            >
              Logout
            </button>
          </div>
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Tasks />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/analytics" element={<Analytics />} />

              <Route path="/notes" element={<Notes />} />
              <Route path="*" element={<Tasks />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;