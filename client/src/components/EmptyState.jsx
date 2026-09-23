import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({ title = 'No items found', description = 'Get started by creating a new entry.', actionText, onAction }) => {
  return (
    <div className="card-soft p-12 text-center flex flex-col items-center justify-center my-6">
      <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
        <FolderOpen className="w-8 h-8" />
      </div>
      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
