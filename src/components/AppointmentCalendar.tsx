
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { useRealtimeAppointments } from '@/hooks/useRealtimeAppointments';
import { format } from 'date-fns';

interface AppointmentCalendarProps {
  onCreateAppointment: () => void;
  onEditAppointment: (appointment: any) => void;
}

const AppointmentCalendar = ({ onCreateAppointment, onEditAppointment }: AppointmentCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  
  const { appointments, isLoading, deleteAppointment } = useAppointments(dateString);
  
  // Enable real-time updates
  useRealtimeAppointments();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-3 w-3" />;
      case 'in_progress': return <Clock className="h-3 w-3" />;
      default: return <AlertTriangle className="h-3 w-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
          <Button 
            onClick={onCreateAppointment}
            className="w-full mt-4 healthcare-gradient text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </CardContent>
      </Card>

      {/* Daily Schedule */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              Schedule for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments && appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <Card key={appointment.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {appointment.start_time?.slice(0, 5)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {appointment.end_time?.slice(0, 5)}
                          </div>
                        </div>
                        
                        <div className="w-px h-12 bg-slate-200"></div>
                        
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {appointment.patient?.user?.first_name?.[0]}
                              {appointment.patient?.user?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {appointment.patient?.user?.first_name} {appointment.patient?.user?.last_name}
                            </h3>
                            <p className="text-sm text-slate-600">{appointment.reason_for_visit}</p>
                            
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-1 text-xs text-slate-500">
                                <User className="h-3 w-3" />
                                <span>
                                  Dr. {appointment.doctor?.first_name} {appointment.doctor?.last_name}
                                </span>
                              </div>
                              {appointment.room && (
                                <div className="flex items-center space-x-1 text-xs text-slate-500">
                                  <MapPin className="h-3 w-3" />
                                  <span>{appointment.room.room_number}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {appointment.ai_optimized && (
                          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                            AI Optimized
                          </Badge>
                        )}
                        
                        <Badge className={getStatusColor(appointment.status || 'scheduled')}>
                          {getStatusIcon(appointment.status || 'scheduled')}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </Badge>
                        
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditAppointment(appointment)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteAppointment.mutate(appointment.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">No appointments scheduled for this date</p>
                <Button 
                  onClick={onCreateAppointment}
                  className="mt-4 healthcare-gradient text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule First Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
