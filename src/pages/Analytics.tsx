
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChartBar, 
  TrendingUp, 
  Users, 
  Clock, 
  Activity,
  Brain,
  Download,
  Calendar
} from "lucide-react";

const Analytics = () => {
  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
            <p className="text-slate-600">Data-driven insights for clinic optimization</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patient Volume</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> vs last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.5m</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-15%</span> improvement
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+0.3</span> rating increase
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Efficiency</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> AI optimization
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patient Flow</TabsTrigger>
            <TabsTrigger value="resources">Resource Usage</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Patient Volume Trends</CardTitle>
                  <CardDescription>Monthly patient visits over the last 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <ChartBar className="h-12 w-12 text-blue-600 mx-auto" />
                      <p className="text-blue-700 font-medium">Interactive Chart Area</p>
                      <p className="text-sm text-blue-600">Patient volume visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Wait Time Analysis</CardTitle>
                  <CardDescription>Average wait times by department and time of day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Clock className="h-12 w-12 text-orange-600 mx-auto" />
                      <p className="text-orange-700 font-medium">Wait Time Heatmap</p>
                      <p className="text-sm text-orange-600">Performance optimization data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance Summary</CardTitle>
                <CardDescription>Key performance indicators and benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-600">98.5%</div>
                    <p className="text-sm text-slate-600">Appointment Attendance Rate</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-blue-600">12.3m</div>
                    <p className="text-sm text-slate-600">Average Consultation Time</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-purple-600">87%</div>
                    <p className="text-sm text-slate-600">Resource Utilization Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Patient Flow by Hour</CardTitle>
                  <CardDescription>Daily patient distribution and peak hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Users className="h-12 w-12 text-green-600 mx-auto" />
                      <p className="text-green-700 font-medium">Patient Flow Chart</p>
                      <p className="text-sm text-green-600">Hourly distribution analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Department Utilization</CardTitle>
                  <CardDescription>Patient visits by department and specialty</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>General Medicine</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Pediatrics</span>
                        <span>28%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Cardiology</span>
                        <span>15%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Orthopedics</span>
                        <span>12%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Room Utilization</CardTitle>
                  <CardDescription>Occupancy rates and efficiency metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Activity className="h-12 w-12 text-purple-600 mx-auto" />
                      <p className="text-purple-700 font-medium">Room Usage Analytics</p>
                      <p className="text-sm text-purple-600">Occupancy and turnover data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Equipment Performance</CardTitle>
                  <CardDescription>Usage statistics and maintenance schedules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium">X-Ray Machines</span>
                      <Badge variant="outline" className="bg-green-100 text-green-700">95% Uptime</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium">MRI Scanner</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700">87% Utilized</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium">Lab Equipment</span>
                      <Badge variant="outline" className="bg-orange-100 text-orange-700">Maintenance Due</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium">Ultrasound Units</span>
                      <Badge variant="outline" className="bg-green-100 text-green-700">92% Uptime</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6">
            <Card className="ai-glow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <CardTitle>AI-Powered Analytics</CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">Advanced</Badge>
                </div>
                <CardDescription>
                  Machine learning insights and predictive analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Optimization Results</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-900">Wait Time Reduction</span>
                          <span className="text-lg font-bold text-green-700">-23%</span>
                        </div>
                        <p className="text-xs text-green-700 mt-1">Through intelligent scheduling</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-900">Resource Efficiency</span>
                          <span className="text-lg font-bold text-blue-700">+18%</span>
                        </div>
                        <p className="text-xs text-blue-700 mt-1">Optimal room allocation</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-purple-900">Patient Satisfaction</span>
                          <span className="text-lg font-bold text-purple-700">+12%</span>
                        </div>
                        <p className="text-xs text-purple-700 mt-1">Enhanced care coordination</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Predictive Insights</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-start space-x-2">
                          <Brain className="h-4 w-4 text-orange-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-orange-900">Peak Hours Forecast</p>
                            <p className="text-xs text-orange-700">Tomorrow: Heavy load 2-4 PM</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start space-x-2">
                          <Brain className="h-4 w-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-900">Equipment Maintenance</p>
                            <p className="text-xs text-red-700">MRI Scanner service due in 5 days</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div className="flex items-start space-x-2">
                          <Brain className="h-4 w-4 text-indigo-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-indigo-900">Staffing Optimization</p>
                            <p className="text-xs text-indigo-700">Consider +1 nurse for Friday shifts</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Analytics;
