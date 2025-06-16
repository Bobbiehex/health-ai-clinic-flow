
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Zap, 
  Database, 
  Clock, 
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history: { time: string; value: number }[];
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const initialMetrics: PerformanceMetric[] = [
    {
      name: 'Page Load Time',
      value: 1.2,
      unit: 'seconds',
      status: 'good',
      trend: 'down',
      history: [
        { time: '12:00', value: 1.5 },
        { time: '12:05', value: 1.3 },
        { time: '12:10', value: 1.2 },
        { time: '12:15', value: 1.1 },
        { time: '12:20', value: 1.2 }
      ]
    },
    {
      name: 'API Response Time',
      value: 250,
      unit: 'ms',
      status: 'good',
      trend: 'stable',
      history: [
        { time: '12:00', value: 280 },
        { time: '12:05', value: 260 },
        { time: '12:10', value: 250 },
        { time: '12:15', value: 245 },
        { time: '12:20', value: 250 }
      ]
    },
    {
      name: 'Memory Usage',
      value: 68,
      unit: '%',
      status: 'warning',
      trend: 'up',
      history: [
        { time: '12:00', value: 55 },
        { time: '12:05', value: 60 },
        { time: '12:10', value: 65 },
        { time: '12:15', value: 67 },
        { time: '12:20', value: 68 }
      ]
    },
    {
      name: 'Database Queries',
      value: 1500,
      unit: 'queries/min',
      status: 'good',
      trend: 'stable',
      history: [
        { time: '12:00', value: 1400 },
        { time: '12:05', value: 1450 },
        { time: '12:10', value: 1500 },
        { time: '12:15', value: 1480 },
        { time: '12:20', value: 1500 }
      ]
    },
    {
      name: 'Error Rate',
      value: 0.05,
      unit: '%',
      status: 'good',
      trend: 'down',
      history: [
        { time: '12:00', value: 0.1 },
        { time: '12:05', value: 0.08 },
        { time: '12:10', value: 0.06 },
        { time: '12:15', value: 0.05 },
        { time: '12:20', value: 0.05 }
      ]
    },
    {
      name: 'Active Users',
      value: 234,
      unit: 'users',
      status: 'good',
      trend: 'up',
      history: [
        { time: '12:00', value: 210 },
        { time: '12:05', value: 220 },
        { time: '12:10', value: 225 },
        { time: '12:15', value: 230 },
        { time: '12:20', value: 234 }
      ]
    }
  ];

  useEffect(() => {
    setMetrics(initialMetrics);
    
    if (isMonitoring) {
      const interval = setInterval(() => {
        setMetrics(prev => prev.map(metric => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * (metric.value * 0.1),
          history: [
            ...metric.history.slice(1),
            {
              time: new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              value: metric.value + (Math.random() - 0.5) * (metric.value * 0.1)
            }
          ]
        })));
        setLastUpdate(new Date());
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getStatusIcon = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
    }
  };

  const getTrendIcon = (trend: PerformanceMetric['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-green-500 rotate-180" />;
      case 'stable':
        return <div className="h-3 w-3 bg-gray-400 rounded-full" />;
    }
  };

  const coreVitals = metrics.slice(0, 3);
  const systemMetrics = metrics.slice(3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Monitor</h1>
          <p className="text-muted-foreground">
            Real-time system performance and optimization metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? (
              <>
                <Activity className="h-4 w-4 mr-2 text-green-600" />
                Monitoring Active
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Start Monitoring
              </>
            )}
          </Button>
          <span className="text-xs text-muted-foreground">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coreVitals.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {getStatusIcon(metric.status)}
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                  {typeof metric.value === 'number' ? metric.value.toFixed(2) : metric.value}
                </div>
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="mt-2">
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart data={metric.history}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={metric.status === 'good' ? '#10b981' : metric.status === 'warning' ? '#f59e0b' : '#ef4444'}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Health Score</CardTitle>
                <CardDescription>Overall system performance rating</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">87</div>
                  <div className="text-sm text-muted-foreground">Performance Score</div>
                </div>
                <Progress value={87} className="w-full" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-green-600">95</div>
                    <div className="text-xs text-muted-foreground">Speed</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-yellow-600">82</div>
                    <div className="text-xs text-muted-foreground">Reliability</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">91</div>
                    <div className="text-xs text-muted-foreground">Efficiency</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>Current system resource usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Disk Usage</span>
                    <span>34%</span>
                  </div>
                  <Progress value={34} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Network I/O</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
              <CardDescription>
                Comprehensive view of all system performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {metrics.map((metric) => (
                  <div key={metric.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{metric.name}</h4>
                        {getStatusIcon(metric.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono ${getStatusColor(metric.status)}`}>
                          {typeof metric.value === 'number' ? metric.value.toFixed(2) : metric.value} {metric.unit}
                        </span>
                        {getTrendIcon(metric.trend)}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={120}>
                      <LineChart data={metric.history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={metric.status === 'good' ? '#10b981' : metric.status === 'warning' ? '#f59e0b' : '#ef4444'}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Optimization</CardTitle>
              <CardDescription>
                Recommendations and actions to improve system performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">Enable Browser Caching</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Implement aggressive caching for static assets to reduce load times by up to 40%
                      </p>
                      <Button size="sm" className="mt-2">Implement</Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">Optimize Database Queries</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add indexes to frequently queried columns to improve response times
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">Review Queries</Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">Implement Lazy Loading</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Load components and data only when needed to reduce initial bundle size
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">Configure</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
