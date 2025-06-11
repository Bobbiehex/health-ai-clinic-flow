
import React, { useState } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { Card } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showNewConversation, setShowNewConversation] = useState(false);

  // Enable real-time updates
  useRealtimeChat();

  const handleNewConversation = () => {
    setShowNewConversation(true);
  };

  return (
    <div className="h-full flex bg-white rounded-lg overflow-hidden">
      <ChatSidebar
        selectedConversationId={selectedConversationId || undefined}
        onSelectConversation={setSelectedConversationId}
        onNewConversation={handleNewConversation}
      />

      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <>
            <MessageList conversationId={selectedConversationId} />
            <MessageInput conversationId={selectedConversationId} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="p-8 text-center">
              <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the sidebar to start messaging
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
