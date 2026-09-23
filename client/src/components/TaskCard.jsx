import React from 'react';
import { Calendar, Clock, Edit2, Trash2, CheckCircle2, Circle } from 'lucide-react';

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'Completed';

  const priorityColors = {
    High: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900',
    Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900'
  };

  const statusColors = {
    Completed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
    Pending: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400'
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`card-soft p-5 transition-all ${isCompleted ? 'opacity-75 bg-slate-50/50 dark:bg-slate-900/50' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3.5 flex-1 min-w-0">
          <button
            onClick={() => onToggleStatus(task)}
            className="mt-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
            title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-slate-800 dark:text-slate-100 text-base leading-snug ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
              {task.title}
            </h4>
            {task.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs">
              <span className={`px-2.5 py-0.5 rounded-full font-medium border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                {task.priority} Priority
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-medium ${statusColors[task.status] || statusColors.Pending}`}>
                {task.status}
              </span>
              <div className="flex items-center space-x-1 text-slate-400 dark:text-slate-500 ml-auto sm:ml-0">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
