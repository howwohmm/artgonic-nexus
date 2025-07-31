export interface Reminder {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReminderFormData {
  title: string;
  description: string;
  due_date: string;
} 