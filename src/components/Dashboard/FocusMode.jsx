import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, PlusCircle, Settings, Volume2, VolumeX } from 'lucide-react';

const FocusMode = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus', 'shortBreak', 'longBreak'
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [timerSettings, setTimerSettings] = useState({
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  });
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [focusHistory, setFocusHistory] = useState([]);
  const [todayFocused, setTodayFocused] = useState(0); // in seconds
  
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {

    try {
      const storedHistory = localStorage.getItem('focusHistory');
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        setFocusHistory(history);
        

        const today = new Date().toISOString().split('T')[0];
        const todaySessions = history.filter(session => session.date === today);
        const totalSeconds = todaySessions.reduce((total, session) => total + session.duration, 0);
        setTodayFocused(totalSeconds);
      }
    } catch (error) {
      console.error("Error loading focus history:", error);
    }
    

    audioRef.current = new Audio('/timer-sound.mp3'); 
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleTimerComplete = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    

    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    

    if (mode === 'focus') {
      const today = new Date().toISOString().split('T')[0];
      const newSession = {
        id: Date.now(),
        duration: timerSettings.focus - timeLeft, 
        date: today,
        timestamp: new Date().toISOString()
      };
      
      const updatedHistory = [...focusHistory, newSession];
      setFocusHistory(updatedHistory);
      

      const todaySessions = updatedHistory.filter(session => session.date === today);
      const totalSeconds = todaySessions.reduce((total, session) => total + session.duration, 0);
      setTodayFocused(totalSeconds);
      

      localStorage.setItem('focusHistory', JSON.stringify(updatedHistory));
    }
    

    switch (mode) {
      case 'focus':
        setMode('shortBreak');
        setTimeLeft(timerSettings.shortBreak);
        break;
      case 'shortBreak':
        setMode('focus');
        setTimeLeft(timerSettings.focus);
        break;
      case 'longBreak':
        setMode('focus');
        setTimeLeft(timerSettings.focus);
        break;
      default:
        break;
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerSettings[mode]);
  };

  const changeMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(timerSettings[newMode]);
  };
  
  const updateTimerSetting = (mode, minutes) => {
    const newSettings = {
      ...timerSettings,
      [mode]: minutes * 60
    };
    setTimerSettings(newSettings);
    
 
    if (mode === 'mode') {
      setTimeLeft(minutes * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatTotalTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className={`p-6 ${
        mode === 'focus' 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
          : mode === 'shortBreak' 
            ? 'bg-gradient-to-r from-green-500 to-green-600'
            : 'bg-gradient-to-r from-purple-500 to-purple-600'
      } text-white`}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Focus Mode</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 bg-white bg-opacity-20 rounded-full"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 bg-white bg-opacity-20 rounded-full"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
        
        <div className="text-center my-8">
          <div className="text-5xl font-bold tracking-wider">{formatTime(timeLeft)}</div>
          <div className="mt-2 text-sm uppercase tracking-wider opacity-80">
            {mode === 'focus' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          {!isRunning ? (
            <button 
              onClick={startTimer} 
              className="p-3 bg-white text-blue-600 rounded-full hover:bg-opacity-90"
            >
              <Play className="h-6 w-6" />
            </button>
          ) : (
            <button 
              onClick={pauseTimer} 
              className="p-3 bg-white text-blue-600 rounded-full hover:bg-opacity-90"
            >
              <Pause className="h-6 w-6" />
            </button>
          )}
          
          <button 
            onClick={resetTimer} 
            className="p-3 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30"
          >
            <RotateCcw className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-center space-x-2 mb-4">
          <button
            onClick={() => changeMode('focus')}
            className={`px-4 py-1.5 text-sm rounded-full ${
              mode === 'focus' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Focus
          </button>
          <button
            onClick={() => changeMode('shortBreak')}
            className={`px-4 py-1.5 text-sm rounded-full ${
              mode === 'shortBreak' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Short Break
          </button>
          <button
            onClick={() => changeMode('longBreak')}
            className={`px-4 py-1.5 text-sm rounded-full ${
              mode === 'longBreak' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Long Break
          </button>
        </div>
        
        {showSettings && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Timer Settings (minutes)</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-500">Focus</label>
                <input 
                  type="number" 
                  min="1" 
                  max="60" 
                  value={timerSettings.focus / 60}
                  onChange={(e) => updateTimerSetting('focus', parseInt(e.target.value))}
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Short Break</label>
                <input 
                  type="number" 
                  min="1" 
                  max="15" 
                  value={timerSettings.shortBreak / 60}
                  onChange={(e) => updateTimerSetting('shortBreak', parseInt(e.target.value))}
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Long Break</label>
                <input 
                  type="number" 
                  min="1" 
                  max="30" 
                  value={timerSettings.longBreak / 60}
                  onChange={(e) => updateTimerSetting('longBreak', parseInt(e.target.value))}
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between py-2 px-1 border-t">
          <div>
            <div className="text-xs text-gray-500">Today's Focus Time</div>
            <div className="text-lg font-semibold">{formatTotalTime(todayFocused)}</div>
          </div>
          <button className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded">
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
