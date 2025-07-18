import React, { useState, useEffect, useRef } from "react";
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
import Chatbot from "./components/Chatbot/Chatbot.jsx";
import LoadingSpinner from "./components/UI/LoadingSpinner.jsx";
import Button from "./components/UI/Button.jsx";
import { Settings, LogOut } from "lucide-react";
import { format } from "date-fns";
import "./index.css";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
  const focusSessionCompletedCallbackRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        setUsername(user.displayName || user.email.split('@')[0]);
      } else {
        if (focusTimerState.isRunning) pauseFocusTimer();
        setLoggedIn(false);
        setUsername("");
      }
      setIsLoading(false);
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

  // Focus Timer Logic
  useEffect(() => {
    if (focusTimerState.isRunning && isLoggedIn) {
      focusTimerRef.current = setInterval(() => {
        setFocusTimerState(prev => {
          if (prev.timeLeft <= 1) {
            handleFocusTimerComplete(prev.mode, prev.settings[prev.mode]);
            return { ...prev, timeLeft: 0, isRunning: false };
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
  }, [focusTimerState.isRunning, isLoggedIn]);

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
      isRunning: false,
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

  if (isLoading) {
    return (
      <LoadingSpinner 
        fullScreen 
        size="large" 
        text="Loading PlanX..." 
        color="primary" 
      />
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

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
                  className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
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
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="medium"
                icon={<Settings size={18} />}
                onClick={() => {/* Toggle theme or settings */}}
                aria-label="Settings"
              />
              
              <Button
                variant="danger"
                size="medium"
                icon={<LogOut size={18} />}
                onClick={handleLogout}
              >
                Logout
              </Button>
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
          <Chatbot />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;