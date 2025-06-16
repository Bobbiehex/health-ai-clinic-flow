
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface PatientFlowTabProps {
  patientFlowData: Array<{
    date: string;
    patients: number;
    appointments: number;
  }>;
}

export const PatientFlowTab: React.FC<PatientFlowTabProps> = ({ patientFlowData }) => {
  return (
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
  );
};
