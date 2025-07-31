import React, { useState } from 'react';
import { Check, Trash2, Edit, Clock, AlertTriangle } from 'lucide-react';
import { Reminder } from '../types/reminder';
import { formatDateTime, isOverdue, isToday } from '../utils/dateUtils';

interface ReminderItemProps {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
}

export const ReminderItem: React.FC<ReminderItemProps> = ({
  reminder,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      setIsDeleting(true);
      try {
        await onDelete(reminder.id);
      } catch (error) {
        console.error('Failed to delete reminder:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getStatusIcon = () => {
    if (reminder.completed) {
      return <Check size={16} className="text-green-600" />;
    }
    if (isOverdue(reminder.due_date)) {
      return <AlertTriangle size={16} className="text-red-500" />;
    }
    return <Clock size={16} className="text-blue-500" />;
  };

  const getStatusText = () => {
    if (reminder.completed) {
      return 'Completed';
    }
    if (isOverdue(reminder.due_date)) {
      return 'Overdue';
    }
    if (isToday(reminder.due_date)) {
      return 'Due today';
    }
    return 'Upcoming';
  };

  const getStatusColor = () => {
    if (reminder.completed) {
      return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    }
    if (isOverdue(reminder.due_date)) {
      return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    }
    return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
  };

  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all duration-200 ${
      reminder.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(reminder.id)}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            reminder.completed
              ? 'bg-green-600 border-green-600'
              : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
          }`}
        >
          {reminder.completed && <Check size={12} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-gray-900 dark:text-white ${
                reminder.completed ? 'line-through' : ''
              }`}>
                {reminder.title}
              </h3>
              {reminder.description && (
                <p className={`text-sm text-gray-600 dark:text-gray-400 mt-1 ${
                  reminder.completed ? 'line-through' : ''
                }`}>
                  {reminder.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                {getStatusIcon()}
                {getStatusText()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Clock size={14} />
              <span>{formatDateTime(reminder.due_date)}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(reminder)}
                className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Edit reminder"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                title="Delete reminder"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 