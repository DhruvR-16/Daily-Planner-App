import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import Login from "./components/Login.jsx";
import Sidebar from "./components/Dashboard/Sidebar.jsx";
import Tasks from "./components/Dashboard/Tasks.jsx";
import Notes from "./components/Dashboard/Notes.jsx";
import Analytics from "./components/Dashboard/Analytics.jsx";
import "./index.css";
import { format } from "date-fns";

const Summary = () => <div className="p-8">Summary page content</div>;

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        setUsername(user.displayName || user.email.split('@')[0]);
      } else {
        setLoggedIn(false);
        setUsername("");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (data) => {
    setUsername(data.username);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F7FA]">
        <div className="animate-spin h-12 w-12 border-4 border-[#1B9CFC] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }
  
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[#F5F7FA]">
        <Sidebar username={username} onDateChange={handleDateChange} />
        <div className="flex-1 overflow-auto">
          <div className="p-4 flex justify-between items-center bg-white shadow-sm border-b border-[#1A1A1A]/10">
            <h1 className="text-xl font-semibold text-gray-800">
              Welcome, {username}
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300 flex items-center"
            >
              Logout
            </button>
          </div>
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Tasks selectedDate={selectedDate} />} />
              <Route path="/tasks" element={<Tasks selectedDate={selectedDate} />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="*" element={<Navigate to="/tasks" />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;