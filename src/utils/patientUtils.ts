
export const calculateAge = (dateOfBirth: string) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const formatPatientDisplay = (patient: any) => {
  return {
    fullName: `${patient.user?.first_name} ${patient.user?.last_name}`,
    initials: `${patient.user?.first_name?.[0] || ''}${patient.user?.last_name?.[0] || ''}`,
    doctorName: patient.primary_doctor 
      ? `${patient.primary_doctor.first_name} ${patient.primary_doctor.last_name}`
      : 'No assigned doctor',
    age: calculateAge(patient.date_of_birth)
  };
};
