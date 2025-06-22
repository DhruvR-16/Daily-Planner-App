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
  Sparkles
} from "lucide-react";

const Sidebar = ({ username, onDateChange, logoPath, collapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate('/tasks');
  };
  
  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-200 flex flex-col h-full shadow-2xl transition-all duration-300 relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)`
        }}></div>
      </div>
      
      <div className="relative z-10">
        <Link to="/tasks" onClick={handleLogoClick} className={`py-6 px-4 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center cursor-pointer hover:bg-slate-700/50 transition-all duration-300 border-b border-slate-700/50 group relative overflow-hidden`}>
          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className={`flex items-center ${collapsed ? 'justify-center' : ''} relative z-10`}>
            <div className="relative">
              <img src={logoPath} alt="PlanX Logo" className="h-9 w-auto rounded-lg shadow-lg" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            </div>
            {!collapsed && (
              <div className="ml-3 flex items-center">
                <span className="font-bold text-xl text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">PlanX</span>
                <Sparkles size={16} className="ml-1 text-yellow-400 animate-pulse" />
              </div>
            )}
          </div>
          {!collapsed && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSidebar();
              }}
              className="p-2 rounded-full hover:bg-slate-600/50 transition-all duration-200 relative z-10"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </Link>
        
        {collapsed && (
          <button 
            onClick={toggleSidebar}
            className="absolute -right-3 top-8 bg-gradient-to-r from-slate-800 to-slate-700 p-1.5 rounded-full border border-slate-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-1 relative z-10">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center py-3 ${collapsed ? 'justify-center px-2' : 'px-4'} rounded-xl transition-all duration-300 ease-in-out group relative overflow-hidden ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg transform scale-105" 
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 hover:transform hover:scale-105"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${isActive ? 'opacity-100' : ''}`}></div>
                  <CheckSquare className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} relative z-10 ${isActive ? 'animate-pulse' : ''}`} />
                  {!collapsed && <span className="relative z-10">Tasks</span>}
                  {isActive && !collapsed && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                </>
              )}
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/focus"
              className={({ isActive }) =>
                `flex items-center py-3 ${collapsed ? 'justify-center px-2' : 'px-4'} rounded-xl transition-all duration-300 ease-in-out group relative overflow-hidden ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg transform scale-105" 
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 hover:transform hover:scale-105"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${isActive ? 'opacity-100' : ''}`}></div>
                  <Clock className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} relative z-10 ${isActive ? 'animate-pulse' : ''}`} />
                  {!collapsed && <span className="relative z-10">Focus Mode</span>}
                  {isActive && !collapsed && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                </>
              )}
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `flex items-center py-3 ${collapsed ? 'justify-center px-2' : 'px-4'} rounded-xl transition-all duration-300 ease-in-out group relative overflow-hidden ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg transform scale-105" 
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 hover:transform hover:scale-105"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${isActive ? 'opacity-100' : ''}`}></div>
                  <Calendar className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} relative z-10 ${isActive ? 'animate-pulse' : ''}`} />
                  {!collapsed && <span className="relative z-10">Calendar</span>}
                  {isActive && !collapsed && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                </>
              )}
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/notes"
              className={({ isActive }) =>
                `flex items-center py-3 ${collapsed ? 'justify-center px-2' : 'px-4'} rounded-xl transition-all duration-300 ease-in-out group relative overflow-hidden ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg transform scale-105" 
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 hover:transform hover:scale-105"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${isActive ? 'opacity-100' : ''}`}></div>
                  <FileText className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} relative z-10 ${isActive ? 'animate-pulse' : ''}`} />
                  {!collapsed && <span className="relative z-10">Notes</span>}
                  {isActive && !collapsed && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                </>
              )}
            </NavLink>
          </li>
          
          {collapsed ? (
            <li className="pt-4 border-t border-slate-700/50">
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `flex items-center py-3 justify-center px-2 rounded-xl transition-all duration-300 ease-in-out group relative overflow-hidden ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg transform scale-105" 
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 hover:transform hover:scale-105"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${isActive ? 'opacity-100' : ''}`}></div>
                    <BarChart2 className={`h-5 w-5 relative z-10 ${isActive ? 'animate-pulse' : ''}`} />
                  </>
                )}
              </NavLink>
            </li>
          ) : (
            <>
              <li className="pt-4 border-t border-slate-700/50">
                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-4 rounded-xl transition-all duration-300 ease-in-out group relative overflow-hidden ${
                      isActive 
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg transform scale-105" 
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 hover:transform hover:scale-105"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${isActive ? 'opacity-100' : ''}`}></div>
                      <BarChart2 className={`h-5 w-5 mr-3 relative z-10 ${isActive ? 'animate-pulse' : ''}`} />
                      <span className="relative z-10">Analytics</span>
                      {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/summary"
                  className={({ isActive }) =>
                    `flex items-center py-3 px-4 rounded-xl transition-all duration-300 ease-in-out group relative overflow-hidden ${
                      isActive 
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg transform scale-105" 
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 hover:transform hover:scale-105"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${isActive ? 'opacity-100' : ''}`}></div>
                      <Layout className={`h-5 w-5 mr-3 relative z-10 ${isActive ? 'animate-pulse' : ''}`} />
                      <span className="relative z-10">Summary</span>
                      {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                    </>
                  )}
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      
      <div className={`p-4 border-t border-slate-700/50 mt-auto ${collapsed ? 'flex justify-center' : ''} relative z-10`}>
        <div className={`flex ${collapsed ? 'justify-center' : ''} items-center group`}>
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-slate-600 shadow-lg">
              {username ? username.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800 animate-pulse"></div>
          </div>
          {!collapsed && (
            <div className="ml-3 text-sm font-medium text-slate-100 truncate max-w-[140px] group-hover:text-white transition-colors duration-200">
              {username}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;