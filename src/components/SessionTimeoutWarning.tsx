
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock } from 'lucide-react';
import { useSessionManagement } from '@/hooks/useSessionManagement';

export const SessionTimeoutWarning: React.FC = () => {
  const { showTimeoutWarning, timeRemaining, extendSession } = useSessionManagement();

  if (!showTimeoutWarning) {
    return null;
  }

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Session Expiring Soon
          </CardTitle>
          <CardDescription>
            Your session will expire due to inactivity for security purposes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-2xl font-mono">
            <Clock className="h-6 w-6 text-amber-600" />
            <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Click "Stay Logged In" to continue your session, or you will be automatically logged out.
          </div>
          
          <div className="flex gap-2">
            <Button onClick={extendSession} className="flex-1">
              Stay Logged In
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => window.location.href = '/login'}>
              Log Out Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
