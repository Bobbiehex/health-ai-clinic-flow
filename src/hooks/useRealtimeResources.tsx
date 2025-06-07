
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealtimeResources = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to room occupancy changes
    const occupancyChannel = supabase
      .channel('room-occupancy-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_occupancy'
        },
        (payload) => {
          console.log('Room occupancy change:', payload);
          queryClient.invalidateQueries({ queryKey: ['room-occupancy'] });
          
          if (payload.eventType === 'UPDATE') {
            toast({
              title: 'Room Status Update',
              description: 'Room occupancy status has been updated'
            });
          }
        }
      )
      .subscribe();

    // Subscribe to maintenance schedule changes
    const maintenanceChannel = supabase
      .channel('maintenance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_schedules'
        },
        (payload) => {
          console.log('Maintenance schedule change:', payload);
          queryClient.invalidateQueries({ queryKey: ['maintenance-schedules'] });
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'Maintenance Scheduled',
              description: 'New maintenance has been scheduled'
            });
          }
        }
      )
      .subscribe();

    // Subscribe to resource alerts
    const alertsChannel = supabase
      .channel('resource-alerts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'resource_alerts'
        },
        (payload) => {
          console.log('Resource alert change:', payload);
          queryClient.invalidateQueries({ queryKey: ['resource-alerts'] });
          
          if (payload.eventType === 'INSERT') {
            const alert = payload.new as any;
            toast({
              title: 'New Alert',
              description: alert.message,
              variant: alert.severity === 'critical' ? 'destructive' : 'default'
            });
          }
        }
      )
      .subscribe();

    // Subscribe to energy usage updates
    const energyChannel = supabase
      .channel('energy-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'energy_usage'
        },
        (payload) => {
          console.log('Energy usage change:', payload);
          queryClient.invalidateQueries({ queryKey: ['energy-usage'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(occupancyChannel);
      supabase.removeChannel(maintenanceChannel);
      supabase.removeChannel(alertsChannel);
      supabase.removeChannel(energyChannel);
    };
  }, [queryClient, toast]);
};
