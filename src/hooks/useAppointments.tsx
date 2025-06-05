
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAppointments = (date?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch appointments for a specific date or all upcoming
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', date],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          patient:patients!appointments_patient_id_fkey (
            *,
            user:users!patients_user_id_fkey (first_name, last_name)
          ),
          doctor:users!appointments_doctor_id_fkey (first_name, last_name, specialization),
          room:rooms (room_number, room_type)
        `)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (date) {
        query = query.eq('appointment_date', date);
      } else {
        query = query.gte('appointment_date', new Date().toISOString().split('T')[0]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Create appointment with conflict detection
  const createAppointment = useMutation({
    mutationFn: async (appointmentData: any) => {
      // First check for conflicts
      const { data: conflicts } = await supabase.rpc('check_appointment_conflicts', {
        p_appointment_date: appointmentData.appointment_date,
        p_start_time: appointmentData.start_time,
        p_end_time: appointmentData.end_time,
        p_doctor_id: appointmentData.doctor_id,
        p_room_id: appointmentData.room_id
      });

      if (conflicts && conflicts.length > 0) {
        throw new Error(`Scheduling conflict detected: ${conflicts[0].conflict_type}`);
      }

      // Create the appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;

      // Create confirmation notification
      await supabase.from('appointment_notifications').insert([{
        appointment_id: data.id,
        notification_type: 'confirmation',
        scheduled_for: new Date().toISOString(),
        recipient_email: appointmentData.patient_email,
        subject: 'Appointment Confirmation',
        message: `Your appointment has been scheduled for ${appointmentData.appointment_date} at ${appointmentData.start_time}`
      }]);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Success',
        description: 'Appointment created successfully'
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

  // Update appointment
  const updateAppointment = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      // Check for conflicts if time/date changed
      if (updateData.appointment_date || updateData.start_time || updateData.end_time) {
        const { data: conflicts } = await supabase.rpc('check_appointment_conflicts', {
          p_appointment_date: updateData.appointment_date,
          p_start_time: updateData.start_time,
          p_end_time: updateData.end_time,
          p_doctor_id: updateData.doctor_id,
          p_room_id: updateData.room_id,
          p_exclude_appointment_id: id
        });

        if (conflicts && conflicts.length > 0) {
          throw new Error(`Scheduling conflict detected: ${conflicts[0].conflict_type}`);
        }
      }

      const { data, error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Success',
        description: 'Appointment updated successfully'
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

  // Delete appointment
  const deleteAppointment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Success',
        description: 'Appointment cancelled successfully'
      });
    }
  });

  return {
    appointments,
    isLoading,
    createAppointment,
    updateAppointment,
    deleteAppointment
  };
};

// Hook for AI optimization
export const useAIOptimization = () => {
  const getOptimalSlots = useMutation({
    mutationFn: async ({ date, duration = 30, doctorId, roomType }: {
      date: string;
      duration?: number;
      doctorId?: string;
      roomType?: string;
    }) => {
      const { data, error } = await supabase.rpc('find_optimal_appointment_slots', {
        p_date: date,
        p_duration_minutes: duration,
        p_doctor_id: doctorId,
        p_room_type: roomType
      });

      if (error) throw error;
      return data;
    }
  });

  return { getOptimalSlots };
};
