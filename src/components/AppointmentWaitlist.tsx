
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, User, Calendar, ArrowRight, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AppointmentWaitlistProps {
  onCreateFromWaitlist: (waitlistItem: any) => void;
}

const AppointmentWaitlist = ({ onCreateFromWaitlist }: AppointmentWaitlistProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch waitlist items
  const { data: waitlistItems, isLoading } = useQuery({
    queryKey: ['waitlist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointment_waitlist')
        .select(`
          *,
          patient:patients!appointment_waitlist_patient_id_fkey (
            *,
            user:users!patients_user_id_fkey (first_name, last_name, email)
          ),
          preferred_doctor:users!appointment_waitlist_preferred_doctor_id_fkey (first_name, last_name, specialization)
        `)
        .eq('status', 'waiting')
        .order('priority_level', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  // Update waitlist status
  const updateWaitlistStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('appointment_waitlist')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      toast({
        title: 'Success',
        description: 'Waitlist item updated successfully'
      });
    }
  });

  const getPriorityColor = (priority: number) => {
    if (priority >= 3) return 'bg-red-100 text-red-800 border-red-200';
    if (priority === 2) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 3) return 'High';
    if (priority === 2) return 'Medium';
    return 'Low';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Waitlist</CardTitle>
      </CardHeader>
      <CardContent>
        {waitlistItems && waitlistItems.length > 0 ? (
          <div className="space-y-4">
            {waitlistItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-orange-100 text-orange-700">
                        {item.patient?.user?.first_name?.[0]}
                        {item.patient?.user?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.patient?.user?.first_name} {item.patient?.user?.last_name}
                      </h3>
                      <p className="text-sm text-slate-600">{item.reason_for_visit}</p>
                      
                      <div className="flex items-center space-x-4 mt-1">
                        {item.preferred_date && (
                          <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(item.preferred_date), 'MMM d, yyyy')}</span>
                          </div>
                        )}
                        
                        {item.preferred_time_start && (
                          <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span>{item.preferred_time_start} - {item.preferred_time_end}</span>
                          </div>
                        )}
                        
                        {item.preferred_doctor && (
                          <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <User className="h-3 w-3" />
                            <span>
                              Dr. {item.preferred_doctor.first_name} {item.preferred_doctor.last_name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={getPriorityColor(item.priority_level || 1)}>
                      {getPriorityLabel(item.priority_level || 1)} Priority
                    </Badge>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => onCreateFromWaitlist(item)}
                        className="healthcare-gradient text-white"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Schedule
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateWaitlistStatus.mutate({ id: item.id, status: 'cancelled' })}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-slate-500">
                  Added to waitlist {format(new Date(item.created_at), 'MMM d, yyyy \'at\' h:mm a')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500">No patients on waitlist</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentWaitlist;
