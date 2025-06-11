
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    }
  });

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return { notifications, unreadCount, isLoading };
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

export const useCreateNotification = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      userId,
      type,
      title,
      content,
      priority = 'normal',
      relatedId
    }: {
      userId: string;
      type: string;
      title: string;
      content: string;
      priority?: string;
      relatedId?: string;
    }) => {
      const { data, error } = await supabase.rpc('create_notification', {
        p_user_id: userId,
        p_type: type,
        p_title: title,
        p_content: content,
        p_priority: priority,
        p_related_id: relatedId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Notification sent successfully'
      });
    }
  });
};
