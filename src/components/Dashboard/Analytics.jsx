
import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Analytics() {
  const [tasksStats, setTasksStats] = useState({
    total: 0,
    completed: 0,
    completionRate: 0,
    byPriority: { High: 0, Medium: 0, Low: 0 },
    byType: { General: 0, Work: 0, Personal: 0, Other: 0 }
  });


  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("tasksByDate");
      if (!storedTasks) return;
      
      const tasksByDate = JSON.parse(storedTasks);
      let totalTasks = 0;
      let completedTasks = 0;
      const byPriority = { High: 0, Medium: 0, Low: 0 };
      const byType = { General: 0, Work: 0, Personal: 0, Other: 0 };
      

      Object.values(tasksByDate).forEach(tasksArray => {
        tasksArray.forEach(task => {
          totalTasks++;
          if (task.completed) completedTasks++;
          

          if (byPriority[task.priority] !== undefined) {
            byPriority[task.priority]++;
          }
          

          if (byType[task.type] !== undefined) {
            byType[task.type]++;
          }
        });
      });
      
      setTasksStats({
        total: totalTasks,
        completed: completedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        byPriority,
        byType
      });
    } catch (error) {
      console.error("Error calculating task statistics:", error);
    }
  }, []);
  

  const priorityChartData = {
    labels: Object.keys(tasksStats.byPriority),
    datasets: [
      {
        label: 'Tasks by Priority',
        data: Object.values(tasksStats.byPriority),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  

  const typeChartData = {
    labels: Object.keys(tasksStats.byType),
    datasets: [
      {
        label: 'Number of Tasks',
        data: Object.values(tasksStats.byType),
        backgroundColor: 'rgba(53, 162, 235, 0.7)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tasks by Type',
      },
    },
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-[#1B9CFC] to-[#4D9EFF] text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold">{tasksStats.total}</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Completed Tasks</h3>
          <p className="text-3xl font-bold">{tasksStats.completed}</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold">{tasksStats.completionRate}%</p>
        </div>
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Tasks by Priority</h3>
          <div className="h-64">
            <Pie data={priorityChartData} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Tasks by Type</h3>
          <div className="h-64">
            <Bar options={barOptions} data={typeChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics; 