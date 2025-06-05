
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X } from "lucide-react";

interface EditPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: any;
}

const EditPatientDialog = ({ open, onOpenChange, patient }: EditPatientDialogProps) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    blood_type: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    insurance_provider: "",
    insurance_policy_number: "",
    primary_doctor_id: "",
    medical_history: "",
  });
  
  const [allergies, setAllergies] = useState<string[]>([]);
  const [currentMedications, setCurrentMedications] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");

  const queryClient = useQueryClient();

  // Initialize form data when patient changes
  useEffect(() => {
    if (patient) {
      setFormData({
        first_name: patient.user?.first_name || "",
        last_name: patient.user?.last_name || "",
        phone: patient.user?.phone || "",
        date_of_birth: patient.date_of_birth || "",
        gender: patient.gender || "",
        blood_type: patient.blood_type || "",
        emergency_contact_name: patient.emergency_contact_name || "",
        emergency_contact_phone: patient.emergency_contact_phone || "",
        insurance_provider: patient.insurance_provider || "",
        insurance_policy_number: patient.insurance_policy_number || "",
        primary_doctor_id: patient.primary_doctor_id || "",
        medical_history: patient.medical_history || "",
      });
      setAllergies(patient.allergies || []);
      setCurrentMedications(patient.current_medications || []);
    }
  }, [patient]);

  // Fetch doctors for primary doctor selection
  const { data: doctors = [] } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .eq('role', 'doctor')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  });

  const updatePatientMutation = useMutation({
    mutationFn: async (patientData: any) => {
      // Update user profile
      const { error: userError } = await supabase
        .from('users')
        .update({
          first_name: patientData.first_name,
          last_name: patientData.last_name,
          phone: patientData.phone,
        })
        .eq('id', patient.user_id);

      if (userError) throw userError;

      // Update patient record
      const { data, error } = await supabase
        .from('patients')
        .update({
          date_of_birth: patientData.date_of_birth,
          gender: patientData.gender,
          blood_type: patientData.blood_type,
          allergies: allergies,
          emergency_contact_name: patientData.emergency_contact_name,
          emergency_contact_phone: patientData.emergency_contact_phone,
          insurance_provider: patientData.insurance_provider,
          insurance_policy_number: patientData.insurance_policy_number,
          primary_doctor_id: patientData.primary_doctor_id || null,
          medical_history: patientData.medical_history,
          current_medications: currentMedications,
        })
        .eq('id', patient.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Patient updated successfully');
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatientMutation.mutate(formData);
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter(a => a !== allergy));
  };

  const addMedication = () => {
    if (newMedication.trim() && !currentMedications.includes(newMedication.trim())) {
      setCurrentMedications([...currentMedications, newMedication.trim()]);
      setNewMedication("");
    }
  };

  const removeMedication = (medication: string) => {
    setCurrentMedications(currentMedications.filter(m => m !== medication));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
          <DialogDescription>
            Update patient information and medical records.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="blood_type">Blood Type</Label>
                <Select value={formData.blood_type} onValueChange={(value) => setFormData({...formData, blood_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Medical Information</h3>
            
            <div>
              <Label htmlFor="primary_doctor">Primary Doctor</Label>
              <Select value={formData.primary_doctor_id} onValueChange={(value) => setFormData({...formData, primary_doctor_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.first_name} {doctor.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Allergies */}
            <div>
              <Label>Allergies</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add allergy..."
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                />
                <Button type="button" onClick={addAllergy} variant="outline">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy) => (
                  <Badge key={allergy} variant="secondary" className="bg-red-100 text-red-700">
                    {allergy}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => removeAllergy(allergy)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div>
              <Label>Current Medications</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add medication..."
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
                />
                <Button type="button" onClick={addMedication} variant="outline">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentMedications.map((medication) => (
                  <Badge key={medication} variant="secondary" className="bg-blue-100 text-blue-700">
                    {medication}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => removeMedication(medication)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="medical_history">Medical History</Label>
              <Textarea
                id="medical_history"
                value={formData.medical_history}
                onChange={(e) => setFormData({...formData, medical_history: e.target.value})}
                rows={3}
              />
            </div>
          </div>

          {/* Emergency & Insurance */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Emergency Contact & Insurance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                <Input
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insurance_provider">Insurance Provider</Label>
                <Input
                  id="insurance_provider"
                  value={formData.insurance_provider}
                  onChange={(e) => setFormData({...formData, insurance_provider: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="insurance_policy_number">Policy Number</Label>
                <Input
                  id="insurance_policy_number"
                  value={formData.insurance_policy_number}
                  onChange={(e) => setFormData({...formData, insurance_policy_number: e.target.value})}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updatePatientMutation.isPending}
              className="healthcare-gradient text-white"
            >
              {updatePatientMutation.isPending ? 'Updating...' : 'Update Patient'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientDialog;
