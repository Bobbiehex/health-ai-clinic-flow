
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealtimeChat = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to conversation changes
    const conversationsChannel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        (payload) => {
          console.log('Conversation change:', payload);
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    // Subscribe to message changes
    const messagesChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Message change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const message = payload.new as any;
            queryClient.invalidateQueries({ 
              queryKey: ['messages', message.conversation_id] 
            });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            
            // Show notification for new messages (if not from current user)
            const currentUser = supabase.auth.getUser();
            currentUser.then(({ data: { user } }) => {
              if (user && message.sender_id !== user.id) {
                toast({
                  title: 'New Message',
                  description: 'You have received a new message'
                });
              }
            });
          }
        }
      )
      .subscribe();

    // Subscribe to message reactions
    const reactionsChannel = supabase
      .channel('reactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions'
        },
        (payload) => {
          console.log('Reaction change:', payload);
          queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(reactionsChannel);
    };
  }, [queryClient, toast]);
};
