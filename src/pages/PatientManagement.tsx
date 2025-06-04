
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Brain, 
  AlertCircle, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity
} from "lucide-react";

const PatientManagement = () => {
  const patients = [
    {
      id: 1,
      name: "Emily Johnson",
      age: 34,
      condition: "Hypertension",
      lastVisit: "2024-06-01",
      status: "stable",
      aiSuggestion: "Schedule follow-up in 3 months"
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 45,
      condition: "Diabetes Type 2",
      lastVisit: "2024-05-28",
      status: "needs-attention",
      aiSuggestion: "Blood sugar monitoring recommended"
    },
    {
      id: 3,
      name: "Sarah Williams",
      age: 28,
      condition: "Pregnancy Checkup",
      lastVisit: "2024-06-03",
      status: "stable",
      aiSuggestion: "Next prenatal visit in 4 weeks"
    }
  ];

  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Patient Management</h1>
            <p className="text-slate-600">Manage patient records with AI-powered insights</p>
          </div>
          <Button className="healthcare-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Patient
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input 
                  placeholder="Search patients by name, ID, or condition..." 
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Sort</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Records</CardTitle>
                <CardDescription>
                  {patients.length} patients • AI recommendations available
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {patients.map((patient) => (
                  <Card key={patient.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-slate-900">{patient.name}</h3>
                          <p className="text-sm text-slate-600">Age {patient.age} • {patient.condition}</p>
                          <p className="text-xs text-slate-500">Last visit: {patient.lastVisit}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={patient.status === 'stable' ? 'default' : 'destructive'}
                          className={patient.status === 'stable' ? 'bg-green-100 text-green-700' : ''}
                        >
                          {patient.status === 'stable' ? 'Stable' : 'Needs Attention'}
                        </Badge>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                    
                    {/* AI Suggestion */}
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-2">
                        <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">AI Recommendation</p>
                          <p className="text-xs text-blue-700">{patient.aiSuggestion}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Patient Details Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Selected Patient</CardTitle>
                <CardDescription>Emily Johnson</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="ai">AI Insights</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>emily.johnson@email.com</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>123 Main St, City, State</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>DOB: March 15, 1990</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Current Conditions</h4>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        Hypertension
                      </Badge>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div className="border-l-2 border-blue-200 pl-3">
                        <p className="text-sm font-medium">June 1, 2024</p>
                        <p className="text-xs text-slate-600">Routine checkup - Blood pressure stable</p>
                      </div>
                      <div className="border-l-2 border-blue-200 pl-3">
                        <p className="text-sm font-medium">March 15, 2024</p>
                        <p className="text-xs text-slate-600">Hypertension diagnosis - Started medication</p>
                      </div>
                      <div className="border-l-2 border-blue-200 pl-3">
                        <p className="text-sm font-medium">January 8, 2024</p>
                        <p className="text-xs text-slate-600">Annual physical - Elevated BP detected</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ai" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start space-x-2">
                          <Activity className="h-4 w-4 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-green-900">Treatment Adherence</p>
                            <p className="text-xs text-green-700">94% medication compliance rate</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start space-x-2">
                          <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">Risk Assessment</p>
                            <p className="text-xs text-blue-700">Low risk for complications</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-orange-900">Recommendation</p>
                            <p className="text-xs text-orange-700">Schedule follow-up in 3 months</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientManagement;
