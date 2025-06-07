
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingDown, TrendingUp, Leaf } from 'lucide-react';
import { useEnergyMonitoring } from '@/hooks/useResourceManagement';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EnergyMonitor = () => {
  const { energyData, isLoading } = useEnergyMonitoring();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Group energy data by resource type for summary
  const energySummary = energyData?.reduce((acc: any, reading: any) => {
    const type = reading.resource_type;
    if (!acc[type]) {
      acc[type] = {
        totalConsumption: 0,
        totalCost: 0,
        avgEfficiency: 0,
        readings: 0
      };
    }
    acc[type].totalConsumption += reading.consumption_kwh || 0;
    acc[type].totalCost += reading.cost_usd || 0;
    acc[type].avgEfficiency += reading.efficiency_rating || 0;
    acc[type].readings += 1;
    return acc;
  }, {});

  // Calculate averages
  Object.keys(energySummary || {}).forEach(type => {
    energySummary[type].avgEfficiency = energySummary[type].avgEfficiency / energySummary[type].readings;
  });

  // Prepare chart data (last 7 days)
  const chartData = energyData?.slice(0, 168).reverse().map((reading: any, index: number) => ({
    time: new Date(reading.measurement_timestamp).toLocaleDateString(),
    consumption: reading.consumption_kwh,
    efficiency: reading.efficiency_rating
  })) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span>Energy Consumption Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(energySummary || {}).map(([type, data]: [string, any]) => (
              <div key={type} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">{type}s</h4>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    {data.totalConsumption.toFixed(1)} kWh
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Efficiency</span>
                    <span>{data.avgEfficiency.toFixed(1)}/5.0</span>
                  </div>
                  <Progress value={data.avgEfficiency * 20} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Cost: ${data.totalCost.toFixed(2)}</span>
                    <span>{data.readings} readings</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Energy Usage Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Consumption (kWh)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingDown className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">Energy Savings</p>
                <p className="text-xs text-slate-600">vs last month</p>
                <p className="text-lg font-bold text-green-600">15.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">Carbon Footprint</p>
                <p className="text-xs text-slate-600">reduced this month</p>
                <p className="text-lg font-bold text-emerald-600">127 kg CO₂</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">Peak Efficiency</p>
                <p className="text-xs text-slate-600">highest this week</p>
                <p className="text-lg font-bold text-blue-600">4.7/5.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnergyMonitor;
