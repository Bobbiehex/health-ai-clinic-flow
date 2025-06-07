
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Hook for room occupancy management
export const useRoomOccupancy = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: occupancy, isLoading } = useQuery({
    queryKey: ['room-occupancy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('room_occupancy')
        .select(`
          *,
          room:rooms (room_number, room_type, status),
          appointment:appointments (
            id,
            reason_for_visit,
            patient:patients (
              user:users (first_name, last_name)
            ),
            doctor:users!appointments_doctor_id_fkey (first_name, last_name)
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const updateOccupancy = useMutation({
    mutationFn: async ({
      roomId,
      appointmentId,
      temperature,
      sensorData
    }: {
      roomId: string;
      appointmentId?: string;
      temperature?: number;
      sensorData?: any;
    }) => {
      const { data, error } = await supabase.rpc('update_room_occupancy', {
        p_room_id: roomId,
        p_appointment_id: appointmentId,
        p_temperature: temperature,
        p_sensor_data: sensorData
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-occupancy'] });
      toast({
        title: 'Success',
        description: 'Room occupancy updated successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return { occupancy, isLoading, updateOccupancy };
};

// Hook for maintenance scheduling
export const useMaintenanceSchedules = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['maintenance-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_schedules')
        .select(`
          *,
          equipment:equipment (name, type, model, status),
          technician:users!maintenance_schedules_assigned_technician_id_fkey (first_name, last_name, email)
        `)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const createSchedule = useMutation({
    mutationFn: async (scheduleData: any) => {
      const { data, error } = await supabase
        .from('maintenance_schedules')
        .insert([scheduleData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-schedules'] });
      toast({
        title: 'Success',
        description: 'Maintenance scheduled successfully'
      });
    }
  });

  const updateSchedule = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('maintenance_schedules')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-schedules'] });
      toast({
        title: 'Success',
        description: 'Maintenance schedule updated successfully'
      });
    }
  });

  return { schedules, isLoading, createSchedule, updateSchedule };
};

// Hook for resource alerts
export const useResourceAlerts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['resource-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resource_alerts')
        .select('*')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const resolveAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { data, error } = await supabase
        .from('resource_alerts')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', alertId);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-alerts'] });
      toast({
        title: 'Success',
        description: 'Alert resolved successfully'
      });
    }
  });

  const generateAlerts = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('generate_maintenance_alerts');
      
      if (error) throw error;
      
      // Insert generated alerts
      if (data && data.length > 0) {
        const alertsToInsert = data.map((alert: any) => ({
          alert_type: alert.alert_type,
          resource_type: 'equipment',
          resource_id: alert.equipment_id,
          severity: alert.severity,
          title: 'Maintenance Alert',
          message: alert.message,
          auto_generated: true
        }));

        const { error: insertError } = await supabase
          .from('resource_alerts')
          .insert(alertsToInsert);

        if (insertError) throw insertError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-alerts'] });
      toast({
        title: 'Success',
        description: 'Maintenance alerts generated successfully'
      });
    }
  });

  return { alerts, isLoading, resolveAlert, generateAlerts };
};

// Hook for energy monitoring
export const useEnergyMonitoring = () => {
  const { data: energyData, isLoading } = useQuery({
    queryKey: ['energy-usage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('energy_usage')
        .select('*')
        .gte('measurement_timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('measurement_timestamp', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const addEnergyReading = useMutation({
    mutationFn: async (energyData: any) => {
      const { data, error } = await supabase
        .from('energy_usage')
        .insert([energyData])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  });

  return { energyData, isLoading, addEnergyReading };
};

// Hook for AI optimization
export const useResourceOptimization = () => {
  const getOptimization = useMutation({
    mutationFn: async ({ date, goals = ['efficiency', 'cost', 'energy'] }: {
      date: string;
      goals?: string[];
    }) => {
      const { data, error } = await supabase.rpc('optimize_resource_allocation', {
        p_date: date,
        p_optimization_goals: goals
      });

      if (error) throw error;
      return data;
    }
  });

  return { getOptimization };
};
