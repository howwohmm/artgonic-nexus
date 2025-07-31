
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  subtitle?: string;
  onClick: () => void;
}

export const ToolCard = ({ icon: Icon, title, description, subtitle, onClick }: ToolCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group bg-card border border-border rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:border-muted-foreground/20 hover:bg-accent/5"
    >
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center group-hover:bg-muted/80 transition-colors">
          <Icon size={20} className="text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {description}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
