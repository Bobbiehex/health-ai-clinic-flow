
import { useState } from 'react';
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Activity, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Brain,
  Zap,
  TrendingUp,
  Thermometer
} from "lucide-react";
import ResourceAlerts from "@/components/ResourceAlerts";
import EnergyMonitor from "@/components/EnergyMonitor";
import RoomOccupancyTracker from "@/components/RoomOccupancyTracker";
import MaintenanceScheduler from "@/components/MaintenanceScheduler";
import { useRealtimeResources } from "@/hooks/useRealtimeResources";
import { useResourceOptimization } from "@/hooks/useResourceManagement";

const Resources = () => {
  useRealtimeResources(); // Enable real-time updates
  const { getOptimization } = useResourceOptimization();
  const [activeTab, setActiveTab] = useState("overview");

  const handleOptimize = () => {
    getOptimization.mutate({
      date: new Date().toISOString().split('T')[0],
      goals: ['efficiency', 'energy', 'cost']
    });
  };

  // Mock data for overview stats - in real app this would come from the hooks
  const rooms = [
    { id: 1, name: "Consultation Room 1", status: "occupied", patient: "Emily Johnson", doctor: "Dr. Chen", timeLeft: "15 min" },
    { id: 2, name: "Consultation Room 2", status: "available", patient: null, doctor: null, timeLeft: null },
    { id: 3, name: "Treatment Room 1", status: "maintenance", patient: null, doctor: null, timeLeft: "2 hours" },
    { id: 4, name: "Treatment Room 2", status: "occupied", patient: "Michael Chen", doctor: "Dr. Wilson", timeLeft: "30 min" },
  ];

  const equipment = [
    { id: 1, name: "X-Ray Machine #1", status: "online", utilization: 75, location: "Radiology Wing" },
    { id: 2, name: "X-Ray Machine #2", status: "online", utilization: 45, location: "Radiology Wing" },
    { id: 3, name: "MRI Scanner", status: "scheduled", utilization: 90, location: "Imaging Center" },
    { id: 4, name: "Ultrasound #1", status: "online", utilization: 60, location: "Obstetrics" },
    { id: 5, name: "Lab Analyzer", status: "maintenance", utilization: 0, location: "Laboratory" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700 border-green-200';
      case 'occupied': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'maintenance': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'online': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-3 w-3" />;
      case 'occupied': return <Clock className="h-3 w-3" />;
      case 'maintenance': return <AlertTriangle className="h-3 w-3" />;
      case 'online': return <CheckCircle className="h-3 w-3" />;
      case 'scheduled': return <Clock className="h-3 w-3" />;
      default: return <Settings className="h-3 w-3" />;
    }
  };

  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Resource Management</h1>
            <p className="text-slate-600">AI-optimized allocation with real-time monitoring</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
              <CheckCircle className="w-3 h-3 mr-1" />
              92% Efficiency
            </Badge>
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 ai-glow">
              <Brain className="w-3 h-3 mr-1" />
              AI Optimized
            </Badge>
            <Button onClick={handleOptimize} disabled={getOptimization.isPending}>
              <Brain className="w-4 h-4 mr-2" />
              Optimize Now
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
              <Home className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7/12</div>
              <p className="text-xs text-muted-foreground">58% utilization rate</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment Online</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15/17</div>
              <p className="text-xs text-muted-foreground">2 in maintenance</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Turnover</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12m</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-3m</span> from last week
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Savings</CardTitle>
              <Zap className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23%</div>
              <p className="text-xs text-muted-foreground">AI optimization active</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="occupancy">Room Tracking</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="energy">Energy Monitor</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Room Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Room Status</CardTitle>
                  <CardDescription>Real-time room availability and occupancy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {rooms.map((room) => (
                    <div key={room.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Home className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">{room.name}</p>
                          {room.patient && (
                            <p className="text-sm text-slate-600">{room.patient} • {room.doctor}</p>
                          )}
                          {room.timeLeft && (
                            <p className="text-xs text-slate-500">
                              {room.status === 'maintenance' ? 'Maintenance time: ' : 'Time remaining: '}{room.timeLeft}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getStatusColor(room.status)}>
                          {getStatusIcon(room.status)}
                          {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                        </Badge>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Equipment Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Equipment Status</CardTitle>
                  <CardDescription>Medical equipment monitoring and utilization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {equipment.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Activity className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900">{item.name}</p>
                            <p className="text-sm text-slate-600">{item.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getStatusColor(item.status)}>
                            {getStatusIcon(item.status)}
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      {item.status !== 'maintenance' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Utilization</span>
                            <span>{item.utilization}%</span>
                          </div>
                          <Progress value={item.utilization} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* AI Optimization Panel */}
            <Card className="ai-glow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <CardTitle>AI Resource Optimization</CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">Active</Badge>
                </div>
                <CardDescription>
                  Intelligent recommendations for resource allocation and energy efficiency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-900">Optimal Allocation</p>
                          <p className="text-xs text-green-700">Room assignments reduce patient walking by 30%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-2">
                        <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Energy Optimization</p>
                          <p className="text-xs text-blue-700">Smart systems save 23% energy consumption</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-orange-900">Maintenance Alert</p>
                          <p className="text-xs text-orange-700">X-Ray #2 requires service in 3 days</p>
                          <Button size="sm" variant="outline" className="mt-2 border-orange-300 text-orange-700">
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-start space-x-2">
                        <TrendingUp className="h-4 w-4 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-purple-900">Predictive Insight</p>
                          <p className="text-xs text-purple-700">Room 3 shows highest efficiency ratings</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="occupancy">
            <RoomOccupancyTracker />
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenanceScheduler />
          </TabsContent>

          <TabsContent value="energy">
            <EnergyMonitor />
          </TabsContent>

          <TabsContent value="alerts">
            <ResourceAlerts />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Resources;
