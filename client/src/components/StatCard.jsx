import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorTheme = 'indigo', onClick }) => {
  const themes = {
    blue: {
      bg: 'bg-blue-100/70 dark:bg-blue-950/50',
      text: 'text-blue-600 dark:text-blue-400',
      val: 'text-slate-800 dark:text-slate-100'
    },
    green: {
      bg: 'bg-emerald-100/70 dark:bg-emerald-950/50',
      text: 'text-emerald-600 dark:text-emerald-400',
      val: 'text-slate-800 dark:text-slate-100'
    },
    purple: {
      bg: 'bg-purple-100/70 dark:bg-purple-950/50',
      text: 'text-purple-600 dark:text-purple-400',
      val: 'text-slate-800 dark:text-slate-100'
    },
    red: {
      bg: 'bg-rose-100/70 dark:bg-rose-950/50',
      text: 'text-rose-600 dark:text-rose-400',
      val: 'text-rose-600 dark:text-rose-400'
    }
  };

  const theme = themes[colorTheme] || themes.blue;

  return (
    <div
      onClick={onClick}
      className={`card-soft p-5 flex items-center justify-between space-x-4 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-indigo-500/50 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]' : ''
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-14 h-14 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center shrink-0`}>
          <Icon className="w-7 h-7" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {title}
          </p>
          <h3 className={`text-2xl font-extrabold ${theme.val} mt-0.5`}>
            {value !== undefined ? value : 0}
          </h3>
        </div>
      </div>
      {onClick && (
        <span className="text-[10px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
          View →
        </span>
      )}
    </div>
  );
};

export default StatCard;
