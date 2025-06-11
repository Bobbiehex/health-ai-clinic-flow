
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, FileText, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const HIPAACompliancePanel: React.FC = () => {
  const [auditInProgress, setAuditInProgress] = useState(false);
  const { toast } = useToast();

  const runComplianceAudit = async () => {
    setAuditInProgress(true);
    // Simulate audit process
    setTimeout(() => {
      setAuditInProgress(false);
      toast({
        title: 'Compliance Audit Complete',
        description: 'All HIPAA requirements are being met'
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            HIPAA Compliance Status
          </CardTitle>
          <CardDescription>
            Monitor and maintain HIPAA compliance across all systems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-600" />
                <span className="text-sm">Data Encryption</span>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-600" />
                <span className="text-sm">Access Logging</span>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Audit Trail</span>
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Monitoring</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Risk Assessment</span>
              </div>
              <Badge variant="outline" className="bg-orange-100 text-orange-800">Pending</Badge>
            </div>
          </div>
          
          <Button 
            onClick={runComplianceAudit}
            disabled={auditInProgress}
            className="w-full md:w-auto"
          >
            {auditInProgress ? 'Running Audit...' : 'Run Compliance Audit'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
