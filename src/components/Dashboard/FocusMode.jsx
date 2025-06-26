import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react';
import { db, auth } from '../../firebase-config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const FocusMode = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [settings, setSettings] = useState({
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  const timerRef = useRef(null);
  const audioRef = useRef(new Audio('/timer-sound.mp3'));

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleTimerComplete = async () => {
    if (soundEnabled) {
      audioRef.current.play().catch(console.error);
    }
    clearInterval(timerRef.current);
    setIsRunning(false);

    if (mode === 'focus' && auth.currentUser) {
      try {
        await addDoc(collection(db, `users/${auth.currentUser.uid}/focusSessions`), {
          duration: settings.focus,
          date: Timestamp.now()
        });
      } catch (error) {
        console.error("Error saving focus session:", error);
      }
    }

    if (mode === 'focus') setMode('shortBreak');
    else if (mode === 'shortBreak') setMode('focus');
    else setMode('focus');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(settings[mode]);
  };
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setTimeLeft(settings[newMode]);
    setIsRunning(false);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Focus Timer</h2>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => handleModeChange('focus')}
            className={`flex-1 py-2 rounded ${mode === 'focus' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Focus
          </button>
          <button 
            onClick={() => handleModeChange('shortBreak')}
            className={`flex-1 py-2 rounded ${mode === 'shortBreak' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Short Break
          </button>
          <button 
            onClick={() => handleModeChange('longBreak')}
            className={`flex-1 py-2 rounded ${mode === 'longBreak' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Long Break
          </button>
        </div>

        <div className="text-center mb-8">
          <span className="text-6xl font-bold text-gray-800">
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <RotateCcw size={24} />
          </button>
          
          <button
            onClick={isRunning ? handlePause : handleStart}
            className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Settings size={24} />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mt-4 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Timer Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Focus Duration (minutes)</label>
              <input
                type="number"
                value={settings.focus / 60}
                onChange={(e) => setSettings({...settings, focus: e.target.value * 60})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Short Break (minutes)</label>
              <input
                type="number"
                value={settings.shortBreak / 60}
                onChange={(e) => setSettings({...settings, shortBreak: e.target.value * 60})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="1"
                max="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Long Break (minutes)</label>
              <input
                type="number"
                value={settings.longBreak / 60}
                onChange={(e) => setSettings({...settings, longBreak: e.target.value * 60})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="1"
                max="60"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusMode;