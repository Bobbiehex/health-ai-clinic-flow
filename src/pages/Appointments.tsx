
import { useState } from 'react';
import Layout from "@/components/Layout";
import AppointmentCalendar from '@/components/AppointmentCalendar';
import CreateAppointmentDialog from '@/components/CreateAppointmentDialog';
import AppointmentWaitlist from '@/components/AppointmentWaitlist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Brain, 
  CheckCircle, 
  AlertTriangle,
  Users,
  TrendingUp
} from "lucide-react";

const Appointments = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const handleCreateFromWaitlist = (waitlistItem: any) => {
    // Pre-fill form with waitlist data
    setShowCreateDialog(true);
  };

  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Appointment Scheduling</h1>
            <p className="text-slate-600">AI-optimized scheduling with real-time conflict detection</p>
          </div>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="healthcare-gradient text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>

        {/* AI Insights Panel */}
        <Card className="ai-glow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">AI Scheduling Insights</CardTitle>
            </div>
            <CardDescription>Real-time optimization and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Optimal Scheduling</p>
                    <p className="text-xs text-green-700">85% efficiency rate today</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Utilization Rate</p>
                    <p className="text-xs text-blue-700">92% room utilization</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-start space-x-2">
                  <Users className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-900">Waitlist</p>
                    <p className="text-xs text-orange-700">3 patients waiting</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar and Schedule */}
          <div className="xl:col-span-3">
            <AppointmentCalendar
              onCreateAppointment={() => setShowCreateDialog(true)}
              onEditAppointment={setEditingAppointment}
            />
          </div>

          {/* Sidebar with Waitlist and Quick Actions */}
          <div className="space-y-6">
            <AppointmentWaitlist onCreateFromWaitlist={handleCreateFromWaitlist} />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                  AI Optimization Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Waitlist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Appointment Dialog */}
        <CreateAppointmentDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    </Layout>
  );
};

export default Appointments;
