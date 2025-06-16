
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface PerformanceTabProps {
  departmentPerformance: Array<{
    department: string;
    efficiency: number;
    satisfaction: number;
  }>;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({ departmentPerformance }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Performance</CardTitle>
        <CardDescription>Efficiency and satisfaction metrics by department</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={departmentPerformance}>
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
  );
};
