export type TableViewKey =
  | "patients"
  | "therapists"
  | "appointments"
  | "feedback"
  | "therapies"
  | "franchises"
  | "billing";

export type TableViewConfig = {
  columns: string[];
  centeredBodyColumns: number[];
  includedDataFields: string[];
  excludedDataFields: string[];
};

export type FilterControlType =
  | "id"
  | "master"
  | "date_range"
  | "time_range";

export type TableFilterConfig = {
  controls: Record<string, FilterControlType>;
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
    columns: ["ID", "Patient", "Therapist", "Therapy", "Date", "Time", "Status"],
    centeredBodyColumns: [0, 4, 5, 6],
    includedDataFields: [
      "id",
      "patient_name",
      "therapist_name",
      "therapy_name",
      "date",
      "time",
      "status",
    ],
    excludedDataFields: [
      "patient_id",
      "therapist_id",
      "therapy_id",
      "created_at",
    ],
  },
  feedback: {
    columns: [
      "Feedback ID",
      "Appointment ID",
      "Patient",
      "Therapist",
      "Session Date",
      "Invoice No",
      "Rating",
      "Status",
    ],
    centeredBodyColumns: [0, 1, 5, 6, 7],
    includedDataFields: [
      "feedback_id",
      "appointment_id",
      "patient_name",
      "therapist_name",
      "session_date",
      "invoice_id",
      "rating",
      "status",
    ],
    excludedDataFields: ["patient_id", "therapist_id", "notes", "created_at"],
  },
  therapies: {
    columns: [
      "ID",
      "Therapy Name",
      "Category",
      "Duration",
      "Sessions",
      "Status",
    ],
    centeredBodyColumns: [0, 3, 4, 5],
    includedDataFields: [
      "id",
      "name",
      "category",
      "duration_min",
      "session_count",
      "status",
    ],
    excludedDataFields: ["created_at"],
  },
  franchises: {
    columns: [
      "ID",
      "Location",
      "Address",
      "City",
      "Region",
      "Phone",
      "WhatsApp",
    ],
    centeredBodyColumns: [0, 3, 4, 5, 6],
    includedDataFields: [
      "id",
      "name",
      "address",
      "city",
      "region",
      "phone",
      "whatsapp",
    ],
    excludedDataFields: ["status", "created_at"],
  },
  billing: {
    columns: ["Invoice No", "Therapy Name", "Duration", "Price", "Status"],
    centeredBodyColumns: [0, 2, 3, 4],
    includedDataFields: [
      "id",
      "therapy_name",
      "duration_min",
      "amount",
      "status",
    ],
    excludedDataFields: [
      "id",
      "appointment_id",
      "patient_id",
      "currency",
      "issued_at",
      "due_at",
      "created_at",
    ],
  },
};

export const tableFilterConfigs: Record<TableViewKey, TableFilterConfig> = {
  patients: {
    controls: {
      Name: "master",
      Email: "master",
      Phone: "master",
      Wellness: "master",
    },
  },
  therapists: {
    controls: {
      Name: "master",
      Specialty: "master",
      Email: "master",
      License: "master",
    },
  },
  appointments: {
    controls: {
      Patient: "master",
      Therapist: "master",
      Therapy: "master",
      Date: "date_range",
      Time: "time_range",
      Status: "master",
    },
  },
  feedback: {
    controls: {
      Patient: "master",
      Therapist: "master",
      "Session Date": "date_range",
      "Invoice No": "master",
      Rating: "master",
      Status: "master",
    },
  },
  therapies: {
    controls: {
      "Therapy Name": "master",
      Category: "master",
      Duration: "master",
      Sessions: "master",
      Status: "master",
    },
  },
  franchises: {
    controls: {
      Location: "master",
      Address: "master",
      City: "master",
      Region: "master",
      Phone: "master",
      WhatsApp: "master",
    },
  },
  billing: {
    controls: {
      "Invoice No": "master",
      "Therapy Name": "master",
      Duration: "master",
      Price: "master",
      Status: "master",
    },
  },
};
