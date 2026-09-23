import React from 'react';
import { BookOpen, User, Edit2, Trash2 } from 'lucide-react';

const SubjectCard = ({ subject, onEdit, onDelete }) => {
  return (
    <div className="card-soft p-5 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-600 text-white tracking-wider uppercase shadow-sm">
            {subject.code}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(subject)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Subject"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(subject._id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Delete Subject"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-snug">
          {subject.name}
        </h3>

        {subject.teacher && (
          <div className="flex items-center space-x-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-2">
            <User className="w-3.5 h-3.5" />
            <span>{subject.teacher}</span>
          </div>
        )}

        {subject.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">
            {subject.description}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center space-x-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Active Course Module</span>
        </span>
      </div>
    </div>
  );
};

export default SubjectCard;
