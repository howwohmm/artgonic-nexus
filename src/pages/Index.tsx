
import React, { useState, useEffect } from 'react';
import { FilePlus, BarChart2, Bell, BrainCircuit, X, Play, Pause, RotateCcw, Sun, Moon, Trash2, User } from 'lucide-react';
import { sdk } from "@farcaster/miniapp-sdk";

// Dashboard Component
const Dashboard = ({
  tools,
  onOpenTool
}) => {
  return <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Toooools</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">A set of essential mini-tools by Ohm. </p>
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
  return <div onClick={onOpen} className="group bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl p-8 cursor-pointer transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mr-4 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
          <Icon size={24} className="text-gray-700 dark:text-gray-300" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {tool.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {tool.description}
          </p>
        </div>
      </div>
    </div>;
};

// Tool View Wrapper
const ToolView = ({
  toolName,
  children,
  onClose
}) => {
  return <div className="min-h-screen">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {toolName}
          </h1>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        {children}
      </main>
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
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Capture New Idea
        </h2>
        <div className="space-y-4">
          <textarea value={newIdea} onChange={e => setNewIdea(e.target.value)} onKeyPress={handleKeyPress} placeholder="What's on your mind? (⌘+Enter to save)" className="w-full h-32 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
          <button onClick={saveIdea} disabled={!newIdea.trim()} className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Save Idea
          </button>
        </div>
      </div>

      {ideas.length > 0 && <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Your Ideas ({ideas.length})
          </h2>
          <div className="space-y-3">
            {ideas.map(idea => <div key={idea.id} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white mb-1">
                    {idea.text}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {idea.createdAt}
                  </p>
                </div>
                <button onClick={() => deleteIdea(idea.id)} className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-4">
                  <Trash2 size={16} />
                </button>
              </div>)}
          </div>
        </div>}

      {ideas.length === 0 && <div className="text-center py-12">
          <BrainCircuit size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">
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
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </h2>
        
        <div className="relative w-48 h-48 mx-auto mb-8">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200 dark:text-gray-700" />
            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)} className="text-gray-900 dark:text-white transition-all duration-1000" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {isBreak ? 'Break' : 'Focus'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button onClick={toggle} className="flex items-center justify-center w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
            {isActive ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={reset} className="flex items-center justify-center w-12 h-12 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
    </div>;
};

// Placeholder Tool Components
const FinanceTool = () => <div className="text-center py-16">
    <BarChart2 size={64} className="mx-auto mb-6 text-gray-400 dark:text-gray-600" />
    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
      Finance Tracker
    </h2>
    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
      Track your expenses, manage subscriptions, and monitor your financial goals. Coming soon!
    </p>
  </div>;
const RemindersTool = () => <div className="text-center py-16">
    <Bell size={64} className="mx-auto mb-6 text-gray-400 dark:text-gray-600" />
    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
      Reminders
    </h2>
    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
      Never miss important tasks and deadlines. Set smart reminders and get notified. Coming soon!
    </p>
  </div>;

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
    id: 'finance',
    name: 'Finance Tracker',
    icon: BarChart2,
    component: FinanceTool,
    description: 'Track expenses and subscriptions.'
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
  
  return <div style={{ fontFamily: "'Inter', sans-serif" }} className="bg-white dark:bg-black text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-300">
      {/* Sign In and Theme toggle - only show when NOT in a tool view */}
      {!activeTool && <header className="fixed top-0 right-0 p-4 z-50 flex items-center space-x-2">
          {/* Farcaster Sign In */}
          {!user ? (
            <button 
              onClick={handleSignIn} 
              disabled={isLoading}
              className="group bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl p-3 cursor-pointer transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm disabled:opacity-50"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                  <User size={16} className="text-gray-700 dark:text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </span>
              </div>
            </button>
          ) : (
            <div className="bg-white dark:bg-black border border-green-200 dark:border-green-700 rounded-2xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                  <User size={16} className="text-green-700 dark:text-green-300" />
                </div>
                <span className="text-sm font-medium text-green-900 dark:text-green-100">Signed in</span>
              </div>
            </div>
          )}
          
          {/* Theme toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>}

      {/* Tool view with integrated theme toggle */}
      {activeTool && ActiveToolComponent ? <div className="min-h-screen">
          <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Toooools
              </h1>
              <div className="flex items-center space-x-2">
                <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button onClick={closeTool} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-6 py-8">
            <ActiveToolComponent />
          </main>
        </div> : <Dashboard tools={tools} onOpenTool={openTool} />}
    </div>;
};

export default Index;
