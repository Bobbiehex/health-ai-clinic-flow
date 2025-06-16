
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar as CalendarIcon,
  Clock,
  DollarSign
} from 'lucide-react';

interface KeyMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: string;
}

export const KeyMetricsGrid: React.FC = () => {
  const keyMetrics: KeyMetric[] = [
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

  return (
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
  );
};
