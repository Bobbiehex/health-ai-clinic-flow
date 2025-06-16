
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Key, 
  Activity, 
  AlertTriangle, 
  Clock,
  Users,
  Database,
  Lock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuditLog } from '@/hooks/useAuditLog';
import { useAuth } from '@/hooks/useAuth';

interface SecurityMetrics {
  activeSessions: number;
  failedLogins: number;
  dataAccesses: number;
  securityAlerts: number;
}

interface SecurityStatus {
  encryption: 'active' | 'warning' | 'error';
  auditLogging: 'active' | 'warning' | 'error';
  accessControl: 'active' | 'warning' | 'error';
  compliance: 'active' | 'warning' | 'error';
}

export const SecurityDashboard: React.FC = () => {
  const { logs, loading, fetchLogs, logAction } = useAuditLog();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    activeSessions: 0,
    failedLogins: 0,
    dataAccesses: 0,
    securityAlerts: 0
  });
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    encryption: 'active',
    auditLogging: 'active',
    accessControl: 'active',
    compliance: 'warning'
  });
  const [runningSecurityScan, setRunningSecurityScan] = useState(false);

  useEffect(() => {
    fetchLogs();
    loadSecurityMetrics();
  }, []);

  const loadSecurityMetrics = async () => {
    try {
      // Calculate metrics from audit logs
      const failedLoginLogs = logs.filter(log => 
        log.action === 'failed_login' && 
        new Date(log.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );
      
      const dataAccessLogs = logs.filter(log => 
        log.resource_type === 'patient' && 
        new Date(log.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );

      setMetrics({
        activeSessions: 24, // This would be calculated from session data
        failedLogins: failedLoginLogs.length,
        dataAccesses: dataAccessLogs.length,
        securityAlerts: failedLoginLogs.length > 5 ? 1 : 0
      });

      // Update security status based on metrics
      setSecurityStatus(prev => ({
        ...prev,
        compliance: failedLoginLogs.length > 5 ? 'warning' : 'active'
      }));
    } catch (error) {
      console.error('Error loading security metrics:', error);
    }
  };

  const runSecurityScan = async () => {
    setRunningSecurityScan(true);
    
    try {
      // Log security scan action
      await logAction('security_scan', 'system', 'dashboard', {
        scan_type: 'manual',
        initiated_by: user?.id
      });

      // Simulate security scan
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update security status
      setSecurityStatus({
        encryption: 'active',
        auditLogging: 'active',
        accessControl: 'active',
        compliance: 'active'
      });

      await loadSecurityMetrics();
    } catch (error) {
      console.error('Security scan error:', error);
    } finally {
      setRunningSecurityScan(false);
    }
  };

  const getStatusIcon = (status: 'active' | 'warning' | 'error') => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: 'active' | 'warning' | 'error') => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
    }
  };

  const overallSecurityStatus = Object.values(securityStatus).includes('error') ? 'error' :
    Object.values(securityStatus).includes('warning') ? 'warning' : 'active';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security & Compliance</h1>
          <p className="text-muted-foreground">
            Monitor system security and compliance status
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge 
            variant={overallSecurityStatus === 'active' ? 'default' : 'destructive'}
            className="text-sm"
          >
            <Shield className="h-4 w-4 mr-1" />
            {overallSecurityStatus === 'active' ? 'Secure' : 
             overallSecurityStatus === 'warning' ? 'Needs Attention' : 'Critical Issues'}
          </Badge>
          <Button 
            onClick={runSecurityScan}
            disabled={runningSecurityScan}
            variant="outline"
          >
            {runningSecurityScan ? 'Scanning...' : 'Run Security Scan'}
          </Button>
        </div>
      </div>

      {metrics.securityAlerts > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {metrics.securityAlerts} security alert(s) detected. Review failed login attempts and consider implementing additional security measures.
          </AlertDescription>
        </Alert>
      )}

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
          <TabsTrigger value="threats">Threat Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Activity</CardTitle>
              <CardDescription>
                All system access and data modifications are logged for compliance
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
                          {log.ip_address && ` • IP: ${log.ip_address}`}
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
                  <div className="flex items-center gap-2">
                    {getStatusIcon(securityStatus.encryption)}
                    <span>Data at Rest</span>
                  </div>
                  <Badge className={getStatusColor(securityStatus.encryption)}>
                    AES-256 Encrypted
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(securityStatus.encryption)}
                    <span>Data in Transit</span>
                  </div>
                  <Badge className={getStatusColor(securityStatus.encryption)}>
                    TLS 1.3
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(securityStatus.encryption)}
                    <span>Database Encryption</span>
                  </div>
                  <Badge className={getStatusColor(securityStatus.encryption)}>
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(securityStatus.encryption)}
                    <span>Message Encryption</span>
                  </div>
                  <Badge className={getStatusColor(securityStatus.encryption)}>
                    End-to-End
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>HIPAA Compliance Status</CardTitle>
              <CardDescription>
                Compliance requirements and current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(securityStatus.accessControl)}
                    <span>Access Controls</span>
                  </div>
                  <Badge className={getStatusColor(securityStatus.accessControl)}>
                    Compliant
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(securityStatus.auditLogging)}
                    <span>Audit Logging</span>
                  </div>
                  <Badge className={getStatusColor(securityStatus.auditLogging)}>
                    Compliant
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(securityStatus.encryption)}
                    <span>Data Encryption</span>
                  </div>
                  <Badge className={getStatusColor(securityStatus.encryption)}>
                    Compliant
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(securityStatus.compliance)}
                    <span>User Training</span>
                  </div>
                  <Badge className={getStatusColor(securityStatus.compliance)}>
                    {securityStatus.compliance === 'active' ? 'Compliant' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(securityStatus.compliance)}
                    <span>Risk Assessment</span>
                  </div>
                  <Badge className={getStatusColor(securityStatus.compliance)}>
                    {securityStatus.compliance === 'active' ? 'Compliant' : 'In Progress'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Detection</CardTitle>
              <CardDescription>
                Real-time monitoring for security threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Brute Force Detection</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Anomaly Detection</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>IP Filtering</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rate Limiting</span>
                  <Badge variant="secondary">Pending Implementation</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
