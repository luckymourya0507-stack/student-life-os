import React from 'react';
import { Tag, Edit2, Trash2, BookOpen } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="card-soft p-5 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
            <BookOpen className="w-3 h-3" />
            <span>{note.subject || 'General'}</span>
          </span>
          <span className="text-xs text-slate-400">{formatDate(note.updatedAt || note.createdAt)}</span>
        </div>

        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-snug">
          {note.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-4 whitespace-pre-line leading-relaxed">
          {note.content}
        </p>
      </div>

      <div>
        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 mb-3">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              >
                <Tag className="w-2.5 h-2.5" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs flex items-center space-x-1"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-xs flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
