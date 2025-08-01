
import React, { useState, useEffect } from 'react';
import { FilePlus, Bell, BrainCircuit, X, Play, Pause, RotateCcw, Sun, Moon, Trash2, User } from 'lucide-react';
import { sdk } from "@farcaster/miniapp-sdk";
import { ReminderForm } from '../components/ReminderForm';
import { ReminderList } from '../components/ReminderList';

// Dashboard Component
const Dashboard = ({
  tools,
  onOpenTool
}) => {
  return <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Toooools</h1>
          <p className="text-lg text-muted-foreground">A set of essential mini-tools by Ohm. </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map(tool => <ToolCard key={tool.id} tool={tool} onOpen={() => onOpenTool(tool.id)} />)}
        </div>
      </div>
    </div>;
};

// Tool Card Component
const ToolCard = ({
  tool,
  onOpen
}) => {
  const Icon = tool.icon;
  return <div onClick={onOpen} className="group bg-card border border-border rounded-2xl p-8 cursor-pointer transition-all duration-200 hover:border-muted-foreground hover:shadow-sm">
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <Icon size={24} className="text-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-1">
            {tool.name}
          </h3>
          <p className="text-muted-foreground text-sm">
            {tool.description}
          </p>
        </div>
      </div>
    </div>;
};

// Ideas Tool Component
const IdeasTool = () => {
  const [ideas, setIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState('');
  const saveIdea = () => {
    if (newIdea.trim()) {
      const idea = {
        id: Date.now(),
        text: newIdea.trim(),
        createdAt: new Date().toLocaleDateString()
      };
      setIdeas([idea, ...ideas]);
      setNewIdea('');
    }
  };
  const deleteIdea = id => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };
  const handleKeyPress = e => {
    if (e.key === 'Enter' && e.metaKey) {
      saveIdea();
    }
  };
  return <div className="space-y-8">
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Capture New Idea
        </h2>
        <div className="space-y-4">
          <textarea value={newIdea} onChange={e => setNewIdea(e.target.value)} onKeyPress={handleKeyPress} placeholder="What's on your mind? (⌘+Enter to save)" className="w-full h-32 p-4 border border-border rounded-xl bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none" />
          <button onClick={saveIdea} disabled={!newIdea.trim()} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Save Idea
          </button>
        </div>
      </div>

      {ideas.length > 0 && <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Your Ideas ({ideas.length})
          </h2>
          <div className="space-y-3">
            {ideas.map(idea => <div key={idea.id} className="flex items-start justify-between p-4 bg-muted rounded-xl">
                <div className="flex-1">
                  <p className="text-foreground mb-1">
                    {idea.text}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {idea.createdAt}
                  </p>
                </div>
                <button onClick={() => deleteIdea(idea.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors ml-4">
                  <Trash2 size={16} />
                </button>
              </div>)}
          </div>
        </div>}

      {ideas.length === 0 && <div className="text-center py-12">
          <BrainCircuit size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            No ideas captured yet. Start brainstorming!
          </p>
        </div>}
    </div>;
};

// Pomodoro Tool Component
const PomodoroTool = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsActive(false);
          setIsBreak(!isBreak);
          setMinutes(isBreak ? 25 : 5);
          setSeconds(0);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak]);
  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setMinutes(isBreak ? 5 : 25);
    setSeconds(0);
  };
  const totalSeconds = (isBreak ? 5 : 25) * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = (totalSeconds - currentSeconds) / totalSeconds * 100;
  return <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-8 text-foreground">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </h2>
        
        <div className="relative w-48 h-48 mx-auto mb-8">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)} className="text-foreground transition-all duration-1000" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-1">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div className="text-sm text-muted-foreground">
                {isBreak ? 'Break' : 'Focus'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button onClick={toggle} className="flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
            {isActive ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={reset} className="flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
    </div>;
};

const RemindersTool = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Bell size={48} className="mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-semibold mb-2 text-foreground">
          Reminders
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Never miss important tasks and deadlines. Set smart reminders and get notified.
        </p>
      </div>
      
      <ReminderForm />
      <ReminderList />
    </div>
  );
};

// Main App Component
const Index = () => {
  const [activeTool, setActiveTool] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };
  
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  
  // Sign in with Farcaster using Quick Auth
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const { token } = await sdk.quickAuth.getToken();
      setUser({ token });
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const tools = [{
    id: 'ideas',
    name: 'Idea Logger',
    icon: BrainCircuit,
    component: IdeasTool,
    description: 'Capture brainstorms, notes, and sketches.'
  }, {
    id: 'reminders',
    name: 'Reminders',
    icon: Bell,
    component: RemindersTool,
    description: 'Manage tasks and get notifications.'
  }, {
    id: 'pomodoro',
    name: 'Pomodoro',
    icon: Play,
    component: PomodoroTool,
    description: 'Boost productivity with focused work sessions.'
  }];
  const openTool = toolId => setActiveTool(toolId);
  const closeTool = () => setActiveTool(null);
  const ActiveToolComponent = tools.find(t => t.id === activeTool)?.component;
  
  return <div style={{ fontFamily: "'Inter', sans-serif" }} className="bg-background text-foreground min-h-screen transition-colors duration-300">
      {/* Sign In and Theme toggle - only show when NOT in a tool view */}
      {!activeTool && <header className="fixed top-0 right-0 p-4 z-50 flex items-center space-x-2">
          {/* Farcaster Sign In */}
          {!user ? (
            <button 
              onClick={handleSignIn} 
              disabled={isLoading}
              className="group bg-card border border-border rounded-2xl p-3 cursor-pointer transition-all duration-200 hover:border-muted-foreground hover:shadow-sm disabled:opacity-50"
            >
              <div className="flex items-center space-x-2">
                <User size={16} className="text-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </span>
              </div>
            </button>
          ) : (
            <div className="bg-card border border-primary rounded-2xl p-3">
              <div className="flex items-center space-x-2">
                <User size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary">Signed in</span>
              </div>
            </div>
          )}
          
          {/* Theme toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>}

      {/* Tool view with integrated theme toggle */}
      {activeTool && ActiveToolComponent ? <div className="min-h-screen bg-background">
          <header className="border-b border-border bg-background">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">
                Toooools
              </h1>
              <div className="flex items-center space-x-2">
                <button onClick={toggleTheme} className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors">
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button onClick={closeTool} className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-6 py-8 bg-background">
            <ActiveToolComponent />
          </main>
        </div> : <Dashboard tools={tools} onOpenTool={openTool} />}
    </div>;
};

export default Index;
