import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import Login from "./components/Login.jsx";
import Sidebar from "./components/Dashboard/Sidebar.jsx";
import Tasks from "./components/Dashboard/Tasks.jsx";
import Notes from "./components/Dashboard/Notes.jsx";
import Analytics from "./components/Dashboard/Analytics.jsx"; 
import Summary from "./components/Dashboard/Summary.jsx";
import FocusMode from "./components/Dashboard/FocusMode.jsx";
import CalendarView from "./components/Dashboard/CalendarView.jsx";
import { format } from "date-fns";
import { Menu, X } from "lucide-react";
import "./index.css";


function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);


  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 768);


  const [focusTimerState, setFocusTimerState] = useState({
    isRunning: false,
    mode: 'focus', 
    timeLeft: 25 * 60, 
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
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileScreen(mobile);
      if (!mobile && mobileNavOpen) {
        setMobileNavOpen(false);
      }
      if (mobile && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); 
    
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileNavOpen, sidebarCollapsed]);
  

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
    });
    
    document.title = "PlanX - Daily Planner";

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    focusAudioRef.current = new Audio('/timer-sound.mp3');
  }, []);

  const handleLogin = (data) => {
    setUsername(data.username);
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      if (focusTimerState.isRunning) {
        pauseFocusTimer();
      }
      await signOut(auth);
      setLoggedIn(false);
      setUsername("");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (isMobileScreen) {
      setMobileNavOpen(false);
    }
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };


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

  return (
    <BrowserRouter>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="flex flex-col md:flex-row h-screen bg-[#F5F7FA] overflow-hidden">

          {isMobileScreen && mobileNavOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileNav}></div>
          )}
          

          <div className={`
            ${isMobileScreen ? 'fixed z-50 h-full' : 'relative'} 
            ${isMobileScreen && !mobileNavOpen ? '-translate-x-full' : 'translate-x-0'}
            transition-transform duration-300 ease-in-out
          `}>
            <Sidebar 
              username={username} 
              onDateChange={handleDateChange} 
              selectedDate={selectedDate}
              collapsed={!isMobileScreen && sidebarCollapsed}
              toggleSidebar={toggleSidebar}
              isMobile={isMobileScreen}
              closeMobileNav={toggleMobileNav}
            />
          </div>
          

          <div className="flex-1 flex flex-col overflow-hidden">

            <div className="p-4 flex justify-between items-center bg-white shadow-sm border-b border-[#1A1A1A]/10">
              <div className="flex items-center">
                {isMobileScreen ? (
                  <button 
                    onClick={toggleMobileNav}
                    className="mr-3 p-2 rounded-full hover:bg-gray-100"
                  >
                    <Menu className="h-5 w-5 text-gray-600" />
                  </button>
                ) : (
                  sidebarCollapsed && (
                    <button 
                      onClick={toggleSidebar}
                      className="mr-3 p-2 rounded-full hover:bg-gray-100"
                    >
                      <Menu className="h-5 w-5 text-gray-600" />
                    </button>
                  )
                )}
                <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
                  Welcome, {username || "User"}
                </h1>
              </div>
              
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-sm transition duration-300 flex items-center whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            </div>
            

            <div className="flex-1 p-3 md:p-6 overflow-auto">
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
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="*" element={<Navigate to="/tasks" />} />
              </Routes>
            </div>
            
            <div className={`${isMobileScreen ? 'pb-4' : ''}`}>
              <Chatbot isMobile={isMobileScreen} />
            </div>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;