
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealtimeAppointments = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to appointment changes
    const appointmentChannel = supabase
      .channel('appointment-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Appointment change:', payload);
          
          // Invalidate and refetch appointments
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
          
          // Show notification for real-time updates
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'New Appointment',
              description: 'A new appointment has been scheduled'
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: 'Appointment Updated',
              description: 'An appointment has been modified'
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: 'Appointment Cancelled',
              description: 'An appointment has been cancelled'
            });
          }
        }
      )
      .subscribe();

    // Subscribe to waitlist changes
    const waitlistChannel = supabase
      .channel('waitlist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointment_waitlist'
        },
        (payload) => {
          console.log('Waitlist change:', payload);
          queryClient.invalidateQueries({ queryKey: ['waitlist'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentChannel);
      supabase.removeChannel(waitlistChannel);
    };
  }, [queryClient, toast]);
};
