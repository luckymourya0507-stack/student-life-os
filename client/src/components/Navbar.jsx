import React from 'react';
import { Menu, Search, Bell, Sun, Moon, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user, globalSearch, setGlobalSearch, darkMode, toggleDarkMode } = useAuth();

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center space-x-4 flex-1 max-w-xl">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search notes, tasks, subjects, resources..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-full text-sm border-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right User & Actions Controls */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>

        {/* Notification Bell */}
        <button className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900" />
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* User Info & Avatar */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 overflow-hidden flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shadow-sm">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-base">{user?.name ? user.name.charAt(0).toUpperCase() : 'S'}</span>
            )}
          </div>
          <div className="hidden md:block text-left">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
              {user?.name || 'Student'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.course || 'BSCS Student'} {user?.year ? `• ${user.year}` : ''}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
