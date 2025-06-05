
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Trash2 } from "lucide-react";
import { formatPatientDisplay } from "@/utils/patientUtils";

interface PatientCardProps {
  patient: any;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PatientCard = ({ patient, isSelected, onSelect, onEdit, onDelete }: PatientCardProps) => {
  const patientDisplay = formatPatientDisplay(patient);

  return (
    <Card 
      className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {patientDisplay.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-slate-900">
              {patientDisplay.fullName}
            </h3>
            <p className="text-sm text-slate-600">
              Age {patientDisplay.age} • ID: {patient.patient_id}
            </p>
            <p className="text-xs text-slate-500">
              Primary Doctor: {patientDisplay.doctorName}
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
              onEdit();
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
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
  );
};

export default PatientCard;
