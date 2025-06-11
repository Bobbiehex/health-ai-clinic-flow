
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageAvatarProps {
  sender: any;
  isLastFromSender: boolean;
}

export const MessageAvatar: React.FC<MessageAvatarProps> = ({ 
  sender, 
  isLastFromSender 
}) => {
  if (!isLastFromSender) {
    return <div className="w-8" />;
  }

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={sender?.avatar_url} />
      <AvatarFallback>
        {String(sender?.first_name?.charAt(0) || '')}
        {String(sender?.last_name?.charAt(0) || '')}
      </AvatarFallback>
    </Avatar>
  );
};
