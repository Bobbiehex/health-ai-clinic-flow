
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Brain
} from "lucide-react";

const Dashboard = () => {
  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Welcome back, Dr. Sarah Chen</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
              <CheckCircle className="w-3 h-3 mr-1" />
              System Optimal
            </Badge>
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 ai-glow">
              <Brain className="w-3 h-3 mr-1" />
              AI Active
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Patients</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2</span> from yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">
                6 pending, 12 confirmed
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8m</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-3m</span> from last week
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5%</span> this month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights Panel */}
          <Card className="lg:col-span-2 ai-glow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <CardTitle>AI Insights & Recommendations</CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">Real-time</Badge>
              </div>
              <CardDescription>
                Reinforcement learning optimizations for your clinic
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">Optimal Schedule Detected</p>
                    <p className="text-xs text-green-700">Moving Dr. Johnson's 2 PM appointment to 3 PM would reduce overall wait times by 12 minutes.</p>
                    <Button size="sm" variant="outline" className="mt-2 border-green-300 text-green-700 hover:bg-green-100">
                      Apply Suggestion
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Resource Optimization</p>
                    <p className="text-xs text-blue-700">Room 3 shows 23% higher patient satisfaction when equipped with tablet entertainment system.</p>
                    <Button size="sm" variant="outline" className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100">
                      View Details
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-900">Capacity Alert</p>
                    <p className="text-xs text-orange-700">Tomorrow's schedule is 87% booked. Consider opening additional time slots at 4-5 PM.</p>
                    <Button size="sm" variant="outline" className="mt-2 border-orange-300 text-orange-700 hover:bg-orange-100">
                      Adjust Schedule
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Add New Patient
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                View Today's Schedule
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resource Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Room Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Consultation Rooms</span>
                  <span className="text-sm font-medium">7/10 Available</span>
                </div>
                <Progress value={70} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Treatment Rooms</span>
                  <span className="text-sm font-medium">4/6 Available</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Staff Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Doctors</span>
                  <span className="text-sm font-medium">5/6 Active</span>
                </div>
                <Progress value={83} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Nurses</span>
                  <span className="text-sm font-medium">8/10 Active</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Equipment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">X-Ray Machines</span>
                  <span className="text-sm font-medium text-green-600">All Online</span>
                </div>
                <Progress value={100} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Lab Equipment</span>
                  <span className="text-sm font-medium text-orange-600">1 Maintenance</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
