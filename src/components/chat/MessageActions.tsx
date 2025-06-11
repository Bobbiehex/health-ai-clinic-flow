
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Smile,
  Reply,
  MoreHorizontal 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MessageActionsProps {
  onToggleReactions: () => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({ onToggleReactions }) => {
  return (
    <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="flex space-x-1">
        <Button
          size="sm"
          variant="secondary"
          className="h-6 w-6 p-0"
          onClick={onToggleReactions}
        >
          <Smile className="h-3 w-3" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
