
import React, { useEffect, useRef } from 'react';
import { useMessages } from '@/hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { Skeleton } from '@/components/ui/skeleton';

interface MessageListProps {
  conversationId: string;
}

export const MessageList: React.FC<MessageListProps> = ({ conversationId }) => {
  const { messages, isLoading } = useMessages(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-16 w-64" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p>No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const isFirstFromSender = 
          index === 0 || messages[index - 1].sender_id !== message.sender_id;
        const isLastFromSender = 
          index === messages.length - 1 || 
          messages[index + 1].sender_id !== message.sender_id;

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isFirstFromSender={isFirstFromSender}
            isLastFromSender={isLastFromSender}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
