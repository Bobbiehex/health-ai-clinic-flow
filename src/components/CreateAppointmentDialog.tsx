
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppointments, useAIOptimization } from '@/hooks/useAppointments';
import { useToast } from '@/hooks/use-toast';

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateAppointmentDialog = ({ open, onOpenChange }: CreateAppointmentDialogProps) => {
  const { toast } = useToast();
  const { createAppointment } = useAppointments();
  const { getOptimalSlots } = useAIOptimization();
  
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    room_id: '',
    appointment_date: '',
    start_time: '',
    end_time: '',
    reason_for_visit: '',
    notes: ''
  });
  
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  // Fetch patients
  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          user:users!patients_user_id_fkey (first_name, last_name, email)
        `);
      if (error) throw error;
      return data;
    }
  });

  // Fetch doctors
  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'doctor')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    }
  });

  // Fetch rooms
  const { data: rooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('status', 'available');
      if (error) throw error;
      return data;
    }
  });

  // Check for conflicts when time/date changes
  useEffect(() => {
    const checkConflicts = async () => {
      if (formData.appointment_date && formData.start_time && formData.end_time) {
        try {
          const { data } = await supabase.rpc('check_appointment_conflicts', {
            p_appointment_date: formData.appointment_date,
            p_start_time: formData.start_time,
            p_end_time: formData.end_time,
            p_doctor_id: formData.doctor_id || null,
            p_room_id: formData.room_id || null
          });
          setConflicts(data || []);
        } catch (error) {
          console.error('Error checking conflicts:', error);
        }
      }
    };

    const timeoutId = setTimeout(checkConflicts, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.appointment_date, formData.start_time, formData.end_time, formData.doctor_id, formData.room_id]);

  const handleGetAISuggestions = async () => {
    if (!formData.appointment_date) {
      toast({
        title: 'Error',
        description: 'Please select a date first',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await getOptimalSlots.mutateAsync({
        date: formData.appointment_date,
        duration: 30,
        doctorId: formData.doctor_id || undefined
      });
      
      setAiSuggestions(result || []);
      setShowAiSuggestions(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get AI suggestions',
        variant: 'destructive'
      });
    }
  };

  const applyAISuggestion = (suggestion: any) => {
    const endTime = new Date(`2000-01-01T${suggestion.suggested_time}`);
    endTime.setMinutes(endTime.getMinutes() + 30);
    
    setFormData(prev => ({
      ...prev,
      start_time: suggestion.suggested_time,
      end_time: endTime.toTimeString().slice(0, 5),
      doctor_id: suggestion.available_doctor_id || prev.doctor_id,
      room_id: suggestion.available_room_id || prev.room_id
    }));
    setShowAiSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (conflicts.length > 0) {
      toast({
        title: 'Scheduling Conflict',
        description: 'Please resolve conflicts before creating the appointment',
        variant: 'destructive'
      });
      return;
    }

    const patientEmail = patients?.find(p => p.id === formData.patient_id)?.user?.email;
    
    try {
      await createAppointment.mutateAsync({
        ...formData,
        patient_email: patientEmail,
        ai_optimized: aiSuggestions.length > 0,
        status: 'scheduled'
      });
      
      onOpenChange(false);
      setFormData({
        patient_id: '',
        doctor_id: '',
        room_id: '',
        appointment_date: '',
        start_time: '',
        end_time: '',
        reason_for_visit: '',
        notes: ''
      });
    } catch (error) {
      // Error handled in mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Selection */}
          <div>
            <Label htmlFor="patient">Patient</Label>
            <Select value={formData.patient_id} onValueChange={(value) => setFormData(prev => ({ ...prev, patient_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients?.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.user?.first_name} {patient.user?.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData(prev => ({ ...prev, appointment_date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end_time">End Time</Label>
              <Input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
              />
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleGetAISuggestions}
              disabled={!formData.appointment_date || getOptimalSlots.isPending}
              className="w-full"
            >
              <Brain className="h-4 w-4 mr-2" />
              {getOptimalSlots.isPending ? 'Getting AI Suggestions...' : 'Get AI Optimized Time Slots'}
            </Button>
            
            {showAiSuggestions && aiSuggestions.length > 0 && (
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">AI Suggested Time Slots</h4>
                {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div>
                      <span className="font-medium">{suggestion.suggested_time}</span>
                      <Badge variant="outline" className="ml-2">
                        Score: {(suggestion.confidence_score * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => applyAISuggestion(suggestion)}
                    >
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conflicts Alert */}
          {conflicts.length > 0 && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800">Scheduling Conflicts Detected</span>
              </div>
              {conflicts.map((conflict, index) => (
                <div key={index} className="mt-2 text-sm text-red-700">
                  {conflict.conflict_type.replace('_', ' ').toUpperCase()}: 
                  {conflict.conflict_details.start_time} - {conflict.conflict_details.end_time}
                </div>
              ))}
            </div>
          )}

          {/* Doctor and Room */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doctor">Doctor</Label>
              <Select value={formData.doctor_id} onValueChange={(value) => setFormData(prev => ({ ...prev, doctor_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors?.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.first_name} {doctor.last_name}
                      {doctor.specialization && ` (${doctor.specialization})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="room">Room</Label>
              <Select value={formData.room_id} onValueChange={(value) => setFormData(prev => ({ ...prev, room_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms?.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.room_number} ({room.room_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reason and Notes */}
          <div>
            <Label htmlFor="reason">Reason for Visit</Label>
            <Input
              value={formData.reason_for_visit}
              onChange={(e) => setFormData(prev => ({ ...prev, reason_for_visit: e.target.value }))}
              placeholder="e.g., Routine checkup, Follow-up"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAppointment.isPending || conflicts.length > 0}
              className="flex-1 healthcare-gradient text-white"
            >
              {createAppointment.isPending ? 'Creating...' : 'Create Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentDialog;
