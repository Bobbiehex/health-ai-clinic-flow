
import React from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';

const Chat = () => {
  return (
    <div className="container mx-auto p-6 h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Secure communication system with real-time messaging and file sharing
          </p>
        </div>
      </div>

      <ChatInterface />
    </div>
  );
};

export default Chat;
