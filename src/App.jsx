import React, { useState, useEffect, useRef } from "react"; // Added useRef
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import Login from "./components/Login.jsx";
import Sidebar from "./components/Dashboard/sidebar.jsx";
import Tasks from "./components/Dashboard/Tasks.jsx";
import Notes from "./components/Dashboard/Notes.jsx";
import Analytics from "./components/Dashboard/Analytics.jsx"; 
import Summary from "./components/Dashboard/Summary.jsx";
import FocusMode from "./components/Dashboard/FocusMode.jsx";
import CalendarView from "./components/Dashboard/CalendarView.jsx";
import "./index.css";
import Chatbot from "./components/Chatbot/Chatbot.jsx"; // Import the Chatbot
import { format } from "date-fns";


function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Renamed for clarity

  // Focus Timer State Lifted to App.jsx
  const [focusTimerState, setFocusTimerState] = useState({
    isRunning: false,
    mode: 'focus', // 'focus', 'shortBreak', 'longBreak'
    timeLeft: 25 * 60, // seconds
    settings: {
      focus: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60
    },
    soundEnabled: true,
  });
  const focusTimerRef = useRef(null);
  const focusAudioRef = useRef(null);
  const focusSessionCompletedCallbackRef = useRef(null); // To call FocusMode's logging function

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        setUsername(user.displayName || user.email.split('@')[0]);
      } else {
        // If user logs out, ensure timer stops and resets if it was running
        if (focusTimerState.isRunning) pauseFocusTimer();
        setLoggedIn(false);
        setUsername("");
      }
    });
    
    document.title = "PlanX - Daily Planner";

    return () => unsubscribe();
  }, []);

  // Initialize audio ref once
  useEffect(() => {
    focusAudioRef.current = new Audio('/timer-sound.mp3');
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
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // --- Focus Timer Logic ---
  useEffect(() => {
    if (focusTimerState.isRunning && isLoggedIn) {
      focusTimerRef.current = setInterval(() => {
        setFocusTimerState(prev => {
          if (prev.timeLeft <= 1) {
            handleFocusTimerComplete(prev.mode, prev.settings[prev.mode]);
            return { ...prev, timeLeft: 0, isRunning: false }; // Stop timer here
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else if (focusTimerRef.current) {
      clearInterval(focusTimerRef.current);
    }
    return () => {
      if (focusTimerRef.current) clearInterval(focusTimerRef.current);
    };
  }, [focusTimerState.isRunning, isLoggedIn]); // Add isLoggedIn dependency

  const handleFocusTimerComplete = (completedMode, duration) => {
    if (focusTimerRef.current) clearInterval(focusTimerRef.current);

    if (focusTimerState.soundEnabled && focusAudioRef.current) {
      focusAudioRef.current.play().catch(e => console.log("App.jsx: Audio play failed:", e));
    }

    if (completedMode === 'focus' && focusSessionCompletedCallbackRef.current) {
      focusSessionCompletedCallbackRef.current(duration);
    }

    let nextMode = 'focus';
    if (completedMode === 'focus') nextMode = 'shortBreak';
    else if (completedMode === 'shortBreak') nextMode = 'focus';
    else if (completedMode === 'longBreak') nextMode = 'focus';

    setFocusTimerState(prev => ({
      ...prev,
      isRunning: false, // Ensure it's set to false before mode change potentially starts it
      mode: nextMode,
      timeLeft: prev.settings[nextMode],
    }));
  };

  const startFocusTimer = () => setFocusTimerState(prev => ({ ...prev, isRunning: true }));
  const pauseFocusTimer = () => setFocusTimerState(prev => ({ ...prev, isRunning: false }));
  const resetFocusTimer = () => {
    setFocusTimerState(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: prev.settings[prev.mode]
    }));
  };
  const changeFocusMode = (newMode) => {
    setFocusTimerState(prev => ({
      ...prev,
      isRunning: false,
      mode: newMode,
      timeLeft: prev.settings[newMode]
    }));
  };
  const updateFocusSettings = (modeKey, minutes) => {
    const newTimeInSeconds = minutes * 60;
    setFocusTimerState(prev => {
      const newSettings = { ...prev.settings, [modeKey]: newTimeInSeconds };
      // If the currently active mode's setting is changed, update timeLeft if not running
      const newTimeLeft = (prev.mode === modeKey && !prev.isRunning) ? newTimeInSeconds : prev.timeLeft;
      return {
        ...prev,
        settings: newSettings,
        timeLeft: newTimeLeft,
      };
    });
  };
  const toggleFocusSound = () => setFocusTimerState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  
  const registerFocusSessionCompletedCallback = (callback) => {
    focusSessionCompletedCallbackRef.current = callback;
  };
  // --- End Focus Timer Logic ---

  // if (!isLoggedIn) {
  //   return <Login onLogin={handleLogin} />;
  // }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
        <Sidebar 
          username={username} 
          onDateChange={handleDateChange} 
          selectedDate={selectedDate}
          logoPath="/assets/logo.png"
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="p-4 flex justify-between items-center bg-white shadow-sm border-b border-[#1A1A1A]/10">
            <div className="flex items-center">
              {sidebarCollapsed && (
                <button 
                  onClick={toggleSidebar}
                  className="mr-3 p-2 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <h1 className="text-xl font-semibold text-gray-800">
                Welcome, {username || "User"}
              </h1>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={() => {/* Toggle theme or settings */}}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full mr-3 transition duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300 flex items-center"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/tasks" />} />
              <Route path="/tasks" element={<Tasks selectedDate={selectedDate} onDateChange={handleDateChange} />} />
              <Route 
                path="/focus" 
                element={
                  <FocusMode
                    timerState={focusTimerState}
                    startTimer={startFocusTimer}
                    pauseTimer={pauseFocusTimer}
                    resetTimer={resetFocusTimer}
                    changeMode={changeFocusMode}
                    updateSettings={updateFocusSettings}
                    toggleSound={toggleFocusSound}
                    registerSessionCompletedCallback={registerFocusSessionCompletedCallback}
                  />} 
              />
              <Route path="/calendar" element={<CalendarView onDateSelect={handleDateChange} />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/summary" element={<Summary date={selectedDate} />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="*" element={<Navigate to="/tasks" />} />
            </Routes>
          </div>
          <Chatbot /> {/* Add Chatbot component here */}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;