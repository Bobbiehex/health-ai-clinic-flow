
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PatientHeaderProps {
  onAddPatient: () => void;
}

const PatientHeader = ({ onAddPatient }: PatientHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Patient Management</h1>
        <p className="text-slate-600">Manage patient records with AI-powered insights</p>
      </div>
      <Button 
        onClick={onAddPatient}
        className="healthcare-gradient text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Patient
      </Button>
    </div>
  );
};

export default PatientHeader;
