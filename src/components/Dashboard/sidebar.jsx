import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ username }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || (location.pathname === "/" && path === "/tasks");
  };

  const navItems = [
    {
      path: "/tasks",
      name: "Tasks",
      icon:
        "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    },
    {
      path: "/notes",
      name: "Notes",
      icon:
        "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    },
    {
      path: "/analytics",
      name: "Analytics",
      icon:
        "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    {
      path: "/summary",
      name: "Summary",
      icon:
        "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
  ];

  return (
    <div className="w-64 h-screen bg-[#0B0B0B] text-[#E0E0E0] border-r border-[#1A1A1A] flex flex-col overflow-hidden shadow-lg">
      <div className="p-6 flex items-center border-b border-[#1A1A1A]">
        <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#1B9CFC] to-[#4D9EFF] flex items-center justify-center mr-4 shadow-inner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold tracking-wide text-white">PlanX</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-[#1B9CFC] to-[#4D9EFF] text-white shadow"
                    : "hover:bg-[#1A1A1A] text-[#CCCCCC]"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 mr-3 ${
                    isActive(item.path) ? "text-white" : "text-[#6B7280]"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* <div className="p-4 border-t border-[#1A1A1A] text-center">
        <p className="text-sm text-[#888]">Welcome back,</p>
        <p className="text-base font-semibold text-white">{username}</p>
      </div> */}
    </div>
  );
}

export default Sidebar;
