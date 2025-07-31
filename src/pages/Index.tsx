
import React, { useState, useEffect } from 'react';
import { BarChart2, Bell, BrainCircuit, Play, FilePlus } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { ToolView } from '@/components/ToolView';
import { IdeaLoggerModal } from '@/components/IdeaLoggerModal';
import { FinanceTracker } from '@/components/FinanceTracker';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';

// Font Loader Component
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);
  return null;
};

// Simple Ideas Tool
const IdeasTool = ({ onOpenModal }: { onOpenModal: () => void }) => {
  return (
    <div className="text-center py-16">
      <BrainCircuit size={64} className="mx-auto mb-6 text-muted-foreground" />
      <h2 className="text-2xl font-semibold mb-4 text-foreground">
        Idea Logger
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Capture your brainstorms, creative thoughts, and brilliant ideas in one place.
      </p>
      <button
        onClick={onOpenModal}
        className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <FilePlus size={20} className="mr-2" />
        Log New Idea
      </button>
    </div>
  );
};

// Placeholder Tool Components
const RemindersTool = () => (
  <div className="text-center py-16">
    <Bell size={64} className="mx-auto mb-6 text-muted-foreground" />
    <h2 className="text-2xl font-semibold mb-4 text-foreground">
      Reminders
    </h2>
    <p className="text-muted-foreground max-w-md mx-auto">
      Never miss important tasks and deadlines. Set smart reminders and get notified. Coming soon!
    </p>
  </div>
);

const PomodoroTool = () => (
  <div className="text-center py-16">
    <Play size={64} className="mx-auto mb-6 text-muted-foreground" />
    <h2 className="text-2xl font-semibold mb-4 text-foreground">
      Pomodoro Timer
    </h2>
    <p className="text-muted-foreground max-w-md mx-auto">
      Boost productivity with focused work sessions and regular breaks. Coming soon!
    </p>
  </div>
);

// Main App Component
const Index = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [theme, setTheme] = useState('dark');
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [ideas, setIdeas] = useState<Array<{ id: number; text: string; category?: string; createdAt: string }>>([]);
  const { toast } = useToast();

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const tools = [
    { 
      id: 'ideas', 
      name: 'Idea Logger', 
      icon: BrainCircuit, 
      component: IdeasTool, 
      description: 'Capture brainstorms, reels, sketches' 
    },
    { 
      id: 'finance', 
      name: 'Finance Tracker', 
      icon: BarChart2, 
      component: FinanceTracker, 
      description: 'Track expenses & subscriptions' 
    },
    { 
      id: 'reminders', 
      name: 'Reminders', 
      icon: Bell, 
      component: RemindersTool, 
      description: 'Manage tasks and get notifications' 
    },
    { 
      id: 'pomodoro', 
      name: 'Pomodoro', 
      icon: Play, 
      component: PomodoroTool, 
      description: 'Boost productivity with focused work sessions' 
    },
  ];

  const openTool = (toolId: string) => {
    if (toolId === 'ideas') {
      setIsIdeaModalOpen(true);
    } else {
      setActiveTool(toolId);
    }
  };

  const closeTool = () => setActiveTool(null);

  const handleSaveIdea = (ideaText: string, category?: string) => {
    const newIdea = {
      id: Date.now(),
      text: ideaText,
      category,
      createdAt: new Date().toLocaleDateString()
    };
    setIdeas([newIdea, ...ideas]);
    toast({
      title: "Idea saved!",
      description: "Your idea has been successfully logged.",
    });
  };

  const ActiveToolComponent = tools.find(t => t.id === activeTool)?.component;

  return (
    <>
      <FontLoader />
      <div 
        style={{ fontFamily: "'Inter', sans-serif" }} 
        className="bg-background text-foreground min-h-screen transition-colors duration-300"
      >
        <header className="fixed top-0 right-0 p-4 z-50">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        {activeTool && ActiveToolComponent ? (
          <ToolView toolName={tools.find(t => t.id === activeTool)?.name || ''} onClose={closeTool}>
            {activeTool === 'ideas' ? (
              <IdeasTool onOpenModal={() => setIsIdeaModalOpen(true)} />
            ) : (
              <ActiveToolComponent />
            )}
          </ToolView>
        ) : (
          <Dashboard tools={tools} onOpenTool={openTool} />
        )}

        <IdeaLoggerModal
          isOpen={isIdeaModalOpen}
          onClose={() => setIsIdeaModalOpen(false)}
          onSaveIdea={handleSaveIdea}
        />
      </div>
    </>
  );
};

export default Index;
