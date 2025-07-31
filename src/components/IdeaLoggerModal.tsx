
import React, { useState } from 'react';
import { X, Mic } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface IdeaLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveIdea: (idea: string, category?: string) => void;
}

export const IdeaLoggerModal = ({ isOpen, onClose, onSaveIdea }: IdeaLoggerModalProps) => {
  const [idea, setIdea] = useState('');
  const [category, setCategory] = useState('');

  const handleSave = () => {
    if (idea.trim()) {
      onSaveIdea(idea.trim(), category || undefined);
      setIdea('');
      setCategory('');
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-background border-border">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Log New Idea
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What's your idea? (No character limit - write as much as you want!)"
              className="w-full h-32 p-4 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
          </div>

          <div className="flex items-center justify-center">
            <div className="text-muted-foreground text-sm">or</div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full border-border"
            >
              <Mic size={20} className="text-muted-foreground" />
            </Button>
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
            >
              <option value="">Category (optional)</option>
              <option value="business">Business</option>
              <option value="creative">Creative</option>
              <option value="technical">Technical</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          <Button
            onClick={handleSave}
            disabled={!idea.trim()}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Save Idea
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
