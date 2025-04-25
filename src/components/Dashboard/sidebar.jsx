import React from "react";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white flex flex-col justify-between p-4 shadow-lg">
      <div>
        <h1 className="text-2xl font-bold mb-8">PlanX</h1>

        <nav className="flex flex-col space-y-4">
          <a href="#"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            Tasks
          </a>
          <a href="#"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            Goals
          </a>
          <a href="#"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            Summary
          </a>
        </nav>
        <div>

        </div>
      </div>
    </div>
  );
}

export default Sidebar;
