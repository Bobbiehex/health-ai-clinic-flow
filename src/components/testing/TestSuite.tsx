
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  Pause, 
  RefreshCw,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration: number;
  error?: string;
  category: string;
}

export const TestSuite: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const mockTests: TestResult[] = [
    {
      id: '1',
      name: 'User Authentication Flow',
      status: 'passed',
      duration: 1250,
      category: 'Authentication'
    },
    {
      id: '2',
      name: 'Patient Registration',
      status: 'passed',
      duration: 890,
      category: 'Patient Management'
    },
    {
      id: '3',
      name: 'Appointment Scheduling',
      status: 'failed',
      duration: 2100,
      error: 'Validation error: End time must be after start time',
      category: 'Appointments'
    },
    {
      id: '4',
      name: 'Medical Records Access',
      status: 'passed',
      duration: 1450,
      category: 'Medical Records'
    },
    {
      id: '5',
      name: 'Chat Functionality',
      status: 'running',
      duration: 0,
      category: 'Communication'
    },
    {
      id: '6',
      name: 'Real-time Notifications',
      status: 'pending',
      duration: 0,
      category: 'Notifications'
    },
    {
      id: '7',
      name: 'Data Export Features',
      status: 'passed',
      duration: 3200,
      category: 'Analytics'
    },
    {
      id: '8',
      name: 'Security Compliance',
      status: 'passed',
      duration: 1800,
      category: 'Security'
    }
  ];

  useEffect(() => {
    setTests(mockTests);
  }, []);

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const updatedTests = tests.map(test => ({
      ...test,
      status: 'running' as const,
      duration: 0
    }));
    setTests(updatedTests);

    // Simulate test execution
    for (let i = 0; i < tests.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProgress(((i + 1) / tests.length) * 100);
      
      setTests(prev => prev.map((test, index) => {
        if (index === i) {
          return {
            ...test,
            status: Math.random() > 0.8 ? 'failed' : 'passed',
            duration: Math.floor(Math.random() * 3000) + 500
          };
        }
        return test;
      }));
    }

    setIsRunning(false);
    toast({
      title: 'Test Suite Complete',
      description: 'All tests have finished running',
    });
  };

  const runSingleTest = async (testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, status: 'running', duration: 0 }
        : test
    ));

    await new Promise(resolve => setTimeout(resolve, 1000));

    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { 
            ...test, 
            status: Math.random() > 0.7 ? 'failed' : 'passed',
            duration: Math.floor(Math.random() * 3000) + 500
          }
        : test
    ));
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      running: 'secondary',
      pending: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const passedTests = tests.filter(t => t.status === 'passed').length;
  const failedTests = tests.filter(t => t.status === 'failed').length;
  const totalTests = tests.length;

  const testsByCategory = tests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, TestResult[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Test Suite & Quality Assurance</h1>
          <p className="text-muted-foreground">
            Comprehensive testing dashboard for all application features
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            variant="default"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Test Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground">
              Across {Object.keys(testsByCategory).length} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{passedTests}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((passedTests / totalTests) * 100)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedTests}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              Code coverage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Running tests...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tests</TabsTrigger>
          {Object.keys(testsByCategory).map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Complete overview of all test executions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tests.map((test) => (
                  <div 
                    key={test.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <h4 className="font-medium">{test.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {test.category} • {test.duration > 0 ? `${test.duration}ms` : 'Not run'}
                        </p>
                        {test.error && (
                          <p className="text-sm text-red-600 mt-1">{test.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(test.status)}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runSingleTest(test.id)}
                        disabled={isRunning || test.status === 'running'}
                      >
                        Rerun
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {Object.entries(testsByCategory).map(([category, categoryTests]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{category} Tests</CardTitle>
                <CardDescription>
                  {categoryTests.length} tests in this category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryTests.map((test) => (
                    <div 
                      key={test.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <div>
                          <h4 className="font-medium">{test.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {test.duration > 0 ? `${test.duration}ms` : 'Not run'}
                          </p>
                          {test.error && (
                            <p className="text-sm text-red-600 mt-1">{test.error}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(test.status)}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runSingleTest(test.id)}
                          disabled={isRunning || test.status === 'running'}
                        >
                          Rerun
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
