import React, { useState } from 'react';
import { ReminderItem } from './ReminderItem';
import { Reminder } from '../types/reminder';
import { useReminders } from '../hooks/useReminders';
import { Filter, List, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

type FilterType = 'all' | 'active' | 'completed' | 'overdue' | 'today' | 'upcoming';

export const ReminderList: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  
  const {
    reminders,
    loading,
    toggleComplete,
    deleteReminder,
    getActiveReminders,
    getCompletedReminders,
    getOverdueReminders,
    getTodayReminders,
    getUpcomingReminders,
  } = useReminders();

  const getFilteredReminders = () => {
    switch (filter) {
      case 'active':
        return getActiveReminders();
      case 'completed':
        return getCompletedReminders();
      case 'overdue':
        return getOverdueReminders();
      case 'today':
        return getTodayReminders();
      case 'upcoming':
        return getUpcomingReminders();
      default:
        return reminders;
    }
  };

  const filteredReminders = getFilteredReminders();

  const getFilterIcon = (filterType: FilterType) => {
    switch (filterType) {
      case 'all':
        return <List size={16} />;
      case 'active':
        return <Clock size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'overdue':
        return <AlertTriangle size={16} />;
      case 'today':
        return <Clock size={16} />;
      case 'upcoming':
        return <Clock size={16} />;
      default:
        return <List size={16} />;
    }
  };

  const getFilterLabel = (filterType: FilterType) => {
    switch (filterType) {
      case 'all':
        return 'All';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'overdue':
        return 'Overdue';
      case 'today':
        return 'Today';
      case 'upcoming':
        return 'Upcoming';
      default:
        return 'All';
    }
  };

  const getFilterCount = (filterType: FilterType) => {
    switch (filterType) {
      case 'active':
        return getActiveReminders().length;
      case 'completed':
        return getCompletedReminders().length;
      case 'overdue':
        return getOverdueReminders().length;
      case 'today':
        return getTodayReminders().length;
      case 'upcoming':
        return getUpcomingReminders().length;
      default:
        return reminders.length;
    }
  };

  const filters: FilterType[] = ['all', 'active', 'overdue', 'today', 'upcoming', 'completed'];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock size={24} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No reminders yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create your first reminder to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
        {filters.map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === filterType
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {getFilterIcon(filterType)}
            <span>{getFilterLabel(filterType)}</span>
            <span className="text-xs opacity-75">({getFilterCount(filterType)})</span>
          </button>
        ))}
      </div>

      {/* Reminders List */}
      {filteredReminders.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock size={20} className="text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            No {filter === 'all' ? '' : filter} reminders
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filter === 'completed' 
              ? 'Complete some reminders to see them here'
              : filter === 'all'
              ? 'Create your first reminder to get started'
              : `No ${filter} reminders found`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              onToggle={toggleComplete}
              onDelete={deleteReminder}
              onEdit={setEditingReminder}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog - Placeholder for now */}
      {editingReminder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Reminder</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Edit functionality coming soon!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setEditingReminder(null)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 