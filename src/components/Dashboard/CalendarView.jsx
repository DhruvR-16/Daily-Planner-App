import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = ({ onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState({});

  useEffect(() => {

    try {
      const stored = localStorage.getItem("tasksByDate");
      if (stored) {
        setTasksByDate(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
    }
  }, []);

  const onDateClick = day => {
    setSelectedDate(day);
    const formattedDate = format(day, 'yyyy-MM-dd');
    if(onDateSelect) {
      onDateSelect(formattedDate);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'E';
    
    let startDate = startOfWeek(currentMonth);
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center py-2 text-sm font-medium text-gray-500" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, 'yyyy-MM-dd');
        const tasksForDay = tasksByDate[formattedDate] || [];
        const completedTasks = tasksForDay.filter(task => task.completed).length;
        
        days.push(
          <div
            className={`relative min-h-[100px] p-2 border border-gray-200 ${
              !isSameMonth(day, monthStart)
                ? "bg-gray-50 text-gray-400"
                : isSameDay(day, selectedDate)
                ? "bg-blue-50 border-blue-300"
                : isSameDay(day, new Date())
                ? "bg-yellow-50"
                : ""
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <div className="flex justify-between">
              <span className={`text-sm font-medium ${
                isSameDay(day, new Date()) ? "bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center" : ""
              }`}>
                {format(day, 'd')}
              </span>
              {tasksForDay.length > 0 && (
                <span className="bg-gray-200 text-xs px-1.5 py-0.5 rounded-full text-gray-800">
                  {completedTasks}/{tasksForDay.length}
                </span>
              )}
            </div>
            
            {tasksForDay.length > 0 && (
              <div className="mt-1 overflow-hidden">
                {tasksForDay.slice(0, 2).map(task => (
                  <div 
                    key={task.id}
                    className={`text-xs truncate mb-0.5 rounded px-1 py-0.5 ${
                      task.completed 
                        ? "bg-green-100 text-green-800 line-through" 
                        : task.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.title}
                  </div>
                ))}
                {tasksForDay.length > 2 && (
                  <div className="text-xs text-gray-500 mt-1">+{tasksForDay.length - 2} more</div>
                )}
              </div>
            )}
          </div>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      
      days = [];
    }
    
    return <div className="mb-2">{rows}</div>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Task Calendar</h2>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 rounded mr-1"></div>
          <span className="text-xs text-gray-600">High Priority</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-100 rounded mr-1"></div>
          <span className="text-xs text-gray-600">Normal Task</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 rounded mr-1"></div>
          <span className="text-xs text-gray-600">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-50 rounded mr-1 border border-gray-200"></div>
          <span className="text-xs text-gray-600">Today</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
