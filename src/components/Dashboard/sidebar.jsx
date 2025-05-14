import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  BarChart2, 
  FileText, 
  Layout
} from "lucide-react";

const Sidebar = ({ username, onDateChange, logoPath }) => {
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate('/tasks'); // Assuming /tasks is the primary view now
    
  };
  
  return (
    <div className="w-64 bg-[#1e272e] text-slate-200 flex flex-col h-full shadow-xl"> {/* Softer background, more pronounced shadow */}

      <Link to="/tasks" onClick={handleLogoClick} className="py-6 px-4 flex justify-center items-center cursor-pointer hover:bg-slate-700/50 transition-colors duration-200 border-b border-slate-700"> {/* More padding, subtle border */}
        <img src={logoPath} alt="PlanX Logo" className="h-9 w-auto rounded-md" /> {/* Slightly smaller logo for a sleeker look */}
      </Link>
      
      <nav className="flex-1 p-4 space-y-1"> {/* Increased padding, consistent spacing for ul */}
        <ul className="space-y-1.5">

          <li>
          </li>
          <li>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center py-2.5 px-4 rounded-md transition-all duration-200 ease-in-out group ${ // Slightly more padding
                  isActive ? "bg-sky-600 text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                }`
              }
            >
              <Calendar className="h-5 w-5 mr-3.5" />
              Tasks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/notes"
              className={({ isActive }) =>
                `flex items-center py-2.5 px-4 rounded-md transition-all duration-200 ease-in-out group ${
                  isActive ? "bg-sky-600 text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                }`
              }
            >
              <FileText className="h-5 w-5 mr-3.5" /> 
              Notes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `flex items-center py-2.5 px-4 rounded-md transition-all duration-200 ease-in-out group ${
                  isActive ? "bg-sky-600 text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
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
                  isActive ? "bg-sky-600 text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                }`
              }
            >
              <Layout className="h-5 w-5 mr-3.5" /> {/* Changed icon for variety, assuming Summary is more about layout/overview */}
              Summary
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-700 mt-auto"> {/* Consistent padding, adjusted border color */}
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-slate-600"> {/* Slightly smaller, added ring */}
            {username ? username.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="ml-3 text-sm font-medium text-slate-100">{username}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;