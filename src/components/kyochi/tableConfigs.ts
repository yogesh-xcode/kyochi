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

export type FilterControlType = "id" | "master" | "date_range" | "time_range";

export type TableFilterConfig = {
  controls: Record<string, FilterControlType>;
};

export const tableViewConfigs: Record<TableViewKey, TableViewConfig> = {
  patients: {
    columns: ["ID", "Full Name", "Email", "Phone", "DOB", "Wellness", "Status"],
    centeredBodyColumns: [0, 4, 5, 6],
    includedDataFields: ["id", "full_name", "email", "phone", "dob", "wellness_score", "status"],
    excludedDataFields: ["franchise_name", "city", "region", "created_at"],
  },
  therapists: {
    columns: ["ID", "Name", "Franchise", "Specialty", "Email", "Phone", "License"],
    centeredBodyColumns: [0, 5, 6],
    includedDataFields: ["id", "full_name", "franchise_name", "specialty", "email", "phone", "license_no"],
    excludedDataFields: ["status", "phone", "city", "region", "created_at"],
  },
  appointments: {
    columns: [
      "ID",
      "Patient",
      "Therapy",
      "Therapist",
      "Franchise",
      "Date",
      "Time",
      "Status",
    ],
    centeredBodyColumns: [0, 5, 6, 7],
    includedDataFields: [
      "id",
      "patient_name",
      "therapy_name",
      "therapist_name",
      "franchise_name",
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
      "Patient",
      "Therapist",
      "Appointment Date",
      "Rating",
      "Status",
    ],
    centeredBodyColumns: [2, 3, 4],
    includedDataFields: [
      "patient_name",
      "therapist_name",
      "appointment_date",
      "rating",
      "status",
    ],
    excludedDataFields: ["id", "appointment_id", "patient_id", "therapist_id", "franchise_id", "notes", "feedback_payload", "attachment_path", "invoice_id", "submitted_at", "created_at"],
  },
  therapies: {
    columns: [
      "ID",
      "Therapy Name",
      "Category",
      "Duration",
      "Sessions",
      "Price",
      "Description",
      "Status",
    ],
    centeredBodyColumns: [0, 3, 4, 5, 7],
    includedDataFields: [
      "id",
      "name",
      "category",
      "duration_min",
      "session_count",
      "price",
      "description",
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
    columns: ["Patient Name", "Therapy Type", "Amount", "Due Date", "Status"],
    centeredBodyColumns: [2, 3, 4],
    includedDataFields: [
      "patient_name",
      "therapy_type",
      "amount",
      "due_date",
      "status",
    ],
    excludedDataFields: [
      "id",
      "appointment_id",
      "patient_id",
      "franchise_id",
      "currency",
      "issued_at",
      "created_at",
    ],
  },
};

export const tableFilterConfigs: Record<TableViewKey, TableFilterConfig> = {
  patients: {
    controls: {
      "Full Name": "master",
      Email: "master",
      Phone: "master",
      DOB: "date_range",
      Wellness: "master",
      Status: "master",
    },
  },
  therapists: {
    controls: {
      Name: "master",
      Franchise: "master",
      Specialty: "master",
      Email: "master",
      Phone: "master",
      License: "master",
    },
  },
  appointments: {
    controls: {
      Patient: "master",
      Therapy: "master",
      Therapist: "master",
      Franchise: "master",
      Date: "date_range",
      Time: "time_range",
      Status: "master",
    },
  },
  feedback: {
    controls: {
      Patient: "master",
      Therapist: "master",
      "Appointment Date": "date_range",
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
      Price: "master",
      Description: "master",
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
      "Patient Name": "master",
      "Therapy Type": "master",
      Amount: "master",
      "Due Date": "date_range",
      Status: "master",
    },
  },
};
