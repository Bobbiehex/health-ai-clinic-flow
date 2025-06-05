
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { 
  Search, 
  Plus, 
  Brain, 
  AlertCircle, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  Edit,
  Trash2,
  Filter,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import AddPatientDialog from "@/components/AddPatientDialog";
import EditPatientDialog from "@/components/EditPatientDialog";
import PatientDetailsPanel from "@/components/PatientDetailsPanel";

const PatientManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch patients with user data
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['patients', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('patients')
        .select(`
          *,
          user:users!patients_user_id_fkey(first_name, last_name, email, phone),
          primary_doctor:users!patients_primary_doctor_id_fkey(first_name, last_name)
        `);

      if (searchTerm) {
        query = query.or(`patient_id.ilike.%${searchTerm}%,users.first_name.ilike.%${searchTerm}%,users.last_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to fetch patients');
        return [];
      }
      
      return data;
    }
  });

  // Delete patient mutation
  const deletePatientMutation = useMutation({
    mutationFn: async (patientId: string) => {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Patient deleted successfully');
      if (selectedPatientId) {
        setSelectedPatientId(null);
      }
    },
    onError: (error) => {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient');
    }
  });

  const handleEditPatient = (patient: any) => {
    setEditingPatient(patient);
    setIsEditDialogOpen(true);
  };

  const handleDeletePatient = (patientId: string) => {
    if (confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      deletePatientMutation.mutate(patientId);
    }
  };

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

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Patient Management</h1>
            <p className="text-slate-600">Manage patient records with AI-powered insights</p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="healthcare-gradient text-white"
          >
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
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
                  {patients.length} patients • Real-time data from database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">Loading patients...</div>
                ) : patients.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    {searchTerm ? 'No patients found matching your search.' : 'No patients registered yet.'}
                  </div>
                ) : (
                  patients.map((patient) => (
                    <Card 
                      key={patient.id} 
                      className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${
                        selectedPatientId === patient.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedPatientId(patient.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {patient.user?.first_name?.[0]}{patient.user?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {patient.user?.first_name} {patient.user?.last_name}
                            </h3>
                            <p className="text-sm text-slate-600">
                              Age {calculateAge(patient.date_of_birth)} • ID: {patient.patient_id}
                            </p>
                            <p className="text-xs text-slate-500">
                              Primary Doctor: {patient.primary_doctor?.first_name} {patient.primary_doctor?.last_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-green-100 text-green-700">
                            Active
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPatient(patient);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePatient(patient.id);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Medical Info Preview */}
                      {(patient.allergies?.length > 0 || patient.current_medications?.length > 0) && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {patient.allergies?.length > 0 && (
                              <div>
                                <span className="font-medium text-red-600">Allergies:</span>
                                <span className="ml-1 text-slate-600">
                                  {patient.allergies.slice(0, 2).join(', ')}
                                  {patient.allergies.length > 2 && '...'}
                                </span>
                              </div>
                            )}
                            {patient.current_medications?.length > 0 && (
                              <div>
                                <span className="font-medium text-blue-600">Medications:</span>
                                <span className="ml-1 text-slate-600">
                                  {patient.current_medications.slice(0, 2).join(', ')}
                                  {patient.current_medications.length > 2 && '...'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Patient Details Panel */}
          <div className="space-y-6">
            {selectedPatient ? (
              <PatientDetailsPanel patient={selectedPatient} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Patient Details</CardTitle>
                  <CardDescription>Select a patient to view details</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Click on a patient from the list to view their detailed information and medical history.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Dialogs */}
        <AddPatientDialog 
          open={isAddDialogOpen} 
          onOpenChange={setIsAddDialogOpen}
        />
        
        {editingPatient && (
          <EditPatientDialog 
            open={isEditDialogOpen} 
            onOpenChange={setIsEditDialogOpen}
            patient={editingPatient}
          />
        )}
      </div>
    </Layout>
  );
};

export default PatientManagement;
