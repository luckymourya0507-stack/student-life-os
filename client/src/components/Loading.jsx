import React from 'react';

const Loading = ({ type = 'cards', count = 4 }) => {
  if (type === 'full') {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading Student Life OS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-slate-200/70 dark:bg-slate-800/60 rounded-2xl h-44 p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-1/3 h-4 bg-slate-300 dark:bg-slate-700 rounded-md" />
            <div className="w-3/4 h-5 bg-slate-300 dark:bg-slate-700 rounded-md" />
            <div className="w-full h-3 bg-slate-300 dark:bg-slate-700 rounded-md" />
          </div>
          <div className="w-1/2 h-4 bg-slate-300 dark:bg-slate-700 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default Loading;
