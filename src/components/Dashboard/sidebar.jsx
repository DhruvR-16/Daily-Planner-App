import React from "react";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  CheckSquare,
  Clock,
  BarChart2,
  FileText,
  Layout
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-sky-100 text-gray-800 shadow-md">
      <div className="py-6 px-6 border-b border-gray-300">
        <h1 className="text-2xl font-bold">PlanX</h1>
      </div>

      <nav className="p-4 space-y-2">
        <NavItem to="/tasks" icon={<CheckSquare className="w-5 h-5" />} label="Tasks" />
        <NavItem to="/focus" icon={<Clock className="w-5 h-5" />} label="Focus Mode" />
        <NavItem to="/calendar" icon={<Calendar className="w-5 h-5" />} label="Calendar" />
        <NavItem to="/notes" icon={<FileText className="w-5 h-5" />} label="Notes" />

        <div className="border-t border-gray-300 pt-4">
          <NavItem to="/analytics" icon={<BarChart2 className="w-5 h-5" />} label="Analytics" />
          <NavItem to="/summary" icon={<Layout className="w-5 h-5" />} label="Summary" />
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
        isActive
          ? "bg-sky-300 text-gray-900 shadow-sm"
          : "hover:bg-sky-200 text-gray-700"
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    {label}
  </NavLink>
);

export default Sidebar;
