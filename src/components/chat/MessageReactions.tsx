
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface MessageReactionsProps {
  reactions: any[];
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({ reactions }) => {
  if (!reactions?.length) return null;

  const reactionCounts = reactions.reduce((acc: Record<string, number>, reaction: any) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {Object.entries(reactionCounts).map(([emoji, count]) => (
        <Badge key={emoji} variant="secondary" className="text-xs">
          {emoji} {String(count)}
        </Badge>
      ))}
    </div>
  );
};
