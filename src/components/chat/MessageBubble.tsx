
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAddReaction } from '@/hooks/useChat';
import { supabase } from '@/integrations/supabase/client';
import { 
  Download, 
  File, 
  Image as ImageIcon, 
  Video, 
  Smile,
  Reply,
  MoreHorizontal 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  const renderFilePreview = () => {
    if (!message.file_url) return null;

    const isImage = message.file_mime_type?.startsWith('image/');
    const isVideo = message.file_mime_type?.startsWith('video/');

    return (
      <div className="mt-2">
        {isImage && (
          <img
            src={message.file_url}
            alt={message.file_name}
            className="max-w-xs rounded-lg shadow-sm"
          />
        )}
        {isVideo && (
          <video
            src={message.file_url}
            controls
            className="max-w-xs rounded-lg shadow-sm"
          />
        )}
        {!isImage && !isVideo && (
          <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg max-w-xs">
            <File className="h-5 w-5 text-gray-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.file_name}</p>
              <p className="text-xs text-gray-500">
                {message.file_size ? `${(message.file_size / 1024).toFixed(1)} KB` : ''}
              </p>
            </div>
            <Button size="sm" variant="ghost" asChild>
              <a href={message.file_url} download={message.file_name}>
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderReactions = () => {
    if (!message.reactions?.length) return null;

    const reactionCounts = message.reactions.reduce((acc: any, reaction: any) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {Object.entries(reactionCounts).map(([emoji, count]) => (
          <Badge key={emoji} variant="secondary" className="text-xs">
            {emoji} {count}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
        {!isOwnMessage && isLastFromSender && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.sender?.avatar_url} />
            <AvatarFallback>
              {message.sender?.first_name?.charAt(0)}
              {message.sender?.last_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        {!isOwnMessage && !isLastFromSender && <div className="w-8" />}

        <div className="flex-1">
          {isFirstFromSender && !isOwnMessage && (
            <p className="text-xs text-gray-500 mb-1 px-3">
              {message.sender?.first_name} {message.sender?.last_name}
            </p>
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
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            )}

            {renderFilePreview()}
            {renderReactions()}

            <div className="flex items-center justify-between mt-2 text-xs opacity-70">
              <span>
                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
              </span>
              {message.edited_at && <span>(edited)</span>}
            </div>

            {/* Message actions */}
            <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowReactions(!showReactions)}
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

            {/* Quick reactions */}
            {showReactions && (
              <div className="absolute -bottom-8 left-0 bg-white border rounded-lg shadow-lg p-2 flex space-x-1 z-10">
                {['👍', '❤️', '😊', '😮', '😢', '😡'].map((emoji) => (
                  <Button
                    key={emoji}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => handleReaction(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
