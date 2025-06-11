
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAddReaction } from '@/hooks/useChat';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { MessageAvatar } from './MessageAvatar';
import { MessageHeader } from './MessageHeader';
import { FilePreview } from './FilePreview';
import { MessageReactions } from './MessageReactions';
import { MessageActions } from './MessageActions';
import { QuickReactions } from './QuickReactions';

interface MessageBubbleProps {
  message: any;
  isFirstFromSender: boolean;
  isLastFromSender: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isFirstFromSender,
  isLastFromSender
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const addReaction = useAddReaction();
  const [currentUser, setCurrentUser] = useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  const isOwnMessage = currentUser?.id === message.sender_id;

  const handleReaction = (emoji: string) => {
    addReaction.mutate({ messageId: message.id, emoji });
    setShowReactions(false);
  };

  const handleToggleReactions = () => {
    setShowReactions(!showReactions);
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
        {!isOwnMessage && (
          <MessageAvatar sender={message.sender} isLastFromSender={isLastFromSender} />
        )}

        <div className="flex-1">
          {isFirstFromSender && !isOwnMessage && (
            <MessageHeader 
              senderFirstName={String(message.sender?.first_name || '')}
              senderLastName={String(message.sender?.last_name || '')}
            />
          )}

          <div
            className={`relative px-4 py-2 rounded-lg ${
              isOwnMessage
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-200'
            }`}
          >
            {message.priority === 'urgent' && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs">
                Urgent
              </Badge>
            )}

            {message.content && (
              <p className="text-sm whitespace-pre-wrap">{String(message.content)}</p>
            )}

            {message.file_url && (
              <FilePreview 
                fileUrl={message.file_url}
                fileName={message.file_name}
                fileSize={message.file_size}
                fileMimeType={message.file_mime_type}
              />
            )}

            <MessageReactions reactions={message.reactions} />

            <div className="flex items-center justify-between mt-2 text-xs opacity-70">
              <span>
                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
              </span>
              {message.edited_at && <span>(edited)</span>}
            </div>

            <MessageActions onToggleReactions={handleToggleReactions} />
            <QuickReactions onReaction={handleReaction} show={showReactions} />
          </div>
        </div>
      </div>
    </div>
  );
};
