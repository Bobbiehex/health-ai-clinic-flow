
import React from 'react';
import { useConversations } from '@/hooks/useChat';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Video, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatSidebarProps {
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  selectedConversationId,
  onSelectConversation,
  onNewConversation
}) => {
  const { conversations, isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className="w-80 border-r bg-gray-50 p-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const getConversationTitle = (conversation: any) => {
    if (conversation.title) return conversation.title;
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants?.find(
        (p: any) => p.user.id !== conversation.created_by
      );
      return otherParticipant 
        ? `${otherParticipant.user.first_name} ${otherParticipant.user.last_name}`
        : 'Direct Chat';
    }
    return 'Group Chat';
  };

  const getConversationAvatar = (conversation: any) => {
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants?.find(
        (p: any) => p.user.id !== conversation.created_by
      );
      return otherParticipant?.user.avatar_url;
    }
    return null;
  };

  return (
    <div className="w-80 border-r bg-gray-50 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button size="sm" onClick={onNewConversation}>
            <MessageCircle className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {conversations?.map((conversation) => (
          <Card
            key={conversation.id}
            className={`cursor-pointer transition-colors hover:bg-gray-100 ${
              selectedConversationId === conversation.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getConversationAvatar(conversation)} />
                  <AvatarFallback>
                    {conversation.type === 'group' ? (
                      <Users className="h-5 w-5" />
                    ) : (
                      getConversationTitle(conversation).charAt(0)
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">
                      {getConversationTitle(conversation)}
                    </h3>
                    <div className="flex space-x-1">
                      {conversation.type === 'emergency' && (
                        <Badge variant="destructive" className="text-xs">
                          Emergency
                        </Badge>
                      )}
                    </div>
                  </div>

                  {conversation.last_message && (
                    <>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.last_message.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(
                          new Date(conversation.last_message.created_at),
                          { addSuffix: true }
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
