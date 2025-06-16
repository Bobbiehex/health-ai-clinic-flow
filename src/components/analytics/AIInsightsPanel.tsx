
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

interface AIInsight {
  title: string;
  description: string;
  confidence_score: number;
}

interface AIInsightsPanelProps {
  insights: AIInsight[];
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insights }) => {
  if (insights.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Insights & Recommendations
        </CardTitle>
        <CardDescription>
          Machine learning-powered insights to optimize your operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.slice(0, 3).map((insight, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                </div>
                <Badge variant="secondary">
                  {Math.round(insight.confidence_score * 100)}% confidence
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
