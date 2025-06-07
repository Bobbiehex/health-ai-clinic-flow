
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Thermometer, Clock, User } from 'lucide-react';
import { useRoomOccupancy } from '@/hooks/useResourceManagement';

const RoomOccupancyTracker = () => {
  const { occupancy, isLoading, updateOccupancy } = useRoomOccupancy();

  const getOccupancyStatus = (room: any) => {
    if (room.occupied_by_appointment_id) return 'occupied';
    return 'available';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-red-100 text-red-700 border-red-200';
      case 'available': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleToggleOccupancy = (roomId: string, currentlyOccupied: boolean) => {
    updateOccupancy.mutate({
      roomId,
      appointmentId: currentlyOccupied ? undefined : 'manual',
      temperature: Math.floor(Math.random() * 5) + 20 // Simulate temperature reading
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Home className="h-5 w-5 text-blue-600" />
          <span>Real-time Room Occupancy</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {occupancy?.map((room) => {
            const status = getOccupancyStatus(room);
            const isOccupied = status === 'occupied';
            
            return (
              <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">{room.room?.room_number}</span>
                  </div>
                  <Badge className={getStatusColor(status)}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-slate-600">
                    Type: {room.room?.room_type}
                  </p>
                  
                  {room.temperature_celsius && (
                    <div className="flex items-center space-x-1 text-sm">
                      <Thermometer className="h-3 w-3" />
                      <span>{room.temperature_celsius}°C</span>
                    </div>
                  )}

                  {isOccupied && room.appointment && (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <User className="h-3 w-3" />
                        <span>
                          {room.appointment.patient?.user?.first_name} {room.appointment.patient?.user?.last_name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>Since {new Date(room.occupied_since).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {room.appointment.reason_for_visit}
                      </p>
                    </div>
                  )}

                  {room.occupied_since && (
                    <div className="text-xs text-slate-500">
                      Duration: {Math.floor((Date.now() - new Date(room.occupied_since).getTime()) / (1000 * 60))} minutes
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t">
                  <Button
                    size="sm"
                    variant={isOccupied ? "destructive" : "default"}
                    className="w-full"
                    onClick={() => handleToggleOccupancy(room.room_id, isOccupied)}
                    disabled={updateOccupancy.isPending}
                  >
                    {isOccupied ? 'Mark Available' : 'Mark Occupied'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomOccupancyTracker;
