import React from 'react';
import { ExternalLink, FileText, Video, Globe, BookOpen, Github, Bookmark, Edit2, Trash2 } from 'lucide-react';

const ResourceCard = ({ resource, onEdit, onDelete }) => {
  const typeIcons = {
    PDF: FileText,
    Video: Video,
    Website: Globe,
    Documentation: BookOpen,
    GitHub: Github,
    Other: Bookmark
  };

  const Icon = typeIcons[resource.type] || Bookmark;

  const typeColors = {
    PDF: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
    Video: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400',
    Website: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
    Documentation: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400',
    GitHub: 'bg-slate-800 text-white dark:bg-slate-700',
    Other: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
  };

  return (
    <div className="card-soft p-5 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeColors[resource.type] || typeColors.Website}`}>
            <Icon className="w-3 h-3" />
            <span>{resource.type}</span>
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(resource)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Resource"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(resource._id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Delete Resource"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-snug">
          {resource.title}
        </h3>

        {resource.subject && (
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
            Subject: {resource.subject}
          </p>
        )}

        {resource.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">
            {resource.description}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center space-x-2 py-2 px-4 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 font-medium text-xs transition-all"
        >
          <span>Open Link</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default ResourceCard;
