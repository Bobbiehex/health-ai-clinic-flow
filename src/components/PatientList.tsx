
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PatientCard from "./PatientCard";

interface PatientListProps {
  patients: any[];
  isLoading: boolean;
  searchTerm: string;
  selectedPatientId: string | null;
  onPatientSelect: (patientId: string) => void;
  onPatientEdit: (patient: any) => void;
  onPatientDelete: (patientId: string) => void;
}

const PatientList = ({ 
  patients, 
  isLoading, 
  searchTerm, 
  selectedPatientId, 
  onPatientSelect, 
  onPatientEdit, 
  onPatientDelete 
}: PatientListProps) => {
  return (
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
            <PatientCard
              key={patient.id}
              patient={patient}
              isSelected={selectedPatientId === patient.id}
              onSelect={() => onPatientSelect(patient.id)}
              onEdit={() => onPatientEdit(patient)}
              onDelete={() => onPatientDelete(patient.id)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default PatientList;
