
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Activity, 
  Brain, 
  AlertCircle, 
  Heart,
  FileText,
  Upload,
  MessageSquare
} from "lucide-react";

interface PatientDetailsPanelProps {
  patient: any;
}

const PatientDetailsPanel = ({ patient }: PatientDetailsPanelProps) => {
  // Fetch medical records for the patient
  const { data: medicalRecords = [] } = useQuery({
    queryKey: ['medical-records', patient.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          *,
          doctor:users!medical_records_doctor_id_fkey(first_name, last_name),
          appointment:appointments(*)
        `)
        .eq('patient_id', patient.id)
        .order('visit_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching medical records:', error);
        return [];
      }
      
      return data;
    }
  });

  // Fetch AI insights for the patient
  const { data: aiInsights = [] } = useQuery({
    queryKey: ['ai-insights', patient.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('target_entity_type', 'patient')
        .eq('target_entity_id', patient.id)
        .eq('is_implemented', false)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching AI insights:', error);
        return [];
      }
      
      return data;
    }
  });

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Details</CardTitle>
        <CardDescription>
          {patient.user?.first_name} {patient.user?.last_name} • ID: {patient.patient_id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="ai">AI Insights</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{patient.user?.phone || 'No phone number'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{patient.user?.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Age: {calculateAge(patient.date_of_birth)} ({formatDate(patient.date_of_birth)})</span>
              </div>
              {patient.gender && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="w-4 h-4 text-slate-400">👤</span>
                  <span>Gender: {patient.gender}</span>
                </div>
              )}
              {patient.blood_type && (
                <div className="flex items-center space-x-2 text-sm">
                  <Heart className="h-4 w-4 text-slate-400" />
                  <span>Blood Type: {patient.blood_type}</span>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Medical Information</h4>
              
              {patient.primary_doctor && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-slate-600">Primary Doctor:</span>
                  <span className="ml-2 text-sm">Dr. {patient.primary_doctor.first_name} {patient.primary_doctor.last_name}</span>
                </div>
              )}
              
              {patient.allergies && patient.allergies.length > 0 && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-red-600">Allergies:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.allergies.map((allergy: string) => (
                      <Badge key={allergy} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {patient.current_medications && patient.current_medications.length > 0 && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-blue-600">Current Medications:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.current_medications.map((medication: string) => (
                      <Badge key={medication} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {medication}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Emergency Contact & Insurance */}
            {(patient.emergency_contact_name || patient.insurance_provider) && (
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Emergency & Insurance</h4>
                {patient.emergency_contact_name && (
                  <div className="text-sm mb-2">
                    <span className="font-medium">Emergency Contact:</span>
                    <span className="ml-2">{patient.emergency_contact_name}</span>
                    {patient.emergency_contact_phone && (
                      <span className="ml-2 text-slate-500">({patient.emergency_contact_phone})</span>
                    )}
                  </div>
                )}
                {patient.insurance_provider && (
                  <div className="text-sm">
                    <span className="font-medium">Insurance:</span>
                    <span className="ml-2">{patient.insurance_provider}</span>
                    {patient.insurance_policy_number && (
                      <span className="ml-2 text-slate-500">#{patient.insurance_policy_number}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4 mt-4">
            {medicalRecords.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No medical records found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {medicalRecords.map((record) => (
                  <div key={record.id} className="border-l-2 border-blue-200 pl-3 pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{formatDate(record.visit_date)}</p>
                      {record.doctor && (
                        <Badge variant="outline" className="text-xs">
                          Dr. {record.doctor.first_name} {record.doctor.last_name}
                        </Badge>
                      )}
                    </div>
                    
                    {record.chief_complaint && (
                      <p className="text-sm text-slate-600 mb-1">
                        <span className="font-medium">Chief Complaint:</span> {record.chief_complaint}
                      </p>
                    )}
                    
                    {record.diagnosis && record.diagnosis.length > 0 && (
                      <div className="text-sm mb-1">
                        <span className="font-medium">Diagnosis:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {record.diagnosis.map((diag: string) => (
                            <Badge key={diag} variant="secondary" className="text-xs">
                              {diag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {record.medications_prescribed && record.medications_prescribed.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">Medications:</span>
                        <span className="ml-1 text-slate-600">
                          {record.medications_prescribed.join(', ')}
                        </span>
                      </div>
                    )}
                    
                    {record.notes && (
                      <p className="text-xs text-slate-500 mt-2 italic">{record.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4 mt-4">
            {aiInsights.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Brain className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No AI insights available yet.</p>
                <p className="text-sm mt-2">AI recommendations will appear here based on patient data analysis.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">{insight.title}</p>
                        {insight.description && (
                          <p className="text-xs text-blue-700 mt-1">{insight.description}</p>
                        )}
                        {insight.recommendations && insight.recommendations.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-blue-800">Recommendations:</p>
                            <ul className="text-xs text-blue-700 mt-1 list-disc list-inside">
                              {insight.recommendations.map((rec: string, index: number) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {insight.confidence_score && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              Confidence: {Math.round(insight.confidence_score * 100)}%
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Button variant="outline" className="w-full">
              <Brain className="w-4 h-4 mr-2" />
              Generate AI Insights
            </Button>
          </TabsContent>
          
          <TabsContent value="files" className="space-y-4 mt-4">
            <div className="text-center py-8 text-slate-500">
              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No files uploaded yet.</p>
              <Button variant="outline" className="mt-4">
                <Upload className="w-4 h-4 mr-2" />
                Upload Medical Files
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Appointment
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDetailsPanel;
