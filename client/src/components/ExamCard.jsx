import React from 'react';
import { Calendar, Clock, MapPin, Edit2, Trash2, GraduationCap } from 'lucide-react';

const ExamCard = ({ exam, onEdit, onDelete }) => {
  const examDate = new Date(exam.date);
  const now = new Date();
  const isPast = examDate < now;

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`card-soft p-5 flex flex-col justify-between space-y-4 ${isPast ? 'opacity-70 bg-slate-50/50 dark:bg-slate-900/50' : ''}`}>
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
            {exam.subject}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(exam)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Exam"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(exam._id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Delete Exam"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-snug">
          {exam.examName}
        </h3>

        {exam.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
            {exam.description}
          </p>
        )}

        {/* Exam Schedule Badges */}
        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium">
            <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>{formatDate(examDate)}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>{exam.time || '10:00 AM'}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Room / Venue: {exam.room || 'TBD'}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${isPast ? 'bg-slate-100 text-slate-500 dark:bg-slate-800' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400'}`}>
          {isPast ? 'Completed' : 'Upcoming'}
        </span>
        <GraduationCap className="w-4 h-4 text-slate-300 dark:text-slate-700" />
      </div>
    </div>
  );
};

export default ExamCard;
