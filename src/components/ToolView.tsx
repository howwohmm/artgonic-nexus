
import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToolViewProps {
  toolName: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const ToolView = ({ toolName, children, onClose }: ToolViewProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">
              {toolName}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </Button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};
