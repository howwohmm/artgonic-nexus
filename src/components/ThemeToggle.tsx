
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  theme: string;
  onToggle: () => void;
}

export const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="text-muted-foreground hover:text-foreground"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
};
