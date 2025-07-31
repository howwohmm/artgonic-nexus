import { useState, useEffect } from 'react';
import { Reminder } from '../types/reminder';

const STORAGE_KEY = 'toooools-reminders';

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Load reminders from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setReminders(parsed);
      }
    } catch (error) {
      console.error('Failed to load reminders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save reminders to localStorage
  const saveReminders = (newReminders: Reminder[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReminders));
      setReminders(newReminders);
    } catch (error) {
      console.error('Failed to save reminders:', error);
    }
  };

  // Add a new reminder
  const addReminder = (reminderData: Omit<Reminder, 'id' | 'created_at' | 'updated_at'>) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedReminders = [...reminders, newReminder];
    saveReminders(updatedReminders);
    return newReminder;
  };

  // Update a reminder
  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, ...updates, updated_at: new Date().toISOString() }
        : reminder
    );
    saveReminders(updatedReminders);
  };

  // Delete a reminder
  const deleteReminder = (id: string) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    saveReminders(updatedReminders);
  };

  // Toggle completion status
  const toggleComplete = (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      updateReminder(id, { completed: !reminder.completed });
    }
  };

  // Get filtered reminders
  const getActiveReminders = () => reminders.filter(r => !r.completed);
  const getCompletedReminders = () => reminders.filter(r => r.completed);
  const getOverdueReminders = () => {
    const now = new Date();
    return reminders.filter(r => !r.completed && new Date(r.due_date) < now);
  };
  const getTodayReminders = () => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    
    return reminders.filter(r => {
      const dueDate = new Date(r.due_date);
      return !r.completed && dueDate >= startOfDay && dueDate < endOfDay;
    });
  };
  const getUpcomingReminders = () => {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
    
    return reminders.filter(r => {
      const dueDate = new Date(r.due_date);
      return !r.completed && dueDate > now && dueDate <= endOfDay;
    });
  };

  return {
    reminders,
    loading,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleComplete,
    getActiveReminders,
    getCompletedReminders,
    getOverdueReminders,
    getTodayReminders,
    getUpcomingReminders,
  };
}; 