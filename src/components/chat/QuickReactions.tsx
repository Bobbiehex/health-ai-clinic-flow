
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickReactionsProps {
  onReaction: (emoji: string) => void;
  show: boolean;
}

export const QuickReactions: React.FC<QuickReactionsProps> = ({ onReaction, show }) => {
  if (!show) return null;

  return (
    <div className="absolute -bottom-8 left-0 bg-white border rounded-lg shadow-lg p-2 flex space-x-1 z-10">
      {['👍', '❤️', '😊', '😮', '😢', '😡'].map((emoji) => (
        <Button
          key={emoji}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={() => onReaction(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
};
