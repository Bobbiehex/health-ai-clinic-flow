
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Brain, 
  CheckCircle, 
  AlertTriangle,
  User,
  MapPin
} from "lucide-react";

const Appointments = () => {
  const appointments = [
    {
      id: 1,
      patient: "Emily Johnson",
      time: "09:00 AM",
      type: "Routine Checkup",
      doctor: "Dr. Sarah Chen",
      room: "Room 101",
      status: "confirmed",
      aiOptimized: true
    },
    {
      id: 2,
      patient: "Michael Chen",
      time: "10:30 AM",
      type: "Follow-up",
      doctor: "Dr. James Wilson",
      room: "Room 103",
      status: "pending",
      aiOptimized: false
    },
    {
      id: 3,
      patient: "Sarah Williams",
      time: "02:00 PM",
      type: "Prenatal Care",
      doctor: "Dr. Maria Garcia",
      room: "Room 205",
      status: "confirmed",
      aiOptimized: true
    }
  ];

  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Appointment Scheduling</h1>
            <p className="text-slate-600">AI-optimized scheduling for maximum efficiency</p>
          </div>
          <Button className="healthcare-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Schedule</CardTitle>
                    <CardDescription>June 4, 2025 • {appointments.length} appointments</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                      <Brain className="w-3 h-3 mr-1" />
                      AI Optimized
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      View Calendar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <Card key={appointment.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{appointment.time}</div>
                            <div className="text-xs text-slate-500">30 min</div>
                          </div>
                          <div className="w-px h-12 bg-slate-200"></div>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback className="bg-green-100 text-green-700">
                                {appointment.patient.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-slate-900">{appointment.patient}</h3>
                              <p className="text-sm text-slate-600">{appointment.type}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center space-x-1 text-xs text-slate-500">
                                  <User className="h-3 w-3" />
                                  <span>{appointment.doctor}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-slate-500">
                                  <MapPin className="h-3 w-3" />
                                  <span>{appointment.room}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {appointment.aiOptimized && (
                            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                              <Brain className="w-3 h-3 mr-1" />
                              AI Optimized
                            </Badge>
                          )}
                          <Badge 
                            variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                            className={appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' : ''}
                          >
                            {appointment.status === 'confirmed' ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Confirmed
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </>
                            )}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Scheduling Assistant */}
          <div className="space-y-6">
            <Card className="ai-glow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base">AI Scheduling Assistant</CardTitle>
                </div>
                <CardDescription>Smart recommendations for optimal scheduling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Optimal Timing</p>
                        <p className="text-xs text-green-700">Current schedule minimizes wait times by 15%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Suggestion</p>
                        <p className="text-xs text-blue-700">Move 2 PM appointment to 3 PM for better flow</p>
                        <Button size="sm" variant="outline" className="mt-2 text-xs border-blue-300 text-blue-700">
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-orange-900">Capacity Alert</p>
                        <p className="text-xs text-orange-700">Friday 85% booked - consider additional slots</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Appointment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Weekly Schedule
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Reschedule Requests
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Optimization
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
