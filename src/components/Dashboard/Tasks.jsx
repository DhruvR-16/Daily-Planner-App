import React, { useState, useEffect } from "react";
import { format, parseISO, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";


// #2d3436
// #3a4245

function Tasks() {
  const [tasksByDate, setTasksByDate] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  

  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState("General");
  const [formPriority, setFormPriority] = useState("Medium");
  const [formStartTime, setFormStartTime] = useState("09:00");
  const [formEndTime, setFormEndTime] = useState("10:00");
  const [formDescription, setFormDescription] = useState("");
  

  const [filterType, setFilterType] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    try {
      const stored = localStorage.getItem("tasksByDate");
      if (stored) {
        const parsedData = JSON.parse(stored);
        setTasksByDate(parsedData);
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
    }
  }, []);


  useEffect(() => {
    if (Object.keys(tasksByDate).length > 0) {
      localStorage.setItem("tasksByDate", JSON.stringify(tasksByDate));
    }
  }, [tasksByDate]);

  const tasks = tasksByDate[selectedDate] || [];


  const filteredTasks = tasks
    .filter(task => 
      (filterType === "All" || task.type === filterType) &&
      (filterPriority === "All" || task.priority === filterPriority) &&
      (searchTerm === "" || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.startTime.localeCompare(b.startTime);
      } else {
        return b.startTime.localeCompare(a.startTime);
      }
    });


  const handleAdd = (e) => {
    e.preventDefault();
    

    if (formEndTime <= formStartTime) {
      alert("End time must be after start time");
      return;
    }
    
    const newTask = {
      id: Date.now(),
      title: formTitle,
      type: formType,
      priority: formPriority,
      startTime: formStartTime,
      endTime: formEndTime,
      description: formDescription,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTasksByDate({
      ...tasksByDate,
      [selectedDate]: [...(tasksByDate[selectedDate] || []), newTask],
    });
    

    setFormTitle("");
    setFormType("General");
    setFormPriority("Medium");
    setFormStartTime("09:00");
    setFormEndTime("10:00");
    setFormDescription("");
    setShowForm(false);
  };


  const handleDelete = (id) => {
    setTasksByDate({
      ...tasksByDate,
      [selectedDate]: tasks.filter(task => task.id !== id),
    });
  };


  const toggleComplete = (id) => {
    setTasksByDate({
      ...tasksByDate,
      [selectedDate]: tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    });
  };

  const handlePreviousDay = () => {
    const currentDate = parseISO(selectedDate);
    setSelectedDate(format(subDays(currentDate, 1), 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    const currentDate = parseISO(selectedDate);
    setSelectedDate(format(addDays(currentDate, 1), 'yyyy-MM-dd'));
  };


  const formatDisplayDate = (dateString) => {
    return format(parseISO(dateString), "EEEE, MMMM d, yyyy");
  };


  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };


  const getTypeColor = (type) => {
    switch (type) {
      case "Work": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Personal": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Other": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-indigo-100 text-indigo-800 border-indigo-200";
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Task Manager</h1>
          <div className="flex items-center">
            <button
              onClick={handlePreviousDay}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B9CFC]"
              aria-label="Previous day"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B9CFC] mx-1"
            />
            <button
              onClick={handleNextDay}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B9CFC]"
              aria-label="Next day"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
            <p className="ml-3 text-gray-600 text-sm hidden sm:block">
              {formatDisplayDate(selectedDate)}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-[#1B9CFC] to-[#4D9EFF] hover:opacity-90 text-white px-4 py-2 rounded-md transition-colors flex items-center text-sm shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Task
        </button>
      </div>


      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Add New Task</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0fbcf9]"
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0fbcf9]"
                  >
                    <option>General</option>
                    <option>Work</option>
                    <option>Personal</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0fbcf9]"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0fbcf9]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0fbcf9]"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0fbcf9]"
                  placeholder="Enter task description"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#1B9CFC] to-[#4D9EFF] text-white rounded-md hover:opacity-90 transition-colors shadow"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0fbcf9]"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0fbcf9]"
            >
              <option value="All">All Priorities</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0fbcf9]"
            >
              <option value="asc">Start Time ↑</option>
              <option value="desc">Start Time ↓</option>
            </select>
          </div>
        </div>
      </div>


      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1b9afc32] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#1B9CFC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks for this day</h3>
          <p className="text-gray-500 mb-4">Start by adding your first task</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-[#1B9CFC] text-white rounded-md hover:bg-[#3da3f2f8] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add task
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow-sm overflow-hidden border-l-4 ${
                task.completed 
                  ? "border-green-500 bg-green-50" 
                  : "border-indigo-500"
              }`}
            >
              <div className="p-4 flex flex-col sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                        className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className={`text-lg font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(task.type)} border`}>
                          {task.type}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)} border`}>
                          {task.priority}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          {task.startTime} - {task.endTime}
                        </span>
                      </div>
                      {task.description && (
                        <p className={`text-sm ${task.completed ? "text-gray-400" : "text-gray-500"}`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="sm:ml-4 flex items-center justify-end mt-3 sm:mt-0">
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;