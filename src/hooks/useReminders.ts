
import { useState, useEffect } from 'react';
import { Reminder } from '../types/reminder';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './use-toast';

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load reminders from Supabase
  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Failed to fetch reminders:', error);
        toast({
          title: "Error",
          description: "Failed to load reminders. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setReminders(data || []);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
      toast({
        title: "Error",
        description: "Failed to load reminders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a new reminder
  const addReminder = async (reminderData: Omit<Reminder, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .insert([reminderData])
        .select()
        .single();

      if (error) {
        console.error('Failed to add reminder:', error);
        toast({
          title: "Error",
          description: "Failed to add reminder. Please try again.",
          variant: "destructive"
        });
        throw error;
      }

      setReminders(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Reminder created successfully!"
      });
      
      return data;
    } catch (error) {
      console.error('Failed to add reminder:', error);
      throw error;
    }
  };

  // Update a reminder
  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Failed to update reminder:', error);
        toast({
          title: "Error",
          description: "Failed to update reminder. Please try again.",
          variant: "destructive"
        });
        throw error;
      }

      setReminders(prev => 
        prev.map(reminder => 
          reminder.id === id ? data : reminder
        )
      );
    } catch (error) {
      console.error('Failed to update reminder:', error);
      throw error;
    }
  };

  // Delete a reminder
  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Failed to delete reminder:', error);
        toast({
          title: "Error",
          description: "Failed to delete reminder. Please try again.",
          variant: "destructive"
        });
        throw error;
      }

      setReminders(prev => prev.filter(reminder => reminder.id !== id));
      toast({
        title: "Success",
        description: "Reminder deleted successfully!"
      });
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      throw error;
    }
  };

  // Toggle completion status
  const toggleComplete = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      await updateReminder(id, { completed: !reminder.completed });
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
    refreshReminders: fetchReminders,
  };
};
