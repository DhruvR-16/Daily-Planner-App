import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { 
  Calendar,
  CheckSquare,
  Clock,
  BarChart2,
  FileText,
  Layout,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Sidebar = ({ username, onDateChange, collapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate('/tasks');
  };
  

  const getUserInitial = () => {
    if (!username) return "?";
    return username.charAt(0).toUpperCase();
  };
  
  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-[#1a2238] text-slate-200 flex flex-col h-full shadow-xl transition-all duration-300`}>
      <div className="relative">
        <Link to="/tasks" onClick={handleLogoClick} className={`py-6 px-4 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center cursor-pointer hover:bg-slate-700/50 transition-colors duration-200 border-b border-slate-700/50`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
            {collapsed ? (
              <span className="font-bold text-xl text-white">PX</span>
            ) : (
              <span className="font-bold text-xl text-white">PlanX</span>
            )}
          </div>
          {!collapsed && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSidebar();
              }}
              className="p-1 rounded-full hover:bg-slate-600/50"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </Link>
        
        {collapsed && (
          <button 
            onClick={toggleSidebar}
            className="absolute -right-3 top-8 bg-[#1a2238] p-1 rounded-full border border-slate-700 text-white"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <ul className="space-y-1.5">
          <li>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center py-2.5 ${collapsed ? 'justify-center' : 'px-4'} rounded-md transition-all duration-200 ease-in-out group ${
                  isActive ? "bg-[#2190ff] text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                }`
              }
            >
              <CheckSquare className={`h-5 w-5 ${collapsed ? '' : 'mr-3.5'}`} />
              {!collapsed && "Tasks"}
            </NavLink>
          </li>
          

          <li>
            <NavLink
              to="/focus"
              className={({ isActive }) =>
                `flex items-center py-2.5 ${collapsed ? 'justify-center' : 'px-4'} rounded-md transition-all duration-200 ease-in-out group ${
                  isActive ? "bg-[#2190ff] text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                }`
              }
            >
              <Clock className={`h-5 w-5 ${collapsed ? '' : 'mr-3.5'}`} />
              {!collapsed && "Focus Mode"}
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `flex items-center py-2.5 ${collapsed ? 'justify-center' : 'px-4'} rounded-md transition-all duration-200 ease-in-out group ${
                  isActive ? "bg-[#2190ff] text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                }`
              }
            >
              <Calendar className={`h-5 w-5 ${collapsed ? '' : 'mr-3.5'}`} />
              {!collapsed && "Calendar"}
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/notes"
              className={({ isActive }) =>
                `flex items-center py-2.5 ${collapsed ? 'justify-center' : 'px-4'} rounded-md transition-all duration-200 ease-in-out group ${
                  isActive ? "bg-[#2190ff] text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                }`
              }
            >
              <FileText className={`h-5 w-5 ${collapsed ? '' : 'mr-3.5'}`} />
              {!collapsed && "Notes"}
            </NavLink>
          </li>
          
          {collapsed ? (
            <li className="pt-3 border-t border-slate-700/50">
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `flex items-center py-2.5 justify-center rounded-md transition-all duration-200 ease-in-out group ${
                    isActive ? "bg-[#2190ff] text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                  }`
                }
              >
                <BarChart2 className="h-5 w-5" />
              </NavLink>
            </li>
          ) : (
            <>
              <li className="pt-3 border-t border-slate-700/50">
                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    `flex items-center py-2.5 px-4 rounded-md transition-all duration-200 ease-in-out group ${
                      isActive ? "bg-[#2190ff] text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                    }`
                  }
                >
                  <BarChart2 className="h-5 w-5 mr-3.5" />
                  Analytics
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/summary"
                  className={({ isActive }) =>
                    `flex items-center py-2.5 px-4 rounded-md transition-all duration-200 ease-in-out group ${
                      isActive ? "bg-[#2190ff] text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                    }`
                  }
                >
                  <Layout className="h-5 w-5 mr-3.5" />
                  Summary
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      
      <div className={`p-4 border-t border-slate-700/50 mt-auto ${collapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex ${collapsed ? 'justify-center' : ''} items-center`}>
          <div className="h-8 w-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-slate-600">
            {getUserInitial()}
          </div>
          {!collapsed && (
            <div className="ml-3 text-sm font-medium text-slate-100 truncate max-w-[140px]">
              {username || "User"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;