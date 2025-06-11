
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Key, 
  Activity, 
  AlertTriangle, 
  Clock,
  Users,
  Database,
  Lock
} from 'lucide-react';
import { useAuditLog } from '@/hooks/useAuditLog';

interface SecurityMetrics {
  activeSessions: number;
  failedLogins: number;
  dataAccesses: number;
  securityAlerts: number;
}

export const SecurityDashboard: React.FC = () => {
  const { logs, loading, fetchLogs } = useAuditLog();
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    activeSessions: 0,
    failedLogins: 0,
    dataAccesses: 0,
    securityAlerts: 0
  });

  useEffect(() => {
    fetchLogs();
    // Simulate fetching security metrics
    setMetrics({
      activeSessions: 24,
      failedLogins: 3,
      dataAccesses: 156,
      securityAlerts: 1
    });
  }, []);

  const securityStatus = metrics.securityAlerts === 0 ? 'secure' : 'warning';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security & Compliance</h1>
          <p className="text-muted-foreground">
            Monitor system security and compliance status
          </p>
        </div>
        <Badge 
          variant={securityStatus === 'secure' ? 'default' : 'destructive'}
          className="text-sm"
        >
          <Shield className="h-4 w-4 mr-1" />
          {securityStatus === 'secure' ? 'Secure' : 'Alerts Present'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              Currently logged in users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.failedLogins}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Accesses</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.dataAccesses}</div>
            <p className="text-xs text-muted-foreground">
              Medical records accessed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.securityAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="encryption">Encryption Status</TabsTrigger>
          <TabsTrigger value="compliance">HIPAA Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Activity</CardTitle>
              <CardDescription>
                All system access and data modifications are logged
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <p>Loading audit logs...</p>
                ) : logs.length > 0 ? (
                  logs.slice(0, 10).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.resource_type} • {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">{log.resource_type}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No audit logs available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Encryption Status
              </CardTitle>
              <CardDescription>
                Data encryption and security measures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Data at Rest</span>
                  <Badge variant="default">AES-256 Encrypted</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Data in Transit</span>
                  <Badge variant="default">TLS 1.3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Database Encryption</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Backup Encryption</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>HIPAA Compliance Checklist</CardTitle>
              <CardDescription>
                Compliance requirements and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Access Controls</span>
                  <Badge variant="default">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Audit Logging</span>
                  <Badge variant="default">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Encryption</span>
                  <Badge variant="default">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>User Training</span>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Risk Assessment</span>
                  <Badge variant="default">Compliant</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
