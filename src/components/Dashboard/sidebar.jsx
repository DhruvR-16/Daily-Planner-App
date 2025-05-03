import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white flex flex-col justify-between p-4 shadow-lg">
      <div>
        <h1 className="text-2xl font-bold mb-8">PlanX</h1>
        <nav className="flex flex-col space-y-4">
          <Link 
            to="/tasks"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            Tasks
          </Link>
          <Link 
            to="/goals"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            Goals
          </Link>
          <Link 
            to="/summary"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            Summary
          </Link>
          <Link 
            to="/pomodoro"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            Pomodoro Timer
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;