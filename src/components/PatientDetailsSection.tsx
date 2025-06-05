
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import PatientDetailsPanel from "./PatientDetailsPanel";

interface PatientDetailsSectionProps {
  selectedPatient: any;
}

const PatientDetailsSection = ({ selectedPatient }: PatientDetailsSectionProps) => {
  if (selectedPatient) {
    return <PatientDetailsPanel patient={selectedPatient} />;
  }

  return (
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
  );
};

export default PatientDetailsSection;
