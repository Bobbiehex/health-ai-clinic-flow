
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, Zap, Settings } from 'lucide-react';
import { useResourceAlerts } from '@/hooks/useResourceManagement';

const ResourceAlerts = () => {
  const { alerts, isLoading, resolveAlert, generateAlerts } = useResourceAlerts();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'maintenance_due': return <Settings className="h-4 w-4" />;
      case 'equipment_failure': return <AlertTriangle className="h-4 w-4" />;
      case 'energy_threshold': return <Zap className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Resource Alerts</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateAlerts.mutate()}
            disabled={generateAlerts.isPending}
          >
            Generate Alerts
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {alerts && alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getAlertIcon(alert.alert_type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getSeverityColor(alert.severity || 'medium')}>
                          {alert.severity?.toUpperCase() || 'MEDIUM'}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {alert.resource_type} • {new Date(alert.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveAlert.mutate(alert.id)}
                    disabled={resolveAlert.isPending}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p className="text-slate-500">No active alerts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceAlerts;
