import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckSquare, Clock, Calendar, AlertCircle, CheckCircle, List, PlusCircle } from 'lucide-react';

const Summary = ({ date }) => {
  const [tasksForDate, setTasksForDate] = useState([]);
  const [focusStats, setFocusStats] = useState({ duration: 0, sessions: 0 });
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    byPriority: { High: 0, Medium: 0, Low: 0 },
    byType: { Work: 0, Personal: 0, Study: 0, Other: 0 }
  });

  const currentDate = date || format(new Date(), 'yyyy-MM-dd');
  const formattedDate = format(new Date(currentDate + 'T00:00:00'), 'EEEE, MMMM d, yyyy');

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = () => {

    try {
      const storedTasks = localStorage.getItem("tasksByDate");
      if (storedTasks) {
        const allTasks = JSON.parse(storedTasks);
        const tasks = allTasks[currentDate] || [];
        setTasksForDate(tasks);
        

        const completed = tasks.filter(task => task.completed).length;
        const byPriority = { High: 0, Medium: 0, Low: 0 };
        const byType = { Work: 0, Personal: 0, Study: 0, Other: 0 };
        
        tasks.forEach(task => {
          if (byPriority.hasOwnProperty(task.priority)) {
            byPriority[task.priority]++;
          }
          
          if (byType.hasOwnProperty(task.type)) {
            byType[task.type]++;
          } else {
            byType.Other++;
          }
        });
        
        setTaskStats({
          total: tasks.length,
          completed,
          byPriority,
          byType
        });
        

        const today = format(new Date(), 'yyyy-MM-dd');
        let upcoming = [];
        
        Object.entries(allTasks).forEach(([date, taskList]) => {
          if (date > today) {
            const tasksWithDate = taskList.map(task => ({
              ...task,
              date
            }));
            upcoming = [...upcoming, ...tasksWithDate];
          }
        });
        

        upcoming.sort((a, b) => a.date.localeCompare(b.date));
        setUpcomingTasks(upcoming.slice(0, 5));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
    

    try {
      const storedFocus = localStorage.getItem("focusHistory");
      if (storedFocus) {
        const focusHistory = JSON.parse(storedFocus);
        const sessionsForDate = focusHistory.filter(session => session.date === currentDate);
        const totalDuration = sessionsForDate.reduce((sum, session) => sum + session.duration, 0);
        
        setFocusStats({
          duration: totalDuration,
          sessions: sessionsForDate.length
        });
      }
    } catch (error) {
      console.error("Error loading focus data:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-indigo-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">{formattedDate}</h2>
          </div>
          {taskStats.total > 0 && (
            <div className="text-sm font-medium">
              <span className="text-green-600">{taskStats.completed}</span>
              <span className="text-gray-500">/{taskStats.total} tasks completed</span>
            </div>
          )}
        </div>
      </div>
      
      
    </div>
  );
};

export default Summary;