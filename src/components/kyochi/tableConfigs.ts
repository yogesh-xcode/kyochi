export type TableViewKey = "patients" | "therapists" | "appointments" | "franchises" | "billing";

export type TableViewConfig = {
  columns: string[];
  centeredBodyColumns: number[];
  includedDataFields: string[];
  excludedDataFields: string[];
};

export const tableViewConfigs: Record<TableViewKey, TableViewConfig> = {
  patients: {
    columns: ["ID", "Name", "Email", "Phone", "Wellness"],
    centeredBodyColumns: [0, 3, 4],
    includedDataFields: ["id", "full_name", "email", "phone", "wellness_score"],
    excludedDataFields: ["status", "city", "region", "created_at"],
  },
  therapists: {
    columns: ["ID", "Name", "Specialty", "Email", "License"],
    centeredBodyColumns: [0],
    includedDataFields: ["id", "full_name", "specialty", "email", "license_no"],
    excludedDataFields: ["status", "phone", "city", "region", "created_at"],
  },
  appointments: {
    columns: ["ID", "Patient", "Therapist", "Date & Time", "Status"],
    centeredBodyColumns: [0, 4],
    includedDataFields: ["id", "patient_name", "therapist_name", "starts_at", "status"],
    excludedDataFields: ["patient_id", "therapist_id", "therapy_id", "created_at"],
  },
  franchises: {
    columns: ["ID", "Location", "Address", "City", "Region", "Phone"],
    centeredBodyColumns: [0, 3, 4, 5],
    includedDataFields: ["id", "name", "address", "city", "region", "phone"],
    excludedDataFields: ["status", "created_at"],
  },
  billing: {
    columns: ["Therapy Name", "Duration", "Price", "Status"],
    centeredBodyColumns: [2, 3],
    includedDataFields: ["therapy_name", "duration_min", "amount", "status"],
    excludedDataFields: ["id", "appointment_id", "patient_id", "currency", "issued_at", "due_at", "created_at"],
  },
};
