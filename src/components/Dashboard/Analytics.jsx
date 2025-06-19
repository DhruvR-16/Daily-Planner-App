import React, { useState, useEffect } from "react";
import { CheckSquare, Clock, PieChart } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Tooltip, 
  Legend
);

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [taskData, setTaskData] = useState({
    totalTasks: 0,
    completedTasks: 0,
    byPriority: { High: 0, Medium: 0, Low: 0 },
    byType: { Work: 0, Personal: 0, Other: 0 }
  });
  const [focusData, setFocusData] = useState({
    totalFocusTime: 0, 
    sessionsCount: 0
  });

  useEffect(() => {
    loadTaskData();
    loadFocusData();
  }, []);

  const loadTaskData = () => {
    try {
      const stored = localStorage.getItem("tasksByDate");
      if (!stored) return;
      
      const tasksByDate = JSON.parse(stored);
      let total = 0;
      let completed = 0;
      const byPriority = { High: 0, Medium: 0, Low: 0 };
      const byType = { Work: 0, Personal: 0, Other: 0 };

      Object.entries(tasksByDate).forEach(([date, tasks]) => {
        const tasksForDay = tasks || [];
        const completedForDay = tasksForDay.filter(task => task.completed).length;

        total += tasksForDay.length;
        completed += completedForDay;

        tasksForDay.forEach(task => {
          if (byPriority.hasOwnProperty(task.priority)) {
            byPriority[task.priority]++;
          }
          
          if (byType.hasOwnProperty(task.type)) {
            byType[task.type]++;
          } else {
            byType.Other++;
          }
        });
      });
      
      setTaskData({
        totalTasks: total,
        completedTasks: completed,
        byPriority,
        byType
      });
      
    } catch (error) {
      console.error("Error loading task data:", error);
    }
  };

  const loadFocusData = () => {
    try {
      const stored = localStorage.getItem("focusHistory");
      if (!stored) return;
      
      const focusHistory = JSON.parse(stored);
      const totalFocusTime = focusHistory.reduce((sum, session) => sum + session.duration, 0);
      
      setFocusData({
        totalFocusTime,
        sessionsCount: focusHistory.length
      });
      
    } catch (error) {
      console.error("Error loading focus data:", error);
    }
  };

  const getCompletionRate = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const formatMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const priorityChartData = {
    labels: Object.keys(taskData.byPriority),
    datasets: [{
      label: 'Tasks by Priority',
      data: Object.values(taskData.byPriority),
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',  
        'rgba(59, 130, 246, 0.7)',  
        'rgba(16, 185, 129, 0.7)'   
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)'
      ],
      borderWidth: 1,
    }]
  };
  
  const typeChartData = {
    labels: Object.keys(taskData.byType),
    datasets: [{
      label: 'Tasks by Type',
      data: Object.values(taskData.byType),
      backgroundColor: [
        'rgba(99, 102, 241, 0.7)',   
        'rgba(245, 158, 11, 0.7)',   
        'rgba(139, 92, 246, 0.7)',   
        'rgba(107, 114, 128, 0.7)'   
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        <div className="bg-gray-100 p-1 rounded-lg flex">
          <button 
            className={`px-4 py-1.5 text-sm rounded-md transition-all ${activeTab === 'overview' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-1.5 text-sm rounded-md transition-all ${activeTab === 'focus' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('focus')}
          >
            Focus Stats
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">Task Completion</h2>
                <div className="bg-blue-50 p-2 rounded-full">
                  <CheckSquare className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-800">{getCompletionRate(taskData.completedTasks, taskData.totalTasks)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Tasks</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {taskData.completedTasks}/{taskData.totalTasks}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{width: `${getCompletionRate(taskData.completedTasks, taskData.totalTasks)}%`}}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">Focus Time</h2>
                <div className="bg-purple-50 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-purple-500" />
                </div>
              </div>
              <div className="p-5">
                <div>
                  <p className="text-sm text-gray-500">Total Focus Time</p>
                  <p className="text-2xl font-bold text-gray-800">{formatMinutes(focusData.totalFocusTime)}</p>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Focus Sessions</p>
                  <p className="text-lg font-medium text-gray-700">{focusData.sessionsCount} sessions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">Task Distribution</h2>
                <div className="bg-green-50 p-2 rounded-full">
                  <PieChart className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="p-5 flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">By Priority</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      High: {taskData.byPriority.High}
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      Medium: {taskData.byPriority.Medium}
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Low: {taskData.byPriority.Low}
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-gray-500">By Type</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center">
                      <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
                      Work: {taskData.byType.Work}
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
                      Personal: {taskData.byType.Personal}
                    </li>
                    
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Tasks by Priority</h3>
              <div className="h-64">
                <Pie data={priorityChartData} options={{maintainAspectRatio: false}} />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Tasks by Type</h3>
              <div className="h-64">
                <Bar 
                  data={typeChartData} 
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'focus' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Focus Session Stats</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <p className="text-sm text-purple-600 mb-1">Total Focus Time</p>
                <p className="text-2xl font-bold text-gray-800">{formatMinutes(focusData.totalFocusTime)}</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-blue-600 mb-1">Average Per Session</p>
                <p className="text-2xl font-bold text-gray-800">
                  {focusData.sessionsCount ? formatMinutes(focusData.totalFocusTime / focusData.sessionsCount) : "0 min"}
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <p className="text-sm text-green-600 mb-1">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-800">{focusData.sessionsCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;