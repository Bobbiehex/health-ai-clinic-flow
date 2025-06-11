
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useConversations = () => {
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participants:conversation_participants (
            user:users (id, first_name, last_name, avatar_url)
          ),
          last_message:messages (
            id,
            content,
            created_at,
            sender:users (first_name, last_name)
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return { conversations, isLoading };
};

export const useMessages = (conversationId: string) => {
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users (id, first_name, last_name, avatar_url),
          reactions:message_reactions (
            emoji,
            user:users (id, first_name, last_name)
          )
        `)
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!conversationId
  });

  return { messages, isLoading };
};

export const useCreateConversation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ participantIds, type = 'direct', title }: {
      participantIds: string[];
      type?: 'direct' | 'group' | 'emergency';
      title?: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data: conversation, error } = await supabase
        .from('conversations')
        .insert({
          type,
          title,
          created_by: user.user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Add participants including the creator
      const participants = [user.user.id, ...participantIds].map(userId => ({
        conversation_id: conversation.id,
        user_id: userId
      }));

      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(participants);

      if (participantsError) throw participantsError;

      return conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: 'Success',
        description: 'Conversation created successfully'
      });
    }
  });
};

export const useSendMessage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      conversationId, 
      content, 
      contentType = 'text',
      fileUrl,
      fileName,
      fileSize,
      fileMimeType,
      priority = 'normal'
    }: {
      conversationId: string;
      content: string;
      contentType?: string;
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
      fileMimeType?: string;
      priority?: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.user.id,
          content,
          content_type: contentType,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          file_mime_type: fileMimeType,
          priority
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};

export const useAddReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('message_reactions')
        .upsert({
          message_id: messageId,
          user_id: user.user.id,
          emoji
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Find the conversation ID for this message to invalidate the right cache
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });
};
