import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Calendar, Clock, BarChart } from 'lucide-react';

export function PomodoroTimer() {
  // Timer states
  const [mode, setMode] = useState('pomodoro'); // pomodoro, shortBreak, or longBreak
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  

  const [settings, setSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    rounds: 4
  });
  

  const [stats, setStats] = useState({
    totalFocusTime: 0, 
    completedPomodoros: 0,
    completedCycles: 0, 
    todayFocusTime: 0, 
    todayPomodoros: 0
  });
  
  
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
  const [round, setRound] = useState(1);
  const [initialTime, setInitialTime] = useState(settings.pomodoro * 60);
  
  
  const themeColors = {
    pomodoro: {
      primary: 'bg-rose-600',
      hover: 'hover:bg-rose-700',
      light: 'bg-rose-100',
      text: 'text-rose-600',
      lightText: 'text-rose-500',
      stroke: '#e11d48' // rose-600
    },
    shortBreak: {
      primary: 'bg-teal-500',
      hover: 'hover:bg-teal-600',
      light: 'bg-teal-100',
      text: 'text-teal-500',
      lightText: 'text-teal-400',
      stroke: '#14b8a6' // teal-500
    },
    longBreak: {
      primary: 'bg-indigo-500',
      hover: 'hover:bg-indigo-600',
      light: 'bg-indigo-100',
      text: 'text-indigo-500',
      lightText: 'text-indigo-400',
      stroke: '#6366f1' // indigo-500
    }
  };
  
  
  const currentTheme = themeColors[mode];
  
  
  useEffect(() => {
    let duration;
    switch (mode) {
      case 'shortBreak':
        duration = settings.shortBreak;
        break;
      case 'longBreak':
        duration = settings.longBreak;
        break;
      default:
        duration = settings.pomodoro;
    }
    setTimeLeft(duration * 60);
    setInitialTime(duration * 60);
    setIsActive(false);
  }, [mode, settings]);
  
  
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        
        
        if (mode === 'pomodoro') {
          setStats(prev => ({
            ...prev,
            todayFocusTime: prev.todayFocusTime + 1,
            totalFocusTime: prev.totalFocusTime + 1
          }));
        }
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      clearInterval(interval);
      handleTimerComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);
  
  // Reset daily stats at midnight
  useEffect(() => {
    const checkDate = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setStats(prev => ({
          ...prev,
          todayFocusTime: 0,
          todayPomodoros: 0
        }));
      }
    };
    
    const interval = setInterval(checkDate, 60000); 
    return () => clearInterval(interval);
  }, []);
  

  const handleTimerComplete = () => {

    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
    
    if (mode === 'pomodoro') {
      // Update stats for completed pomodoro
      setStats(prev => ({
        ...prev,
        completedPomodoros: prev.completedPomodoros + 1,
        todayPomodoros: prev.todayPomodoros + 1
      }));
      
      // After pomodoro session
      if (round < settings.rounds) {
        // Take short break
        setMode('shortBreak');
      } else {
        
        setMode('longBreak');
        
        
        setStats(prev => ({
          ...prev,
          completedCycles: prev.completedCycles + 1
        }));
        
        setRound(1); 
        return;
      }
      
      setRound(round + 1);
    } else {
      
      setMode('pomodoro');
    }
  };
  

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  

  const formatHoursMinutes = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes}m`;
    }
    
    return `${hours}h ${minutes}m`;
  };
  

  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };
  

  const handleSettingChange = (setting, value) => {
    setSettings({
      ...settings,
      [setting]: parseInt(value, 10)
    });
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        
        {/*header*/}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Pomodoro Timer</h1>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowStats(!showStats)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <BarChart size={20} />
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
        
        {/* stats*/}
        {showStats && (
          <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
              <BarChart size={18} className="mr-2" /> 
              Your Focus Stats
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Today</div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-gray-400" />
                  <span className="font-medium">{formatHoursMinutes(stats.todayFocusTime)}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {stats.todayPomodoros} pomodoros
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Total Focus Time</div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-gray-400" />
                  <span className="font-medium">{formatHoursMinutes(stats.totalFocusTime)}</span>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Completed</div>
                <div className="font-medium">{stats.completedPomodoros} pomodoros</div>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Full Cycles</div>
                <div className="font-medium">{stats.completedCycles} cycles</div>
              </div>
            </div>
          </div>
        )}
        
        {/* settings*/}
        {showSettings && (
          <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
              <Settings size={18} className="mr-2" />
              Timer Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-gray-600">Focus Time (mins)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.pomodoro}
                  onChange={(e) => handleSettingChange('pomodoro', e.target.value)}
                  className="w-16 p-2 border rounded text-center"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-gray-600">Short Break (mins)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreak}
                  onChange={(e) => handleSettingChange('shortBreak', e.target.value)}
                  className="w-16 p-2 border rounded text-center"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-gray-600">Long Break (mins)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreak}
                  onChange={(e) => handleSettingChange('longBreak', e.target.value)}
                  className="w-16 p-2 border rounded text-center"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-gray-600">Rounds before Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.rounds}
                  onChange={(e) => handleSettingChange('rounds', e.target.value)}
                  className="w-16 p-2 border rounded text-center"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Mode select */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          {[
            { id: 'pomodoro', label: 'Focus' },
            { id: 'shortBreak', label: 'Short Break' },
            { id: 'longBreak', label: 'Long Break' }
          ].map((timerMode) => (
            <button
              key={timerMode.id}
              onClick={() => setMode(timerMode.id)}
              className={`
                py-2 px-4 rounded-lg font-medium transition-all
                ${mode === timerMode.id 
                  ? themeColors[timerMode.id].primary + ' text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {timerMode.label}
            </button>
          ))}
        </div>
        
        {/* Timer Display */}
        <div className="flex flex-col items-center">
          <div className="relative w-56 h-56 mb-8">
            {/* Timer Circle */}
            <div className={`absolute inset-0 rounded-full ${currentTheme.light}`}></div>
            
            {/* Progress Circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={currentTheme.stroke}
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={283 * (1 - timeLeft / initialTime)}
                strokeLinecap="round"
              />
            </svg>
            
            {/* display time */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-gray-800">{formatTime(timeLeft)}</span>
              <span className={`text-sm mt-2 ${currentTheme.text}`}>
                {mode === 'pomodoro' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </span>
            </div>
          </div>
          
          {/* Timer Controls */}
          <div className="flex space-x-6">
            <button
              onClick={toggleTimer}
              className={`w-12 h-12 flex items-center justify-center rounded-full ${currentTheme.primary} text-white ${currentTheme.hover} transition-colors shadow-md`}
            >
              {isActive ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={resetTimer}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
            >
              <RotateCcw size={20} />
            </button>
          </div>
          
          {/* Round Counter */}
          <div className="mt-6 flex items-center text-gray-500">
            <Calendar size={16} className="mr-2" />
            Round {round} of {settings.rounds}
          </div>
          
          {/* Mini Stats */}
          <div className="mt-4 grid grid-cols-2 gap-6 text-sm text-gray-500">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-400">Today</div>
              <div className={`font-medium ${currentTheme.text}`}>{formatHoursMinutes(stats.todayFocusTime)}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-400">Completed</div>
              <div className={`font-medium ${currentTheme.text}`}>{stats.completedPomodoros}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PomodoroTimer