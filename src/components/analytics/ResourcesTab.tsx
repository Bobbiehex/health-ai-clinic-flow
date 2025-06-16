
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ResourcesTab: React.FC = () => {
  return (
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
  );
};
