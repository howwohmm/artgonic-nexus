
-- Create the reminders table
CREATE TABLE public.reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a demo app without user authentication)
CREATE POLICY "Anyone can view reminders" 
  ON public.reminders 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create reminders" 
  ON public.reminders 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update reminders" 
  ON public.reminders 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete reminders" 
  ON public.reminders 
  FOR DELETE 
  USING (true);

-- Enable realtime for the reminders table
ALTER TABLE public.reminders REPLICA IDENTITY FULL;
