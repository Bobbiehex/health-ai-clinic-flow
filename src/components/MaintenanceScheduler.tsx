
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Settings, User, AlertTriangle } from 'lucide-react';
import { useMaintenanceSchedules } from '@/hooks/useResourceManagement';
import { format } from 'date-fns';

const MaintenanceScheduler = () => {
  const { schedules, isLoading, createSchedule, updateSchedule } = useMaintenanceSchedules();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    equipment_id: '',
    maintenance_type: '',
    scheduled_date: '',
    estimated_duration_hours: 2,
    priority_level: 1,
    notes: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'bg-red-100 text-red-800 border-red-200';
    if (priority === 3) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (priority === 2) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSchedule.mutate(formData, {
      onSuccess: () => {
        setShowCreateForm(false);
        setFormData({
          equipment_id: '',
          maintenance_type: '',
          scheduled_date: '',
          estimated_duration_hours: 2,
          priority_level: 1,
          notes: ''
        });
      }
    });
  };

  const handleStatusUpdate = (scheduleId: string, newStatus: string) => {
    updateSchedule.mutate({
      id: scheduleId,
      status: newStatus,
      ...(newStatus === 'completed' && { completion_date: new Date().toISOString() })
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <span>Maintenance Schedule</span>
            </CardTitle>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? 'Cancel' : 'Schedule Maintenance'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Schedule New Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="equipment">Equipment ID</Label>
                    <Input
                      id="equipment"
                      value={formData.equipment_id}
                      onChange={(e) => setFormData({ ...formData, equipment_id: e.target.value })}
                      placeholder="Enter equipment ID"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Maintenance Type</Label>
                    <Select value={formData.maintenance_type} onValueChange={(value) => setFormData({ ...formData, maintenance_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preventive">Preventive</SelectItem>
                        <SelectItem value="corrective">Corrective</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="calibration">Calibration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date">Scheduled Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.scheduled_date}
                      onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.estimated_duration_hours}
                      onChange={(e) => setFormData({ ...formData, estimated_duration_hours: parseInt(e.target.value) })}
                      min="1"
                      max="24"
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={formData.priority_level.toString()} onValueChange={(value) => setFormData({ ...formData, priority_level: parseInt(value) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Low (1)</SelectItem>
                        <SelectItem value="2">Medium (2)</SelectItem>
                        <SelectItem value="3">High (3)</SelectItem>
                        <SelectItem value="4">Critical (4)</SelectItem>
                        <SelectItem value="5">Emergency (5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional maintenance notes..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Button type="submit" disabled={createSchedule.isPending} className="w-full">
                      Schedule Maintenance
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {schedules?.map((schedule) => (
              <div key={schedule.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      <Settings className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-slate-900">
                          {schedule.equipment?.name || `Equipment ${schedule.equipment_id.slice(0, 8)}`}
                        </h4>
                        <Badge className={getStatusColor(schedule.status || 'scheduled')}>
                          {schedule.status?.replace('_', ' ').toUpperCase() || 'SCHEDULED'}
                        </Badge>
                        <Badge className={getPriorityColor(schedule.priority_level || 1)}>
                          Priority {schedule.priority_level || 1}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-slate-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(schedule.scheduled_date), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{schedule.estimated_duration_hours}h duration</span>
                          </div>
                          {schedule.technician && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{schedule.technician.first_name} {schedule.technician.last_name}</span>
                            </div>
                          )}
                        </div>
                        <p className="capitalize">{schedule.maintenance_type} maintenance</p>
                        {schedule.notes && (
                          <p className="text-xs">{schedule.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {schedule.status === 'scheduled' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(schedule.id, 'in_progress')}
                        disabled={updateSchedule.isPending}
                      >
                        Start
                      </Button>
                    )}
                    {schedule.status === 'in_progress' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(schedule.id, 'completed')}
                        disabled={updateSchedule.isPending}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceScheduler;
