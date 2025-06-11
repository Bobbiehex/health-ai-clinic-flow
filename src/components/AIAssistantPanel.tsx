
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Stethoscope, AlertTriangle, Pill } from 'lucide-react';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { MobileOptimized } from './MobileOptimized';

interface AIAssistantPanelProps {
  patientId?: string;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ patientId }) => {
  const { loading, generateMedicalInsights, generatePatientSummary } = useAIAssistant();
  const [insights, setInsights] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>('');

  const handleDiagnosisAssistance = async () => {
    const result = await generateMedicalInsights({
      patientId,
      queryType: 'diagnosis_assistance',
      context: 'General diagnostic assistance requested'
    });
    
    if (result.success) {
      setInsights(result.insights || []);
    }
  };

  const handleRiskAssessment = async () => {
    const result = await generateMedicalInsights({
      patientId,
      queryType: 'risk_assessment',
      context: 'Risk assessment for current patient'
    });
    
    if (result.success) {
      setInsights(result.insights || []);
    }
  };

  const handleDrugInteractions = async () => {
    const result = await generateMedicalInsights({
      patientId,
      queryType: 'drug_interactions',
      context: 'Check for potential drug interactions'
    });
    
    if (result.success) {
      setInsights(result.insights || []);
    }
  };

  const handleGenerateSummary = async () => {
    if (!patientId) return;
    
    const result = await generatePatientSummary(patientId);
    if (result.success) {
      setSummary(result.summary || 'Summary generated successfully');
    }
  };

  return (
    <MobileOptimized
      mobileClassName="space-y-4"
      desktopClassName="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Medical Assistant
          </CardTitle>
          <CardDescription>
            Get AI-powered insights and recommendations for patient care
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={handleDiagnosisAssistance}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
            >
              <Stethoscope className="h-4 w-4" />
              <span className="text-sm">Diagnosis Assistance</span>
            </Button>
            
            <Button
              onClick={handleRiskAssessment}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Risk Assessment</span>
            </Button>
            
            <Button
              onClick={handleDrugInteractions}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
            >
              <Pill className="h-4 w-4" />
              <span className="text-sm">Drug Interactions</span>
            </Button>
            
            <Button
              onClick={handleGenerateSummary}
              disabled={loading || !patientId}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
            >
              <Brain className="h-4 w-4" />
              <span className="text-sm">Generate Summary</span>
            </Button>
          </div>

          {insights.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">AI Insights</h4>
              {insights.map((insight, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{insight.type}</Badge>
                    <Badge variant="secondary">
                      {Math.round(insight.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm">{insight.suggestion}</p>
                  {insight.recommendations && (
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {insight.recommendations.map((rec: string, recIndex: number) => (
                        <li key={recIndex}>{rec}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {summary && (
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Patient Summary</h4>
              <p className="text-sm text-muted-foreground">{summary}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </MobileOptimized>
  );
};
