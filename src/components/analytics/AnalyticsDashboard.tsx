
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from "react-day-picker";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar as CalendarIcon,
  Download,
  Brain,
  Activity,
  Clock,
  DollarSign
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AnalyticsDashboard: React.FC = () => {
  const { 
    analyticsData, 
    performanceMetrics, 
    loading, 
    fetchAnalyticsData, 
    fetchPerformanceMetrics,
    generateAIInsights,
    exportAnalyticsReport
  } = useAnalytics();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
    fetchPerformanceMetrics();
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    const insightsData = await generateAIInsights('dashboard');
    if (insightsData) {
      setInsights(insightsData.insights || []);
    }
  };

  const handleExportReport = async (format: 'csv' | 'pdf') => {
    const filters = {
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      department: selectedDepartment !== 'all' ? selectedDepartment : undefined,
      dateRange: dateRange ? {
        start: format(dateRange.from!, 'yyyy-MM-dd'),
        end: format(dateRange.to!, 'yyyy-MM-dd')
      } : undefined
    };

    const report = await exportAnalyticsReport(format, filters);
    if (report?.url) {
      window.open(report.url, '_blank');
    }
  };

  const keyMetrics = [
    {
      title: 'Total Patients',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Appointments Today',
      value: '89',
      change: '+5%',
      trend: 'up',
      icon: CalendarIcon,
      color: 'text-green-600'
    },
    {
      title: 'Avg Wait Time',
      value: '18 min',
      change: '-8%',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-purple-600'
    }
  ];

  const patientFlowData = analyticsData
    .filter(d => d.metric_category === 'patient_flow')
    .slice(0, 7)
    .map(d => ({
      date: format(new Date(d.date_recorded), 'MMM dd'),
      patients: d.value,
      appointments: Math.floor(d.value * 0.8)
    }));

  const departmentPerformance = performanceMetrics
    .filter(m => m.department)
    .reduce((acc: any, metric) => {
      const dept = metric.department!;
      if (!acc[dept]) {
        acc[dept] = { department: dept, efficiency: 0, satisfaction: 0 };
      }
      if (metric.metric_name.includes('efficiency')) {
        acc[dept].efficiency = metric.metric_value;
      }
      if (metric.metric_name.includes('satisfaction')) {
        acc[dept].satisfaction = metric.metric_value;
      }
      return acc;
    }, {});

  const resourceUtilization = [
    { name: 'Exam Rooms', value: 85, color: '#0088FE' },
    { name: 'Equipment', value: 72, color: '#00C49F' },
    { name: 'Staff', value: 91, color: '#FFBB28' },
    { name: 'Labs', value: 67, color: '#FF8042' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            Real-time dashboard with AI-powered insights and performance analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleExportReport('csv')}
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleExportReport('pdf')}
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.change.startsWith('+');
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendIcon className={`h-3 w-3 mr-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
                  {metric.change} from last month
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Insights Panel */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Insights & Recommendations
            </CardTitle>
            <CardDescription>
              Machine learning-powered insights to optimize your operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.slice(0, 3).map((insight, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {insight.description}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {Math.round(insight.confidence_score * 100)}% confidence
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patient-flow">Patient Flow</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Volume Trends</CardTitle>
                <CardDescription>Daily patient visits over the last week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={patientFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="patients" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>Current utilization across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={resourceUtilization}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {resourceUtilization.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patient-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Flow Analysis</CardTitle>
              <CardDescription>Predictive modeling for patient volume and wait times</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={patientFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="patients" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Patient Visits"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Scheduled Appointments"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Efficiency and satisfaction metrics by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={Object.values(departmentPerformance)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="efficiency" fill="#8884d8" name="Efficiency %" />
                  <Bar dataKey="satisfaction" fill="#82ca9d" name="Satisfaction %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Status</CardTitle>
                <CardDescription>Real-time equipment availability and usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">MRI Scanner</span>
                    <Badge variant="default">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CT Scanner</span>
                    <Badge variant="secondary">In Use</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">X-Ray Machine</span>
                    <Badge variant="destructive">Maintenance</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ultrasound</span>
                    <Badge variant="default">Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Energy Efficiency</CardTitle>
                <CardDescription>Power consumption and cost optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Usage</span>
                    <span className="font-medium">2,450 kWh</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly Cost</span>
                    <span className="font-medium">$3,675</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Efficiency Score</span>
                    <Badge variant="default">85%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Potential Savings</span>
                    <span className="font-medium text-green-600">$425/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
