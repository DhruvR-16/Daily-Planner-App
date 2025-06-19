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
  ChevronRight,
  X
} from "lucide-react";

const Sidebar = ({ username, collapsed, toggleSidebar, isMobile, mobilenav }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/tasks');
    if (isMobile) mobilenav();
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) mobilenav();
  };
  
  const user_icon = () => {
    if (!username) return "?";
    // Get first letter of first name if there's a space, otherwise just the first letter
    const firstLetter = username.includes(" ") ? 
      username.split(" ")[0].charAt(0) : 
      username.charAt(0);
    return firstLetter.toUpperCase();
  };
  
  // For display in the sidebar, show first name if there's a space
  const displayName = () => {
    if (!username) return "User";
    return username.includes(" ") ? username.split(" ")[0] : username;
  };
  
  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} ${isMobile ? 'w-72' : ''} bg-[#1a2238] text-slate-200 flex flex-col h-full shadow-xl transition-all duration-300`}>
      <div className="relative">
        <div className="py-6 px-4 flex justify-between items-center cursor-pointer hover:bg-slate-700/50 transition-colors duration-200 border-b border-slate-700/50">
          <div className="flex items-center" onClick={handleClick}>
            {collapsed && !isMobile ? (
              <span className="font-bold text-xl text-white">PX</span>
            ) : (
              <span className="font-bold text-xl text-white">PlanX</span>
            )}
          </div>
          
          {isMobile ? (
            <button 
              onClick={mobilenav}
              className="p-1.5 rounded-full hover:bg-slate-600/50 text-white"
            >
              <X size={20} />
            </button>
          ) : !collapsed && (
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
        </div>
        
        {!isMobile && collapsed && (
          <button 
            onClick={toggleSidebar}
            className="absolute -right-3 top-8 bg-[#1a2238] p-1 rounded-full border border-slate-700 text-white"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <ul className="space-y-1.5">
          <li>
            <NavLink
              to="/tasks"
              onClick={() => isMobile && mobilenav()}
              className={({ isActive }) =>
                `flex items-center py-2.5 ${collapsed && !isMobile ? 'justify-center' : 'px-4'} rounded-md transition-all duration-200 ease-in-out group ${
                  isActive ? "bg-[#2190ff] text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                }`
              }
            >
              <CheckSquare className={`h-5 w-5 ${collapsed && !isMobile ? '' : 'mr-3.5'}`} />
              {(!collapsed || isMobile) && "Tasks"}
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/focus"
              onClick={() => isMobile && mobilenav()}
              className={({ isActive }) =>
                `flex items-center py-2.5 ${collapsed && !isMobile ? 'justify-center' : 'px-4'} rounded-md transition-all duration-200 ease-in-out group ${
                  isActive ? "bg-[#2190ff] text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                }`
              }
            >
              <Clock className={`h-5 w-5 ${collapsed && !isMobile ? '' : 'mr-3.5'}`} />
              {(!collapsed || isMobile) && "Focus Mode"}
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/calendar"
              onClick={() => isMobile && mobilenav()}
              className={({ isActive }) =>
                `flex items-center py-2.5 ${collapsed && !isMobile ? 'justify-center' : 'px-4'} rounded-md transition-all duration-200 ease-in-out group ${
                  isActive ? "bg-[#2190ff] text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                }`
              }
            >
              <Calendar className={`h-5 w-5 ${collapsed && !isMobile ? '' : 'mr-3.5'}`} />
              {(!collapsed || isMobile) && "Calendar"}
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/notes"
              onClick={() => isMobile && mobilenav()}
              className={({ isActive }) =>
                `flex items-center py-2.5 ${collapsed && !isMobile ? 'justify-center' : 'px-4'} rounded-md transition-all duration-200 ease-in-out group ${
                  isActive ? "bg-[#2190ff] text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                }`
              }
            >
              <FileText className={`h-5 w-5 ${collapsed && !isMobile ? '' : 'mr-3.5'}`} />
              {(!collapsed || isMobile) && "Notes"}
            </NavLink>
          </li>
          
          {collapsed && !isMobile ? (
            <li className="pt-3 border-t border-slate-700/50">
              <NavLink
                to="/analytics"
                onClick={() => isMobile && mobilenav()}
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
                  onClick={() => isMobile && mobilenav()}
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
                  onClick={() => isMobile && mobilenav()}
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
      
      <div className={`p-4 border-t border-slate-700/50 mt-auto ${collapsed && !isMobile ? 'flex justify-center' : ''}`}>
        <div className={`flex ${collapsed && !isMobile ? 'justify-center' : ''} items-center`}>
          <div className="h-8 w-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-slate-600">
            {user_icon()}
          </div>
          {(!collapsed || isMobile) && (
            <div className="ml-3 text-sm font-medium text-slate-100 truncate max-w-[140px]">
              {displayName()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;