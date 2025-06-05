
import Layout from "@/components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import AddPatientDialog from "@/components/AddPatientDialog";
import EditPatientDialog from "@/components/EditPatientDialog";
import PatientHeader from "@/components/PatientHeader";
import PatientSearchAndFilters from "@/components/PatientSearchAndFilters";
import PatientList from "@/components/PatientList";
import PatientDetailsSection from "@/components/PatientDetailsSection";

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

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6">
        <PatientHeader onAddPatient={() => setIsAddDialogOpen(true)} />

        <PatientSearchAndFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <PatientList
              patients={patients}
              isLoading={isLoading}
              searchTerm={searchTerm}
              selectedPatientId={selectedPatientId}
              onPatientSelect={setSelectedPatientId}
              onPatientEdit={handleEditPatient}
              onPatientDelete={handleDeletePatient}
            />
          </div>

          <div className="space-y-6">
            <PatientDetailsSection selectedPatient={selectedPatient} />
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
