
import React from 'react';
import { BrainCircuit, BarChart2, Bell, Clock } from 'lucide-react';
import { ToolCard } from './ToolCard';

interface Tool {
  id: string;
  name: string;
  icon: any;
  description: string;
  subtitle?: string;
}

interface DashboardProps {
  tools: Tool[];
  onOpenTool: (toolId: string) => void;
}

export const Dashboard = ({ tools, onOpenTool }: DashboardProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Art Gonic
          </h1>
          <p className="text-lg text-muted-foreground">
            Internal Tools Ecosystem
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <ToolCard
            icon={BrainCircuit}
            title="Idea Logger"
            description="Capture brainstorms, reels, sketches"
            subtitle="11 ideas logged"
            onClick={() => onOpenTool('ideas')}
          />
          <ToolCard
            icon={BarChart2}
            title="Finance Tracker"
            description="Track expenses & subscriptions"
            subtitle="₹350 spent this month"
            onClick={() => onOpenTool('finance')}
          />
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          Creator Tools • Auto-logout after 5min inactivity
        </div>
      </div>
    </div>
  );
};
