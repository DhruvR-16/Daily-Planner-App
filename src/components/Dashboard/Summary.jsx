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

  const getCompletionRate = () => {
    if (taskStats.total === 0) return 0;
    return Math.round((taskStats.completed / taskStats.total) * 100);
  };

  const formatMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString + 'T00:00:00'), 'MMM d');
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

        {taskStats.total > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
                <div className="flex items-center mb-2">
                  <CheckSquare className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Task Progress</h3>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">{getCompletionRate()}%</p>
                    <p className="text-xs text-indigo-100">Completion rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{taskStats.completed}/{taskStats.total}</p>
                    <p className="text-xs text-indigo-100">Tasks completed</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-white bg-opacity-30 rounded-full h-1.5">
                  <div 
                    className="bg-white h-1.5 rounded-full" 
                    style={{width: `${getCompletionRate()}%`}}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Focus Time</h3>
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatMinutes(focusStats.duration)}</p>
                  <p className="text-xs text-purple-100">Across {focusStats.sessions} sessions</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Priority Tasks</h3>
                </div>
                <div>
                  <p className="text-2xl font-bold">{taskStats.byPriority.High}</p>
                  <p className="text-xs text-green-100">High priority tasks today</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-800">Tasks for Today</h3>
              <div className="space-y-2">
                {tasksForDate.length > 0 ? (
                  tasksForDate.map(task => (
                    <div 
                      key={task.id}
                      className={`p-3 border rounded-md flex items-center justify-between ${
                        task.completed 
                          ? 'bg-green-50 border-green-100' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        ) : (
                          <div className={`h-3 w-3 rounded-full mr-3 ${
                            task.priority === 'High' 
                              ? 'bg-red-500' 
                              : task.priority === 'Medium'
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                          }`} />
                        )}
                        <div>
                          <p className={`font-medium ${task.completed ? 'text-gray-500' : 'text-gray-800'}`}>
                            {task.title}
                          </p>
                          <div className="flex text-xs text-gray-500 mt-1">
                            <span className="mr-2">{task.startTime} - {task.endTime}</span>
                            <span className="px-1.5 bg-gray-100 rounded">{task.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded ${
                        task.priority === 'High' 
                          ? 'bg-red-100 text-red-800' 
                          : task.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.priority}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No tasks for today</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <List className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Tasks for Today</h3>
            <p className="text-gray-500 mb-4">Plan your day by adding some tasks.</p>
            <button className="flex items-center mx-auto px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
              <PlusCircle className="h-4 w-4 mr-2" /> 
              Add Task
            </button>
          </div>
        )}
      </div>
      
      
    </div>
  );
};

export default Summary;