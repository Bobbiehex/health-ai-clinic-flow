
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealtimeNotifications = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to notifications changes
    const notificationsChannel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('Notification change:', payload);
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          
          if (payload.eventType === 'INSERT') {
            const notification = payload.new as any;
            
            // Show toast for urgent notifications
            if (notification.priority === 'urgent' || notification.type === 'emergency') {
              toast({
                title: notification.title,
                description: notification.content,
                variant: notification.type === 'emergency' ? 'destructive' : 'default'
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [queryClient, toast]);
};
