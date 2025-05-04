// src/components/Dashboard/Tasks.jsx
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from 'lucide-react';

function TasksPage() {
  const [currentDate] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState({});
  const [showForm, setShowForm] = useState(false);


  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState("General");
  const [formPriority, setFormPriority] = useState("Medium");
  const [formTime, setFormTime] = useState("09:00");


  const [filterType, setFilterType] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");


  useEffect(() => {
    const stored = localStorage.getItem("tasksByDate");
    if (stored) setTasksByDate(JSON.parse(stored));
  }, []);


  useEffect(() => {
    localStorage.setItem("tasksByDate", JSON.stringify(tasksByDate));
  }, [tasksByDate]);

  const dateKey = format(currentDate, "yyyy-MM-dd");
  const tasks = tasksByDate[dateKey] || [];


  const filtered = tasks
    .filter(t => (filterType === "All" || t.type === filterType) &&
                 (filterPriority === "All" || t.priority === filterPriority))
    .sort((a,b) => sortOrder === "asc"
      ? a.time.localeCompare(b.time)
      : b.time.localeCompare(a.time)
    );


  const handleAdd = e => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      title: formTitle,
      type: formType,
      priority: formPriority,
      time: formTime,
    };
    setTasksByDate({
      ...tasksByDate,
      [dateKey]: [...tasks, newTask],
    });
    setFormTitle(""); setFormType("General");
    setFormPriority("Medium"); setFormTime("09:00");
    setShowForm(false);
  };


  const handleDelete = id => {
    setTasksByDate({
      ...tasksByDate,
      [dateKey]: tasks.filter(t => t.id !== id),
    });
  };

  return (
    <div className="container p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <CalendarIcon className="mr-2 text-red-600" size={24} />
          {format(currentDate, "EEEE, MMMM d, yyyy")}
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          + Add Task
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Title</label>
              <input
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Type</label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={formType}
                onChange={e => setFormType(e.target.value)}
              >
                <option>General</option>
                <option>Work</option>
                <option>Personal</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Priority</label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={formPriority}
                onChange={e => setFormPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Time</label>
              <input
                type="time"
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={formTime}
                onChange={e => setFormTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      <div className="flex space-x-3 mb-6">
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 bg-white"
        >
          <option value="All">All Types</option>
          <option>General</option>
          <option>Work</option>
          <option>Personal</option>
          <option>Other</option>
        </select>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 bg-white"
        >
          <option value="All">All Priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 bg-white"
        >
          <option value="asc">Sort by Time ↑</option>
          <option value="desc">Sort by Time ↓</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-600">
          No tasks for this day
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Add your first task
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {filtered.map(task => (
            <li
              key={task.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <div className="text-lg text-gray-800">{task.title}</div>
                <div className="text-sm text-gray-500">{task.time}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase px-2 py-1 border border-gray-300 rounded">
                  {task.type}
                </span>
                <span className="text-xs uppercase px-2 py-1 border border-gray-300 rounded">
                  {task.priority}
                </span>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TasksPage;