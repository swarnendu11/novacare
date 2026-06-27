/**
 * NovaCare – Mock Data Store (Extended)
 * All data lives in localStorage so edits persist across page refreshes.
 * On first load, the store is seeded with realistic demo data.
 */

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_DEPARTMENTS = [
  { id: 1, name: "Cardiology", description: "Heart & cardiovascular system" },
  { id: 2, name: "Neurology", description: "Brain, spine & nervous system" },
  { id: 3, name: "Orthopedics", description: "Bones, joints & muscles" },
  { id: 4, name: "Pediatrics", description: "Children's health & development" },
  { id: 5, name: "Dermatology", description: "Skin, hair & nail disorders" },
  { id: 6, name: "Ophthalmology", description: "Eye care & vision" },
  { id: 7, name: "Oncology", description: "Cancer diagnosis & treatment" },
  {
    id: 8,
    name: "General Medicine",
    description: "Primary healthcare services",
  },
];

const SEED_DOCTORS = [
  {
    id: 1,
    name: "Dr. Arjun Mehta",
    email: "arjun.mehta@novacare.com",
    departmentId: 1,
    department: "Cardiology",
    specialization: "Interventional Cardiology",
    experience: 14,
    fee: 800,
    available: true,
    rating: 4.9,
    appointments: 312,
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    email: "priya.sharma@novacare.com",
    departmentId: 2,
    department: "Neurology",
    specialization: "Epileptology",
    experience: 10,
    fee: 700,
    available: true,
    rating: 4.8,
    appointments: 254,
  },
  {
    id: 3,
    name: "Dr. Rohan Gupta",
    email: "rohan.gupta@novacare.com",
    departmentId: 3,
    department: "Orthopedics",
    specialization: "Joint Replacement",
    experience: 12,
    fee: 750,
    available: false,
    rating: 4.7,
    appointments: 198,
  },
  {
    id: 4,
    name: "Dr. Sneha Patel",
    email: "sneha.patel@novacare.com",
    departmentId: 4,
    department: "Pediatrics",
    specialization: "Neonatology",
    experience: 8,
    fee: 600,
    available: true,
    rating: 4.9,
    appointments: 420,
  },
  {
    id: 5,
    name: "Dr. Kiran Rao",
    email: "kiran.rao@novacare.com",
    departmentId: 5,
    department: "Dermatology",
    specialization: "Cosmetic Dermatology",
    experience: 6,
    fee: 550,
    available: true,
    rating: 4.6,
    appointments: 175,
  },
  {
    id: 6,
    name: "Dr. Anjali Singh",
    email: "anjali.singh@novacare.com",
    departmentId: 7,
    department: "Oncology",
    specialization: "Breast Oncology",
    experience: 15,
    fee: 900,
    available: true,
    rating: 4.9,
    appointments: 289,
  },
  {
    id: 7,
    name: "Dr. Vikram Nair",
    email: "vikram.nair@novacare.com",
    departmentId: 8,
    department: "General Medicine",
    specialization: "Internal Medicine",
    experience: 9,
    fee: 500,
    available: true,
    rating: 4.5,
    appointments: 631,
  },
  {
    id: 8,
    name: "Dr. Meera Iyer",
    email: "meera.iyer@novacare.com",
    departmentId: 6,
    department: "Ophthalmology",
    specialization: "Retina Surgery",
    experience: 11,
    fee: 850,
    available: false,
    rating: 4.8,
    appointments: 142,
  },
  {
    id: 9,
    name: "Dr. Sameer Khan",
    email: "sameer.khan@novacare.com",
    departmentId: 1,
    department: "Cardiology",
    specialization: "Echocardiography",
    experience: 8,
    fee: 650,
    available: true,
    rating: 4.6,
    appointments: 120,
  },
  {
    id: 10,
    name: "Dr. Anita Desai",
    email: "anita.desai@novacare.com",
    departmentId: 5,
    department: "Dermatology",
    specialization: "Pediatric Dermatology",
    experience: 12,
    fee: 700,
    available: true,
    rating: 4.8,
    appointments: 340,
  },
  {
    id: 11,
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@novacare.com",
    departmentId: 3,
    department: "Orthopedics",
    specialization: "Sports Injuries",
    experience: 18,
    fee: 900,
    available: true,
    rating: 4.9,
    appointments: 512,
  },
  {
    id: 12,
    name: "Dr. Fatima Ali",
    email: "fatima.ali@novacare.com",
    departmentId: 4,
    department: "Pediatrics",
    specialization: "Child Neurology",
    experience: 7,
    fee: 550,
    available: true,
    rating: 4.7,
    appointments: 210,
  },
];

const today = new Date();
const d = (offset) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString().split("T")[0];
};

const SEED_APPOINTMENTS = [
  {
    id: 1,
    patientId: 3,
    patientName: "John Patient",
    doctorId: 1,
    doctorName: "Dr. Arjun Mehta",
    department: "Cardiology",
    date: d(-10),
    time: "10:00",
    status: "completed",
    notes: "Routine checkup – BP normal.",
  },
  {
    id: 2,
    patientId: 3,
    patientName: "John Patient",
    doctorId: 2,
    doctorName: "Dr. Priya Sharma",
    department: "Neurology",
    date: d(-5),
    time: "11:30",
    status: "completed",
    notes: "Headache follow-up.",
  },
  {
    id: 3,
    patientId: 3,
    patientName: "John Patient",
    doctorId: 7,
    doctorName: "Dr. Vikram Nair",
    department: "General Medicine",
    date: d(2),
    time: "09:00",
    status: "scheduled",
    notes: "Annual health checkup.",
  },
  {
    id: 4,
    patientId: 3,
    patientName: "John Patient",
    doctorId: 4,
    doctorName: "Dr. Sneha Patel",
    department: "Pediatrics",
    date: d(7),
    time: "14:00",
    status: "scheduled",
    notes: "Follow-up visit.",
  },
  {
    id: 5,
    patientId: 3,
    patientName: "John Patient",
    doctorId: 1,
    doctorName: "Dr. Arjun Mehta",
    department: "Cardiology",
    date: d(-20),
    time: "10:00",
    status: "cancelled",
    notes: "Patient rescheduled.",
  },
  {
    id: 6,
    patientId: 5,
    patientName: "Alice Brown",
    doctorId: 5,
    doctorName: "Dr. Kiran Rao",
    department: "Dermatology",
    date: d(-3),
    time: "15:00",
    status: "completed",
    notes: "Acne treatment.",
  },
  {
    id: 7,
    patientId: 6,
    patientName: "Bob Wilson",
    doctorId: 3,
    doctorName: "Dr. Rohan Gupta",
    department: "Orthopedics",
    date: d(1),
    time: "11:00",
    status: "scheduled",
    notes: "Knee pain consultation.",
  },
  {
    id: 8,
    patientId: 7,
    patientName: "Carol Davis",
    doctorId: 6,
    doctorName: "Dr. Anjali Singh",
    department: "Oncology",
    date: d(-8),
    time: "09:30",
    status: "completed",
    notes: "Chemotherapy follow-up.",
  },
  {
    id: 9,
    patientId: 5,
    patientName: "Alice Brown",
    doctorId: 1,
    doctorName: "Dr. Arjun Mehta",
    department: "Cardiology",
    date: d(3),
    time: "10:30",
    status: "scheduled",
    notes: "",
  },
  {
    id: 10,
    patientId: 6,
    patientName: "Bob Wilson",
    doctorId: 7,
    doctorName: "Dr. Vikram Nair",
    department: "General Medicine",
    date: d(-1),
    time: "16:00",
    status: "completed",
    notes: "Fever & cold.",
  },
];

const SEED_PRESCRIPTIONS = [
  {
    id: 1,
    appointmentId: 1,
    patientId: 3,
    patientName: "John Patient",
    doctorId: 1,
    doctorName: "Dr. Arjun Mehta",
    date: d(-10),
    diagnosis: "Hypertension",
    medicines: [
      {
        name: "Amlodipine",
        dosage: "5mg",
        frequency: "Once daily",
        duration: "30 days",
      },
      {
        name: "Aspirin",
        dosage: "75mg",
        frequency: "Once daily",
        duration: "30 days",
      },
    ],
    notes: "Avoid high-sodium foods. Exercise regularly.",
    pharmacyStatus: "dispensed",
  },
  {
    id: 2,
    appointmentId: 2,
    patientId: 3,
    patientName: "John Patient",
    doctorId: 2,
    doctorName: "Dr. Priya Sharma",
    date: d(-5),
    diagnosis: "Migraine",
    medicines: [
      {
        name: "Sumatriptan",
        dosage: "50mg",
        frequency: "As needed",
        duration: "15 days",
      },
      {
        name: "Topiramate",
        dosage: "25mg",
        frequency: "Twice daily",
        duration: "30 days",
      },
    ],
    notes: "Avoid bright lights & loud noise during episodes.",
    pharmacyStatus: "pending",
  },
  {
    id: 3,
    appointmentId: 6,
    patientId: 5,
    patientName: "Alice Brown",
    doctorId: 5,
    doctorName: "Dr. Kiran Rao",
    date: d(-3),
    diagnosis: "Acne Vulgaris",
    medicines: [
      {
        name: "Benzoyl Peroxide Gel",
        dosage: "2.5%",
        frequency: "Twice daily",
        duration: "60 days",
      },
    ],
    notes: "Cleanse face gently. Use SPF 30+ sunscreen.",
    pharmacyStatus: "pending",
  },
  {
    id: 4,
    appointmentId: 8,
    patientId: 7,
    patientName: "Carol Davis",
    doctorId: 6,
    doctorName: "Dr. Anjali Singh",
    date: d(-8),
    diagnosis: "Breast Cancer – Stage II",
    medicines: [
      {
        name: "Tamoxifen",
        dosage: "20mg",
        frequency: "Once daily",
        duration: "5 years",
      },
    ],
    notes: "Regular follow-up every 3 months. Monitor side effects.",
    pharmacyStatus: "dispensed",
  },
];

const SEED_USERS = [
  {
    id: 1,
    name: "Super Admin",
    email: "admin@novacare.com",
    password: "admin123",
    role: "admin",
    phone: "9800000001",
  },
  {
    id: 2,
    name: "Dr. Arjun Mehta",
    email: "arjun.mehta@novacare.com",
    password: "doctor123",
    role: "doctor",
    phone: "9800000002",
    doctorId: 1,
  },
  {
    id: 3,
    name: "John Patient",
    email: "patient@novacare.com",
    password: "patient123",
    role: "patient",
    phone: "9800000003",
  },
  {
    id: 4,
    name: "Riya Reception",
    email: "reception@novacare.com",
    password: "recept123",
    role: "receptionist",
    phone: "9800000004",
  },
  {
    id: 5,
    name: "Alice Brown",
    email: "alice@example.com",
    password: "alice123",
    role: "patient",
    phone: "9800000005",
  },
  {
    id: 6,
    name: "Bob Wilson",
    email: "bob@example.com",
    password: "bob123",
    role: "patient",
    phone: "9800000006",
  },
  {
    id: 7,
    name: "Carol Davis",
    email: "carol@example.com",
    password: "carol123",
    role: "patient",
    phone: "9800000007",
  },
  {
    id: 1008,
    name: "Nancy Nurse",
    email: "nurse@novacare.com",
    password: "nurse123",
    role: "nurse",
    phone: "9800000008",
  },
  {
    id: 1009,
    name: "Wally Wardboy",
    email: "wardboy@novacare.com",
    password: "wardboy123",
    role: "wardboy",
    phone: "9800000009",
  },
  {
    id: 1010,
    name: "Phil Pharmacy",
    email: "pharmacy@novacare.com",
    password: "pharmacy123",
    role: "pharmacy",
    phone: "9800000010",
  },
  {
    id: 1011,
    name: "Larry Lab",
    email: "laboratory@novacare.com",
    password: "lab123",
    role: "laboratory",
    phone: "9800000011",
  },
  {
    id: 1012,
    name: "Andy Ambulance",
    email: "ambulance@novacare.com",
    password: "ambulance123",
    role: "ambulance",
    phone: "9800000012",
  },
];

// ─── IPD / Admissions Seed Data ──────────────────────────────────────────────

const SEED_ADMISSIONS = [
  {
    id: "IPD-001",
    patientId: 3,
    patientName: "John Patient",
    patientAge: 34,
    gender: "Male",
    doctorId: 1,
    doctorName: "Dr. Arjun Mehta",
    department: "Cardiology",
    ward: "General Ward",
    bed: "G-101",
    admitDate: d(-12),
    dischargeDate: null,
    status: "admitted",
    reason: "Acute Myocardial Infarction",
    notes: "Patient stable on medication.",
    vitals: [
      { date: d(-12), bp: "140/90", temp: "98.6", pulse: 88, spo2: 96 },
      { date: d(-10), bp: "135/85", temp: "98.4", pulse: 82, spo2: 97 },
      { date: d(-8), bp: "130/80", temp: "98.2", pulse: 78, spo2: 98 },
    ],
  },
  {
    id: "IPD-002",
    patientId: 5,
    patientName: "Alice Brown",
    patientAge: 28,
    gender: "Female",
    doctorId: 5,
    doctorName: "Dr. Kiran Rao",
    department: "Dermatology",
    ward: "Female Ward",
    bed: "F-204",
    admitDate: d(-5),
    dischargeDate: null,
    status: "admitted",
    reason: "Severe Eczema Flare",
    notes: "IV steroids in progress.",
    vitals: [{ date: d(-5), bp: "120/76", temp: "99.1", pulse: 90, spo2: 97 }],
  },
  {
    id: "IPD-003",
    patientId: 7,
    patientName: "Carol Davis",
    patientAge: 52,
    gender: "Female",
    doctorId: 6,
    doctorName: "Dr. Anjali Singh",
    department: "Oncology",
    ward: "Oncology Ward",
    bed: "O-301",
    admitDate: d(-20),
    dischargeDate: d(-8),
    status: "discharged",
    reason: "Chemotherapy Cycle 3",
    notes: "Patient responded well to treatment.",
    vitals: [],
  },
];

// ─── Beds / Wards Seed Data ───────────────────────────────────────────────────

const SEED_WARDS = [
  {
    id: 1,
    name: "General Ward",
    floor: "1st",
    totalBeds: 20,
    occupiedBeds: 14,
    type: "general",
  },
  {
    id: 2,
    name: "Female Ward",
    floor: "2nd",
    totalBeds: 15,
    occupiedBeds: 8,
    type: "female",
  },
  {
    id: 3,
    name: "Male Ward",
    floor: "2nd",
    totalBeds: 15,
    occupiedBeds: 10,
    type: "male",
  },
  {
    id: 4,
    name: "ICU",
    floor: "3rd",
    totalBeds: 10,
    occupiedBeds: 7,
    type: "icu",
  },
  {
    id: 5,
    name: "Oncology Ward",
    floor: "4th",
    totalBeds: 12,
    occupiedBeds: 5,
    type: "specialty",
  },
  {
    id: 6,
    name: "Pediatric Ward",
    floor: "1st",
    totalBeds: 10,
    occupiedBeds: 3,
    type: "pediatric",
  },
  {
    id: 7,
    name: "Post-Op Ward",
    floor: "3rd",
    totalBeds: 8,
    occupiedBeds: 4,
    type: "post-op",
  },
];

const SEED_BEDS = [
  {
    id: "G-101",
    wardId: 1,
    wardName: "General Ward",
    floor: "1st",
    status: "occupied",
    patientName: "John Patient",
    patientId: 3,
    type: "standard",
  },
  {
    id: "G-102",
    wardId: 1,
    wardName: "General Ward",
    floor: "1st",
    status: "available",
    patientName: null,
    patientId: null,
    type: "standard",
  },
  {
    id: "G-103",
    wardId: 1,
    wardName: "General Ward",
    floor: "1st",
    status: "maintenance",
    patientName: null,
    patientId: null,
    type: "standard",
  },
  {
    id: "F-204",
    wardId: 2,
    wardName: "Female Ward",
    floor: "2nd",
    status: "occupied",
    patientName: "Alice Brown",
    patientId: 5,
    type: "standard",
  },
  {
    id: "F-205",
    wardId: 2,
    wardName: "Female Ward",
    floor: "2nd",
    status: "available",
    patientName: null,
    patientId: null,
    type: "standard",
  },
  {
    id: "ICU-01",
    wardId: 4,
    wardName: "ICU",
    floor: "3rd",
    status: "occupied",
    patientName: "Bob Wilson",
    patientId: 6,
    type: "icu",
  },
  {
    id: "ICU-02",
    wardId: 4,
    wardName: "ICU",
    floor: "3rd",
    status: "available",
    patientName: null,
    patientId: null,
    type: "icu",
  },
  {
    id: "O-301",
    wardId: 5,
    wardName: "Oncology Ward",
    floor: "4th",
    status: "available",
    patientName: null,
    patientId: null,
    type: "standard",
  },
];

// ─── Lab Reports Seed Data ────────────────────────────────────────────────────

const SEED_LAB_REPORTS = [
  {
    id: "LAB-001",
    patientId: 3,
    patientName: "John Patient",
    doctorId: 1,
    doctorName: "Dr. Arjun Mehta",
    testName: "Complete Blood Count (CBC)",
    testCategory: "Hematology",
    orderedDate: d(-12),
    resultDate: d(-10),
    status: "completed",
    result:
      "Hemoglobin: 13.5 g/dL (Normal). WBC: 7,200 /µL (Normal). Platelets: 2,20,000 /µL (Normal).",
    interpretation: "All values within normal range.",
    fileUrl: null,
  },
  {
    id: "LAB-002",
    patientId: 3,
    patientName: "John Patient",
    doctorId: 2,
    doctorName: "Dr. Priya Sharma",
    testName: "Lipid Profile",
    testCategory: "Biochemistry",
    orderedDate: d(-8),
    resultDate: d(-6),
    status: "completed",
    result:
      "Total Cholesterol: 210 mg/dL (Borderline High). LDL: 145 mg/dL (High). HDL: 42 mg/dL (Low). Triglycerides: 180 mg/dL.",
    interpretation:
      "LDL elevated. Advise dietary modification and statin therapy.",
    fileUrl: null,
  },
  {
    id: "LAB-003",
    patientId: 3,
    patientName: "John Patient",
    doctorId: 7,
    doctorName: "Dr. Vikram Nair",
    testName: "HbA1c – Glycated Hemoglobin",
    testCategory: "Endocrinology",
    orderedDate: d(-3),
    resultDate: null,
    status: "pending",
    result: "",
    interpretation: "",
    fileUrl: null,
  },
  {
    id: "LAB-004",
    patientId: 5,
    patientName: "Alice Brown",
    doctorId: 5,
    doctorName: "Dr. Kiran Rao",
    testName: "Skin Biopsy",
    testCategory: "Pathology",
    orderedDate: d(-6),
    resultDate: d(-4),
    status: "completed",
    result:
      "No malignancy detected. Consistent with chronic eczema (atopic dermatitis).",
    interpretation:
      "Benign inflammatory condition. Continue prescribed treatment.",
    fileUrl: null,
  },
  {
    id: "LAB-005",
    patientId: 7,
    patientName: "Carol Davis",
    doctorId: 6,
    doctorName: "Dr. Anjali Singh",
    testName: "CA-125 Tumor Marker",
    testCategory: "Oncology Markers",
    orderedDate: d(-15),
    resultDate: d(-13),
    status: "completed",
    result: "CA-125: 32 U/mL (Normal range: <35 U/mL). Within normal limits.",
    interpretation: "Good response to treatment. Continue current protocol.",
    fileUrl: null,
  },
  {
    id: "LAB-006",
    patientId: 6,
    patientName: "Bob Wilson",
    doctorId: 3,
    doctorName: "Dr. Rohan Gupta",
    testName: "MRI Knee Joint",
    testCategory: "Radiology",
    orderedDate: d(-2),
    resultDate: null,
    status: "processing",
    result: "",
    interpretation: "",
    fileUrl: null,
  },
];

// ─── Medical Records / EMR Seed Data ─────────────────────────────────────────

const SEED_EMR = [
  {
    id: 1,
    patientId: 3,
    vitals: [
      {
        date: d(-30),
        bp: "145/92",
        temp: "98.8",
        pulse: 92,
        spo2: 95,
        weight: 82,
        height: 175,
      },
      {
        date: d(-15),
        bp: "138/88",
        temp: "98.6",
        pulse: 85,
        spo2: 96,
        weight: 81,
        height: 175,
      },
      {
        date: d(-5),
        bp: "132/84",
        temp: "98.4",
        pulse: 80,
        spo2: 97,
        weight: 80.5,
        height: 175,
      },
    ],
    doctorNotes: [
      {
        date: d(-15),
        doctorName: "Dr. Arjun Mehta",
        note: "Patient responding well to antihypertensive therapy. BP trending down. Continue Amlodipine 5mg.",
      },
      {
        date: d(-5),
        doctorName: "Dr. Priya Sharma",
        note: "Headache frequency reduced from daily to 2x/week. Migraine medication effective. Reduce Topiramate to 25mg once daily.",
      },
    ],
    diagnoses: [
      {
        date: d(-10),
        diagnosis: "Essential Hypertension (I10)",
        doctor: "Dr. Arjun Mehta",
        status: "ongoing",
      },
      {
        date: d(-5),
        diagnosis: "Migraine without Aura (G43.0)",
        doctor: "Dr. Priya Sharma",
        status: "ongoing",
      },
    ],
    allergies: ["Penicillin", "Sulfa Drugs"],
    bloodGroup: "O+",
    chronicConditions: ["Hypertension"],
  },
];

// ─── Notifications Seed Data ──────────────────────────────────────────────────

const SEED_NOTIFICATIONS = {
  patient3: [
    {
      id: 1,
      type: "appointment",
      title: "Appointment Reminder",
      message: "Your appointment with Dr. Vikram Nair is tomorrow at 9:00 AM.",
      time: d(1),
      read: false,
      icon: "calendar",
    },
    {
      id: 2,
      type: "lab",
      title: "Lab Report Ready",
      message: "Your CBC report from Dr. Arjun Mehta is now available.",
      time: d(-10),
      read: false,
      icon: "flask",
    },
    {
      id: 3,
      type: "prescription",
      title: "Prescription Created",
      message: "Dr. Priya Sharma has created a new prescription for you.",
      time: d(-5),
      read: true,
      icon: "pill",
    },
    {
      id: 4,
      type: "payment",
      title: "Payment Confirmed",
      message: "Payment of ₹1,200 received for appointment #APT-001.",
      time: d(-10),
      read: true,
      icon: "rupee",
    },
  ],
  admin1: [
    {
      id: 1,
      type: "system",
      title: "New Patient Registered",
      message: "Alice Brown has registered as a new patient.",
      time: d(-3),
      read: false,
      icon: "user",
    },
    {
      id: 2,
      type: "alert",
      title: "Low Stock Alert",
      message: "Azithromycin 500mg is out of stock in pharmacy.",
      time: d(-1),
      read: false,
      icon: "alert",
    },
    {
      id: 3,
      type: "appointment",
      title: "High Appointment Volume",
      message: "45 appointments scheduled for today. 3 doctors on leave.",
      time: d(0),
      read: false,
      icon: "calendar",
    },
  ],
  doctor2: [
    {
      id: 1,
      type: "appointment",
      title: "New Appointment",
      message:
        "John Patient has booked an appointment for " + d(2) + " at 10:00 AM.",
      time: d(-1),
      read: false,
      icon: "calendar",
    },
    {
      id: 2,
      type: "lab",
      title: "Lab Result Ready",
      message: "CBC report for John Patient is available for review.",
      time: d(-10),
      read: true,
      icon: "flask",
    },
    {
      id: 3,
      type: "system",
      title: "Schedule Update",
      message: "Your schedule for next week has been updated by admin.",
      time: d(-2),
      read: false,
      icon: "calendar",
    },
  ],
  receptionist4: [
    {
      id: 1,
      type: "appointment",
      title: "Walk-in Patient",
      message: "Emergency walk-in patient at counter. Please assist.",
      time: new Date().toISOString(),
      read: false,
      icon: "alert",
    },
    {
      id: 2,
      type: "system",
      title: "Queue Update",
      message: "12 patients waiting in OPD queue. Average wait: 28 mins.",
      time: d(0),
      read: false,
      icon: "users",
    },
  ],
};

// ─── Activity Feed Seed Data ──────────────────────────────────────────────────

const SEED_ACTIVITY = [
  {
    id: 1,
    time: "10:42 AM",
    title: "New IPD Admission",
    desc: "Patient Alice Brown admitted to Ward A, Bed 204.",
    type: "admit",
    icon: "bed",
    date: "Today",
  },
  {
    id: 2,
    time: "10:15 AM",
    title: "Lab Report Uploaded",
    desc: "CBC report for John Patient marked as completed.",
    type: "lab",
    icon: "flask",
    date: "Today",
  },
  {
    id: 3,
    time: "09:50 AM",
    title: "Prescription Created",
    desc: "Dr. Arjun Mehta created Rx for Patient John Patient.",
    type: "rx",
    icon: "pill",
    date: "Today",
  },
  {
    id: 4,
    time: "09:15 AM",
    title: "System Backup Complete",
    desc: "Database nightly backup finished successfully (2.4GB).",
    type: "system",
    icon: "system",
    date: "Today",
  },
  {
    id: 5,
    time: "08:30 AM",
    title: "Shift Started",
    desc: "Morning reception team logged into POS terminal.",
    type: "staff",
    icon: "users",
    date: "Today",
  },
  {
    id: 6,
    time: "11:30 AM",
    title: "New Doctor Onboarded",
    desc: "Dr. Fatima Ali (Pediatrics) profile activated.",
    type: "doctor",
    icon: "doctor",
    date: "Yesterday",
  },
  {
    id: 7,
    time: "03:20 PM",
    title: "Appointment Booked",
    desc: "Bob Wilson booked Orthopedics appointment.",
    type: "appt",
    icon: "calendar",
    date: "Yesterday",
  },
  {
    id: 8,
    time: "01:00 PM",
    title: "Payment Received",
    desc: "₹1,500 payment collected from Carol Davis.",
    type: "payment",
    icon: "rupee",
    date: "Yesterday",
  },
];

// ─── Billing Seed Data ────────────────────────────────────────────────────────

const SEED_BILLING = [
  {
    id: "INV-001",
    appointmentId: 1,
    patientId: 3,
    patientName: "John Patient",
    doctorName: "Dr. Arjun Mehta",
    department: "Cardiology",
    date: d(-10),
    dueDate: d(20),
    status: "paid",
    items: [
      { description: "Consultation Fee – Cardiology", amount: 800 },
      { description: "ECG", amount: 250 },
    ],
    totalAmount: 1050,
    paidAmount: 1050,
    paymentMethod: "UPI",
    paymentDate: d(-9),
    generatedBy: "system",
  },
  {
    id: "INV-002",
    appointmentId: 2,
    patientId: 3,
    patientName: "John Patient",
    doctorName: "Dr. Priya Sharma",
    department: "Neurology",
    date: d(-5),
    dueDate: d(25),
    status: "pending",
    items: [
      { description: "Consultation Fee – Neurology", amount: 700 },
      { description: "MRI Consultation Review", amount: 500 },
    ],
    totalAmount: 1200,
    paidAmount: 0,
    paymentMethod: null,
    paymentDate: null,
    generatedBy: "system",
  },
  {
    id: "INV-003",
    appointmentId: 6,
    patientId: 5,
    patientName: "Alice Brown",
    doctorName: "Dr. Kiran Rao",
    department: "Dermatology",
    date: d(-3),
    dueDate: d(27),
    status: "paid",
    items: [{ description: "Consultation Fee – Dermatology", amount: 550 }],
    totalAmount: 550,
    paidAmount: 550,
    paymentMethod: "Credit Card",
    paymentDate: d(-2),
    generatedBy: "system",
  },
  {
    id: "INV-004",
    appointmentId: 8,
    patientId: 7,
    patientName: "Carol Davis",
    doctorName: "Dr. Anjali Singh",
    department: "Oncology",
    date: d(-8),
    dueDate: d(22),
    status: "paid",
    items: [
      { description: "Consultation Fee – Oncology", amount: 900 },
      { description: "Chemotherapy Session", amount: 15000 },
    ],
    totalAmount: 15900,
    paidAmount: 15900,
    paymentMethod: "Insurance",
    paymentDate: d(-7),
    generatedBy: "system",
  },
];

// ─── Storage helpers ───────────────────────────────────────────────────────────

const KEY = {
  users: "mc_users",
  doctors: "mc_doctors",
  departments: "mc_departments",
  appointments: "mc_appointments",
  prescriptions: "mc_prescriptions",
  admissions: "mc_admissions",
  wards: "mc_wards",
  beds: "mc_beds",
  labReports: "mc_lab_reports",
  emr: "mc_emr",
  notifications: "mc_notifications",
  activity: "mc_activity",
  billing: "mc_billing",
};

function load(key, seed) {
  const raw = localStorage.getItem(key);
  if (raw) {
    const data = JSON.parse(raw);
    if (Array.isArray(data) && Array.isArray(seed)) {
      const existingIds = new Set(data.map(item => item.id));
      const missingSeeds = seed.filter(item => !existingIds.has(item.id));
      if (missingSeeds.length > 0) {
        data.push(...missingSeeds);
        localStorage.setItem(key, JSON.stringify(data));
      }
    }
    return data;
  }
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

let _nextId = {};
function nextId(key, data) {
  _nextId[key] = _nextId[key] || Math.max(0, ...data.map((x) => x.id || 0)) + 1;
  return _nextId[key]++;
}

// ─── Initialize (call once at app startup) ────────────────────────────────────

export function initMockDB() {
  localStorage.removeItem(KEY.doctors); // Force doctors to pull new hardcoded values
  load(KEY.users, SEED_USERS);
  load(KEY.doctors, SEED_DOCTORS);
  load(KEY.departments, SEED_DEPARTMENTS);
  load(KEY.appointments, SEED_APPOINTMENTS);
  load(KEY.prescriptions, SEED_PRESCRIPTIONS);
  load(KEY.admissions, SEED_ADMISSIONS);
  load(KEY.wards, SEED_WARDS);
  load(KEY.beds, SEED_BEDS);
  load(KEY.labReports, SEED_LAB_REPORTS);
  load(KEY.emr, SEED_EMR);
  load(KEY.activity, SEED_ACTIVITY);
  load(KEY.billing, SEED_BILLING);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const mockAuth = {
  login(email, password) {
    const users = load(KEY.users, SEED_USERS);
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) throw new Error("Invalid email or password.");
    const { password: _, ...safeUser } = user;
    return { token: `mock-jwt-${safeUser.id}`, user: safeUser };
  },

  register({ name, email, password, role, phone = "", departmentId }) {
    const users = load(KEY.users, SEED_USERS);
    if (users.find((u) => u.email === email))
      throw new Error("Email already registered.");
    const newUser = {
      id: nextId(KEY.users, users),
      name,
      email,
      password,
      role,
      phone,
    };

    if (role === "doctor" && departmentId) {
      const docs = load(KEY.doctors, SEED_DOCTORS);
      const deps = load(KEY.departments, SEED_DEPARTMENTS);
      const dep = deps.find((d) => d.id === Number(departmentId));
      const newDoc = {
        id: nextId(KEY.doctors, docs),
        name,
        email,
        departmentId: Number(departmentId),
        department: dep?.name || "Unknown",
        specialization: "Consultant",
        experience: 0,
        fee: 500,
        phone,
        available: true,
        rating: 5.0,
        appointments: 0,
      };
      docs.push(newDoc);
      save(KEY.doctors, docs);
      newUser.doctorId = newDoc.id;
    }

    users.push(newUser);
    save(KEY.users, users);
    const { password: _, ...safeUser } = newUser;
    return { token: `mock-jwt-${safeUser.id}`, user: safeUser };
  },

  google({ name = "Google User", email, role }) {
    const users = load(KEY.users, SEED_USERS);
    const existing = users.find((u) => u.email === email);

    if (existing) {
      const { password: _, ...safeUser } = existing;
      return { token: `mock-jwt-${safeUser.id}`, user: safeUser };
    }

    if (!role) {
      return { needRole: true, name, email };
    }

    const newUser = {
      id: nextId(KEY.users, users),
      name,
      email,
      password: "google_oauth_bypass",
      role,
      phone: "",
    };

    users.push(newUser);
    save(KEY.users, users);

    const { password: _, ...safeUser } = newUser;
    return { token: `mock-jwt-${safeUser.id}`, user: safeUser };
  },

  me(userId) {
    const users = load(KEY.users, SEED_USERS);
    const user = users.find((u) => u.id === Number(userId));
    if (!user) throw new Error("User not found.");
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  forgotPassword(identifier) {
    const users = load(KEY.users, SEED_USERS);
    const user = users.find(
      (u) => u.email === identifier || u.phone === identifier,
    );
    if (!user)
      throw new Error("No account found with this email or phone number.");

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 mins

    // Determine if input was email or phone to decide channel
    const isEmail = identifier.includes("@");
    const channel = isEmail ? "Email" : "SMS";
    const target = isEmail
      ? user.email.replace(/(.{3}).*(@.*)/, "$1***$2")
      : user.phone.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");

    sessionStorage.setItem("reset_email", user.email);
    sessionStorage.setItem("reset_otp", otp);
    sessionStorage.setItem("reset_expiry", expiry.toString());
    sessionStorage.setItem("reset_target", target);
    sessionStorage.setItem("reset_channel", channel);

    console.log(
      `[NovaCare Mock] OTP sent via ${channel} for ${identifier}: ${otp} (Expires in 5 mins)`,
    );

    return { success: true, message: `OTP sent via ${channel} to ${target}` };
  },

  verifyOtp(otp) {
    const storedOtp = sessionStorage.getItem("reset_otp");
    const expiry = Number(sessionStorage.getItem("reset_expiry"));
    const email = sessionStorage.getItem("reset_email");

    if (!storedOtp || !expiry || !email)
      throw new Error("Session expired. Please request a new OTP.");
    if (Date.now() > expiry) throw new Error("OTP has expired.");
    if (otp !== storedOtp) throw new Error("Invalid OTP.");

    // Mark as verified for next step
    sessionStorage.setItem("otp_verified", "true");
    return { success: true };
  },

  resetPassword(newPassword) {
    const isVerified = sessionStorage.getItem("otp_verified") === "true";
    const email = sessionStorage.getItem("reset_email");

    if (!isVerified || !email)
      throw new Error("Unauthorized. Please verify your OTP first.");

    const users = load(KEY.users, SEED_USERS);
    const idx = users.findIndex((u) => u.email === email);
    if (idx < 0) throw new Error("User not found.");

    users[idx].password = newPassword;
    save(KEY.users, users);

    // Clear session
    sessionStorage.removeItem("reset_email");
    sessionStorage.removeItem("reset_otp");
    sessionStorage.removeItem("reset_expiry");
    sessionStorage.removeItem("otp_verified");

    return { success: true };
  },
};

// ─── Doctors ──────────────────────────────────────────────────────────────────

export const mockDoctors = {
  getAll() {
    return load(KEY.doctors, SEED_DOCTORS);
  },
  getById(id) {
    return load(KEY.doctors, SEED_DOCTORS).find((d) => d.id === Number(id));
  },
  create(data) {
    const list = load(KEY.doctors, SEED_DOCTORS);
    const doc = { ...data, id: nextId(KEY.doctors, list) };
    list.push(doc);
    save(KEY.doctors, list);
    return doc;
  },
  update(id, data) {
    const list = load(KEY.doctors, SEED_DOCTORS);
    const idx = list.findIndex((d) => d.id === Number(id));
    if (idx < 0) throw new Error("Doctor not found");
    list[idx] = { ...list[idx], ...data };
    save(KEY.doctors, list);
    return list[idx];
  },
  delete(id) {
    const list = load(KEY.doctors, SEED_DOCTORS).filter(
      (d) => d.id !== Number(id),
    );
    save(KEY.doctors, list);
  },
};

// ─── Departments ──────────────────────────────────────────────────────────────

export const mockDepartments = {
  getAll() {
    return load(KEY.departments, SEED_DEPARTMENTS);
  },
  getById(id) {
    return load(KEY.departments, SEED_DEPARTMENTS).find(
      (d) => d.id === Number(id),
    );
  },
  create(data) {
    const list = load(KEY.departments, SEED_DEPARTMENTS);
    const dep = { ...data, id: nextId(KEY.departments, list) };
    list.push(dep);
    save(KEY.departments, list);
    return dep;
  },
  update(id, data) {
    const list = load(KEY.departments, SEED_DEPARTMENTS);
    const idx = list.findIndex((d) => d.id === Number(id));
    if (idx < 0) throw new Error("Department not found");
    list[idx] = { ...list[idx], ...data };
    save(KEY.departments, list);
    return list[idx];
  },
  delete(id) {
    const list = load(KEY.departments, SEED_DEPARTMENTS).filter(
      (d) => d.id !== Number(id),
    );
    save(KEY.departments, list);
  },
};

// ─── Appointments ─────────────────────────────────────────────────────────────

export const mockAppointments = {
  getAll(filters = {}) {
    let list = load(KEY.appointments, SEED_APPOINTMENTS);
    if (filters.patientId)
      list = list.filter((a) => a.patientId === Number(filters.patientId));
    if (filters.doctorId)
      list = list.filter((a) => a.doctorId === Number(filters.doctorId));
    if (filters.status) list = list.filter((a) => a.status === filters.status);
    return list;
  },
  getById(id) {
    return load(KEY.appointments, SEED_APPOINTMENTS).find(
      (a) => a.id === Number(id),
    );
  },
  create(data) {
    const list = load(KEY.appointments, SEED_APPOINTMENTS);
    const appt = { ...data, id: nextId(KEY.appointments, list) };
    list.push(appt);
    save(KEY.appointments, list);
    return appt;
  },
  update(id, data) {
    const list = load(KEY.appointments, SEED_APPOINTMENTS);
    const idx = list.findIndex((a) => a.id === Number(id));
    if (idx < 0) throw new Error("Appointment not found");
    list[idx] = { ...list[idx], ...data };
    save(KEY.appointments, list);
    return list[idx];
  },
};

// ─── Prescriptions ────────────────────────────────────────────────────────────

export const mockPrescriptions = {
  getAll(patientId) {
    let list = load(KEY.prescriptions, SEED_PRESCRIPTIONS);
    if (patientId) list = list.filter((p) => p.patientId === Number(patientId));
    return list;
  },
  getById(id) {
    return load(KEY.prescriptions, SEED_PRESCRIPTIONS).find(
      (p) => p.id === Number(id),
    );
  },
  create(data) {
    const list = load(KEY.prescriptions, SEED_PRESCRIPTIONS);
    const rx = {
      ...data,
      id: nextId(KEY.prescriptions, list),
      pharmacyStatus: "pending",
    };
    list.push(rx);
    save(KEY.prescriptions, list);
    return rx;
  },
  updatePharmacyStatus(id, status) {
    const list = load(KEY.prescriptions, SEED_PRESCRIPTIONS);
    const idx = list.findIndex((p) => p.id === Number(id));
    if (idx >= 0) {
      list[idx].pharmacyStatus = status;
      save(KEY.prescriptions, list);
    }
  },
};

// ─── Admissions (IPD) ─────────────────────────────────────────────────────────

export const mockAdmissions = {
  getAll(filters = {}) {
    let list = load(KEY.admissions, SEED_ADMISSIONS);
    if (filters.status) list = list.filter((a) => a.status === filters.status);
    if (filters.patientId)
      list = list.filter((a) => a.patientId === Number(filters.patientId));
    return list;
  },
  getById(id) {
    return load(KEY.admissions, SEED_ADMISSIONS).find((a) => a.id === id);
  },
  create(data) {
    const list = load(KEY.admissions, SEED_ADMISSIONS);
    const admission = {
      ...data,
      id: `IPD-${String(list.length + 1).padStart(3, "0")}`,
      status: "admitted",
      admitDate: new Date().toISOString().split("T")[0],
      dischargeDate: null,
      vitals: [],
    };
    list.push(admission);
    save(KEY.admissions, list);
    // Update bed status
    if (data.bed) {
      const beds = load(KEY.beds, SEED_BEDS);
      const bedIdx = beds.findIndex((b) => b.id === data.bed);
      if (bedIdx >= 0) {
        beds[bedIdx].status = "occupied";
        beds[bedIdx].patientName = data.patientName;
        beds[bedIdx].patientId = data.patientId;
        save(KEY.beds, beds);
      }
    }
    return admission;
  },
  discharge(id, notes) {
    const list = load(KEY.admissions, SEED_ADMISSIONS);
    const idx = list.findIndex((a) => a.id === id);
    if (idx >= 0) {
      const admission = list[idx];
      list[idx] = {
        ...admission,
        status: "discharged",
        dischargeDate: new Date().toISOString().split("T")[0],
        dischargeNotes: notes,
      };
      save(KEY.admissions, list);
      // Free up bed
      if (admission.bed) {
        const beds = load(KEY.beds, SEED_BEDS);
        const bedIdx = beds.findIndex((b) => b.id === admission.bed);
        if (bedIdx >= 0) {
          beds[bedIdx].status = "available";
          beds[bedIdx].patientName = null;
          beds[bedIdx].patientId = null;
          save(KEY.beds, beds);
        }
      }
    }
  },
  addVitals(id, vitals) {
    const list = load(KEY.admissions, SEED_ADMISSIONS);
    const idx = list.findIndex((a) => a.id === id);
    if (idx >= 0) {
      list[idx].vitals = [
        ...(list[idx].vitals || []),
        { ...vitals, date: new Date().toISOString().split("T")[0] },
      ];
      save(KEY.admissions, list);
    }
  },
  transfer(id, newWard, newBed) {
    const list = load(KEY.admissions, SEED_ADMISSIONS);
    const idx = list.findIndex((a) => a.id === id);
    if (idx >= 0) {
      list[idx].ward = newWard;
      list[idx].bed = newBed;
      save(KEY.admissions, list);
    }
  },
};

// ─── Wards & Beds ─────────────────────────────────────────────────────────────

export const mockWards = {
  getAll() {
    return load(KEY.wards, SEED_WARDS);
  },
  update(id, data) {
    const list = load(KEY.wards, SEED_WARDS);
    const idx = list.findIndex((w) => w.id === Number(id));
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data };
      save(KEY.wards, list);
    }
  },
};

export const mockBeds = {
  getAll(wardId) {
    let list = load(KEY.beds, SEED_BEDS);
    if (wardId) list = list.filter((b) => b.wardId === Number(wardId));
    return list;
  },
  getAvailable() {
    return load(KEY.beds, SEED_BEDS).filter((b) => b.status === "available");
  },
  updateStatus(bedId, status, patientName = null, patientId = null) {
    const list = load(KEY.beds, SEED_BEDS);
    const idx = list.findIndex((b) => b.id === bedId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], status, patientName, patientId };
      save(KEY.beds, list);
    }
  },
};

// ─── Lab Reports ──────────────────────────────────────────────────────────────

export const mockLabReports = {
  getAll(filters = {}) {
    let list = load(KEY.labReports, SEED_LAB_REPORTS);
    if (filters.patientId)
      list = list.filter((r) => r.patientId === Number(filters.patientId));
    if (filters.status) list = list.filter((r) => r.status === filters.status);
    return list;
  },
  getById(id) {
    return load(KEY.labReports, SEED_LAB_REPORTS).find((r) => r.id === id);
  },
  create(data) {
    const list = load(KEY.labReports, SEED_LAB_REPORTS);
    const report = {
      ...data,
      id: `LAB-${String(list.length + 1).padStart(3, "0")}`,
      orderedDate: new Date().toISOString().split("T")[0],
      resultDate: null,
      status: "pending",
      result: "",
      interpretation: "",
      fileUrl: null,
    };
    list.push(report);
    save(KEY.labReports, list);
    return report;
  },
  updateResult(id, result, interpretation) {
    const list = load(KEY.labReports, SEED_LAB_REPORTS);
    const idx = list.findIndex((r) => r.id === id);
    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        result,
        interpretation,
        status: "completed",
        resultDate: new Date().toISOString().split("T")[0],
      };
      save(KEY.labReports, list);
      return list[idx];
    }
  },
  updateStatus(id, status) {
    const list = load(KEY.labReports, SEED_LAB_REPORTS);
    const idx = list.findIndex((r) => r.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      save(KEY.labReports, list);
    }
  },
};

// ─── EMR (Electronic Medical Records) ────────────────────────────────────────

export const mockEMR = {
  getByPatient(patientId) {
    const list = load(KEY.emr, SEED_EMR);
    return list.find((e) => e.patientId === Number(patientId)) || null;
  },
  addVitals(patientId, vitals) {
    const list = load(KEY.emr, SEED_EMR);
    const idx = list.findIndex((e) => e.patientId === Number(patientId));
    const entry = { ...vitals, date: new Date().toISOString().split("T")[0] };
    if (idx >= 0) {
      list[idx].vitals = [entry, ...(list[idx].vitals || [])];
    } else {
      list.push({
        patientId: Number(patientId),
        vitals: [entry],
        doctorNotes: [],
        diagnoses: [],
        allergies: [],
        bloodGroup: "",
        chronicConditions: [],
      });
    }
    save(KEY.emr, list);
  },
  addDoctorNote(patientId, note, doctorName) {
    const list = load(KEY.emr, SEED_EMR);
    const idx = list.findIndex((e) => e.patientId === Number(patientId));
    const entry = {
      note,
      doctorName,
      date: new Date().toISOString().split("T")[0],
    };
    if (idx >= 0) {
      list[idx].doctorNotes = [entry, ...(list[idx].doctorNotes || [])];
    } else {
      list.push({
        patientId: Number(patientId),
        vitals: [],
        doctorNotes: [entry],
        diagnoses: [],
        allergies: [],
        bloodGroup: "",
        chronicConditions: [],
      });
    }
    save(KEY.emr, list);
  },
  addDiagnosis(patientId, diagnosisData) {
    const list = load(KEY.emr, SEED_EMR);
    const idx = list.findIndex((e) => e.patientId === Number(patientId));
    const entry = {
      ...diagnosisData,
      date: new Date().toISOString().split("T")[0],
    };
    if (idx >= 0) {
      list[idx].diagnoses = [entry, ...(list[idx].diagnoses || [])];
    }
    save(KEY.emr, list);
  },
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const mockNotifications = {
  getForUser(userId, role) {
    const allNotifications = load(KEY.notifications, SEED_NOTIFICATIONS);
    const key = `${role}${userId}`;
    return allNotifications[key] || [];
  },
  markRead(userId, role, notifId) {
    const allNotifications = load(KEY.notifications, SEED_NOTIFICATIONS);
    const key = `${role}${userId}`;
    if (allNotifications[key]) {
      const idx = allNotifications[key].findIndex((n) => n.id === notifId);
      if (idx >= 0) allNotifications[key][idx].read = true;
      save(KEY.notifications, allNotifications);
    }
  },
  markAllRead(userId, role) {
    const allNotifications = load(KEY.notifications, SEED_NOTIFICATIONS);
    const key = `${role}${userId}`;
    if (allNotifications[key]) {
      allNotifications[key] = allNotifications[key].map((n) => ({
        ...n,
        read: true,
      }));
      save(KEY.notifications, allNotifications);
    }
  },
  addNotification(userId, role, notification) {
    const allNotifications = load(KEY.notifications, SEED_NOTIFICATIONS);
    const key = `${role}${userId}`;
    if (!allNotifications[key]) allNotifications[key] = [];
    allNotifications[key].unshift({
      ...notification,
      id: Date.now(),
      read: false,
      time: new Date().toISOString(),
    });
    save(KEY.notifications, allNotifications);
  },
};

// ─── Activity Feed ────────────────────────────────────────────────────────────

export const mockActivity = {
  getAll() {
    return load(KEY.activity, SEED_ACTIVITY);
  },
  add(activity) {
    const list = load(KEY.activity, SEED_ACTIVITY);
    const now = new Date();
    const newActivity = {
      ...activity,
      id: Date.now(),
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: "Today",
    };
    list.unshift(newActivity);
    save(KEY.activity, list.slice(0, 50)); // Keep last 50
    return newActivity;
  },
};

// ─── Analytics ────────────────────────────────────────────────────────────────

export const mockAnalytics = {
  dashboard() {
    const users = load(KEY.users, SEED_USERS);
    const doctors = load(KEY.doctors, SEED_DOCTORS);
    const appointments = load(KEY.appointments, SEED_APPOINTMENTS);
    const admissions = load(KEY.admissions, SEED_ADMISSIONS);
    const beds = load(KEY.beds, SEED_BEDS);

    const appointmentsByDepartment = {};
    appointments.forEach((a) => {
      appointmentsByDepartment[a.department] =
        (appointmentsByDepartment[a.department] || 0) + 1;
    });

    const usersByRole = {};
    users.forEach((u) => {
      usersByRole[u.role] = (usersByRole[u.role] || 0) + 1;
    });

    const todayStr = new Date().toISOString().split("T")[0];
    const todayAppointments = appointments.filter((a) => a.date === todayStr);

    const admittedPatients = admissions.filter((a) => a.status === "admitted");
    const availableBeds = beds.filter((b) => b.status === "available").length;

    return {
      totalUsers: users.filter((u) => u.role === "patient").length,
      totalDoctors: doctors.length,
      totalAppointments: appointments.length,
      todayAppointments: todayAppointments.length,
      admittedPatients: admittedPatients.length,
      availableBeds,
      appointmentsByDepartment,
      usersByRole,
      revenueToday: 84500,
    };
  },

  patient(patientId) {
    const appointments = load(KEY.appointments, SEED_APPOINTMENTS).filter(
      (a) => a.patientId === Number(patientId),
    );
    const prescriptions = load(KEY.prescriptions, SEED_PRESCRIPTIONS).filter(
      (p) => p.patientId === Number(patientId),
    );

    const appointmentsByStatus = {};
    appointments.forEach((a) => {
      appointmentsByStatus[a.status] =
        (appointmentsByStatus[a.status] || 0) + 1;
    });

    return {
      totalAppointments: appointments.length,
      upcomingVisits: appointments.filter((a) => a.status === "scheduled")
        .length,
      prescriptionCount: prescriptions.length,
      appointmentsByStatus,
    };
  },
};

// ─── Users (admin) ────────────────────────────────────────────────────────────

const AMBULANCE_DRIVERS = [
  {
    id: "DRV-001",
    name: "Rohit Sharma",
    phone: "+91 98765 43210",
    status: "available",
    license: "DL-AMB-1024",
    rating: 4.9,
    trips: 284,
    experience: "8 years",
    assignedAmbulance: "AMB-101",
  },
  {
    id: "DRV-002",
    name: "Amit Verma",
    phone: "+91 98765 43211",
    status: "on-duty",
    license: "DL-AMB-1042",
    rating: 4.8,
    trips: 219,
    experience: "6 years",
    assignedAmbulance: "AMB-102",
  },
  {
    id: "DRV-003",
    name: "Karan Singh",
    phone: "+91 98765 43212",
    status: "en-route",
    license: "DL-AMB-1088",
    rating: 4.7,
    trips: 173,
    experience: "5 years",
    assignedAmbulance: "AMB-103",
  },
  {
    id: "DRV-004",
    name: "Sameer Khan",
    phone: "+91 98765 43213",
    status: "off-duty",
    license: "DL-AMB-1096",
    rating: 4.6,
    trips: 141,
    experience: "4 years",
    assignedAmbulance: "AMB-104",
  },
];

const AMBULANCES = [
  {
    id: "AMB-101",
    plate: "DL 01 AM 101",
    type: "als",
    status: "available",
    driver: "Rohit Sharma",
    driverPhone: "+91 98765 43210",
    location: "Emergency Bay",
    fuel: 82,
    oxygen: 95,
    lat: 28.6139,
    lng: 77.209,
  },
  {
    id: "AMB-102",
    plate: "DL 01 AM 102",
    type: "bls",
    status: "on-call",
    driver: "Amit Verma",
    driverPhone: "+91 98765 43211",
    location: "City Centre",
    fuel: 64,
    oxygen: 88,
    lat: 28.6205,
    lng: 77.2167,
  },
  {
    id: "AMB-103",
    plate: "DL 01 AM 103",
    type: "cardiac",
    status: "en-route",
    driver: "Karan Singh",
    driverPhone: "+91 98765 43212",
    location: "Ring Road",
    fuel: 36,
    oxygen: 76,
    lat: 28.6081,
    lng: 77.2245,
  },
  {
    id: "AMB-104",
    plate: "DL 01 AM 104",
    type: "neonatal",
    status: "maintenance",
    driver: "Sameer Khan",
    driverPhone: "+91 98765 43213",
    location: "Service Yard",
    fuel: 18,
    oxygen: 90,
    lat: 28.6015,
    lng: 77.2122,
  },
];

let ambulanceEmergencies = [
  {
    id: "EMG-501",
    type: "Cardiac emergency",
    patient: "Ramesh Kumar",
    age: 58,
    phone: "+91 91234 56780",
    pickup: "Connaught Place",
    pickupLat: 28.6304,
    pickupLng: 77.2177,
    destination: "NovaCare ER",
    priority: "critical",
    status: "active",
    assignedAmbulance: "AMB-103",
    driver: "Karan Singh",
    driverPhone: "+91 98765 43212",
    eta: 7,
    createdAt: new Date().toISOString(),
  },
  {
    id: "EMG-502",
    type: "Road accident",
    patient: "Priya Nair",
    age: 34,
    phone: "+91 91234 56781",
    pickup: "India Gate",
    pickupLat: 28.6129,
    pickupLng: 77.2295,
    destination: "NovaCare Trauma",
    priority: "high",
    status: "pending",
    eta: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "EMG-503",
    type: "Breathing difficulty",
    patient: "Fatima Ali",
    age: 71,
    phone: "+91 91234 56782",
    pickup: "Karol Bagh",
    pickupLat: 28.6517,
    pickupLng: 77.1904,
    destination: "NovaCare ER",
    priority: "medium",
    status: "pending",
    eta: 15,
    createdAt: new Date().toISOString(),
  },
];

export const ambulanceApi = {
  async getAll() {
    return AMBULANCES;
  },
  async getAvailable() {
    return AMBULANCES.filter((ambulance) => ambulance.status === "available");
  },
};

export const driverApi = {
  async getAll() {
    return AMBULANCE_DRIVERS;
  },
  async getAvailable() {
    return AMBULANCE_DRIVERS.filter((driver) =>
      ["available", "on-duty"].includes(driver.status),
    );
  },
};

export const emergencyApi = {
  async getAll() {
    return ambulanceEmergencies;
  },
  async getPending() {
    return ambulanceEmergencies.filter((emergency) => emergency.status === "pending");
  },
  async getActive() {
    return ambulanceEmergencies.filter((emergency) =>
      ["active", "assigned", "en-route"].includes(emergency.status),
    );
  },
  async assign(id, ambulanceId, driver, driverPhone, eta = 10) {
    ambulanceEmergencies = ambulanceEmergencies.map((emergency) =>
      emergency.id === id
        ? {
            ...emergency,
            status: "active",
            assignedAmbulance: ambulanceId,
            driver,
            driverPhone,
            eta,
          }
        : emergency,
    );
    return ambulanceEmergencies.find((emergency) => emergency.id === id);
  },
  async updateStatus(id, status) {
    ambulanceEmergencies = ambulanceEmergencies.map((emergency) =>
      emergency.id === id ? { ...emergency, status } : emergency,
    );
    return ambulanceEmergencies.find((emergency) => emergency.id === id);
  },
};

export const analyticsApi = {
  async getDashboard() {
    const activeEmergencies = ambulanceEmergencies.filter((emergency) =>
      ["active", "assigned", "en-route"].includes(emergency.status),
    ).length;
    const available = AMBULANCES.filter((ambulance) => ambulance.status === "available").length;
    const onCall = AMBULANCES.filter((ambulance) =>
      ["on-call", "en-route"].includes(ambulance.status),
    ).length;
    const maintenance = AMBULANCES.filter((ambulance) =>
      ["maintenance", "offline"].includes(ambulance.status),
    ).length;

    return {
      activeEmergencies,
      available,
      onDuty: AMBULANCE_DRIVERS.filter((driver) => driver.status !== "off-duty").length,
      avgResponseTime: 8,
      completedToday: 14,
      totalAmbulances: AMBULANCES.length,
      onCall,
      maintenance,
      lowFuel: AMBULANCES.filter((ambulance) => ambulance.fuel < 25).length,
      weeklyDispatches: [
        { day: "Mon", dispatches: 18 },
        { day: "Tue", dispatches: 22 },
        { day: "Wed", dispatches: 16 },
        { day: "Thu", dispatches: 27 },
        { day: "Fri", dispatches: 24 },
        { day: "Sat", dispatches: 19 },
        { day: "Sun", dispatches: 21 },
      ],
      emergenciesByType: [
        { name: "Cardiac", value: 32 },
        { name: "Trauma", value: 26 },
        { name: "Respiratory", value: 21 },
        { name: "Transfer", value: 14 },
      ],
      hourlyActivity: [
        { hour: "00", calls: 3 },
        { hour: "04", calls: 2 },
        { hour: "08", calls: 7 },
        { hour: "12", calls: 11 },
        { hour: "16", calls: 9 },
        { hour: "20", calls: 6 },
      ],
    };
  },
};



// ─── Billing ──────────────────────────────────────────────────────────────────

export const mockBilling = {
  getAll(filters = {}) {
    let list = load(KEY.billing, SEED_BILLING);
    if (filters.patientId)
      list = list.filter((b) => b.patientId === Number(filters.patientId));
    if (filters.status) list = list.filter((b) => b.status === filters.status);
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  getById(id) {
    return load(KEY.billing, SEED_BILLING).find((b) => b.id === id);
  },
  create(data) {
    const list = load(KEY.billing, SEED_BILLING);
    const inv = {
      ...data,
      id: `INV-${String(list.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      dueDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().split("T")[0];
      })(),
      status: "pending",
      paidAmount: 0,
      paymentMethod: null,
      paymentDate: null,
    };
    list.push(inv);
    save(KEY.billing, list);
    return inv;
  },
  markPaid(id, method) {
    const list = load(KEY.billing, SEED_BILLING);
    const idx = list.findIndex((b) => b.id === id);
    if (idx >= 0) {
      list[idx].status = "paid";
      list[idx].paidAmount = list[idx].totalAmount;
      list[idx].paymentMethod = method || "Online";
      list[idx].paymentDate = new Date().toISOString().split("T")[0];
      save(KEY.billing, list);
      return list[idx];
    }
  },
  update(id, data) {
    const list = load(KEY.billing, SEED_BILLING);
    const idx = list.findIndex((b) => b.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data };
      save(KEY.billing, list);
      return list[idx];
    }
  },
};

// ─── Workflow Events (cross-role notification dispatcher) ─────────────────────
// Call these from API layer whenever a key hospital event occurs.
// Each event auto-pushes notifications to all relevant roles.

export const workflowEvents = {
  /** Appointment booked (by patient or receptionist) */
  appointmentBooked({ appointment, bookedByRole = "patient" }) {
    // Notify doctor
    const doctorUser = load(KEY.users, SEED_USERS).find(
      (u) => u.doctorId === appointment.doctorId,
    );
    if (doctorUser) {
      const allNotifications = load(KEY.notifications, SEED_NOTIFICATIONS);
      const key = `doctor${doctorUser.id}`;
      if (!allNotifications[key]) allNotifications[key] = [];
      allNotifications[key].unshift({
        id: Date.now(),
        read: false,
        time: new Date().toISOString(),
        type: "appointment",
        icon: "calendar",
        title: "New Appointment Booked",
        message: `${appointment.patientName} booked an appointment for ${appointment.date} at ${appointment.time}.`,
      });
      save(KEY.notifications, allNotifications);
    }
    // Notify patient
    const allN = load(KEY.notifications, SEED_NOTIFICATIONS);
    const pk = `patient${appointment.patientId}`;
    if (!allN[pk]) allN[pk] = [];
    allN[pk].unshift({
      id: Date.now() + 1,
      read: false,
      time: new Date().toISOString(),
      type: "appointment",
      icon: "calendar",
      title: "Appointment Confirmed",
      message: `Your appointment with ${appointment.doctorName} on ${appointment.date} at ${appointment.time} is confirmed.`,
    });
    save(KEY.notifications, allN);
    // Activity feed
    const actList = load(KEY.activity, SEED_ACTIVITY);
    actList.unshift({
      id: Date.now(),
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: "Today",
      type: "appt",
      icon: "calendar",
      title: "Appointment Booked",
      desc: `${appointment.patientName} booked with ${appointment.doctorName} (${appointment.department}).`,
    });
    save(KEY.activity, actList.slice(0, 50));
  },

  /** Appointment completed by doctor → auto-generate bill */
  appointmentCompleted({ appointment }) {
    const doctors = load(KEY.doctors, SEED_DOCTORS);
    const doctor = doctors.find((d) => d.id === appointment.doctorId);
    const fee = doctor?.fee || 500;
    // Create invoice
    const billing = load(KEY.billing, SEED_BILLING);
    const existing = billing.find((b) => b.appointmentId === appointment.id);
    let inv;
    if (!existing) {
      inv = {
        id: `INV-${String(billing.length + 1).padStart(3, "0")}`,
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        doctorName: appointment.doctorName,
        department: appointment.department,
        date: new Date().toISOString().split("T")[0],
        dueDate: (() => {
          const d = new Date();
          d.setDate(d.getDate() + 30);
          return d.toISOString().split("T")[0];
        })(),
        status: "pending",
        paidAmount: 0,
        paymentMethod: null,
        paymentDate: null,
        items: [
          {
            description: `Consultation Fee – ${appointment.department}`,
            amount: fee,
          },
        ],
        totalAmount: fee,
        generatedBy: "system",
      };
      billing.push(inv);
      save(KEY.billing, billing);
    }
    // Notify patient about bill
    const allN = load(KEY.notifications, SEED_NOTIFICATIONS);
    const pk = `patient${appointment.patientId}`;
    if (!allN[pk]) allN[pk] = [];
    allN[pk].unshift({
      id: Date.now(),
      read: false,
      time: new Date().toISOString(),
      type: "payment",
      icon: "rupee",
      title: "Bill Generated",
      message: `Your consultation with ${appointment.doctorName} is complete. Bill of ₹${fee} has been generated.`,
    });
    save(KEY.notifications, allN);
    // Activity feed
    const actList = load(KEY.activity, SEED_ACTIVITY);
    actList.unshift({
      id: Date.now(),
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: "Today",
      type: "payment",
      icon: "rupee",
      title: "Appointment Completed & Billed",
      desc: `${appointment.patientName} visit with ${appointment.doctorName} completed. Bill ₹${fee} generated.`,
    });
    save(KEY.activity, actList.slice(0, 50));
    return inv;
  },

  /** Prescription created by doctor */
  prescriptionCreated({ prescription }) {
    const allN = load(KEY.notifications, SEED_NOTIFICATIONS);
    // Notify patient
    const pk = `patient${prescription.patientId}`;
    if (!allN[pk]) allN[pk] = [];
    allN[pk].unshift({
      id: Date.now(),
      read: false,
      time: new Date().toISOString(),
      type: "prescription",
      icon: "pill",
      title: "Prescription Created",
      message: `${prescription.doctorName} has created a prescription for you. Diagnosis: ${prescription.diagnosis || "General"}.`,
    });
    // Notify admin
    const ak = "admin1";
    if (!allN[ak]) allN[ak] = [];
    allN[ak].unshift({
      id: Date.now() + 1,
      read: false,
      time: new Date().toISOString(),
      type: "prescription",
      icon: "pill",
      title: "New Prescription",
      message: `${prescription.doctorName} created Rx for ${prescription.patientName}.`,
    });
    save(KEY.notifications, allN);
    // Activity
    const actList = load(KEY.activity, SEED_ACTIVITY);
    actList.unshift({
      id: Date.now(),
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: "Today",
      type: "rx",
      icon: "pill",
      title: "Prescription Created",
      desc: `${prescription.doctorName} created Rx for ${prescription.patientName}.`,
    });
    save(KEY.activity, actList.slice(0, 50));
  },

  /** Lab report uploaded / completed */
  labReportReady({ report }) {
    const allN = load(KEY.notifications, SEED_NOTIFICATIONS);
    const pk = `patient${report.patientId}`;
    if (!allN[pk]) allN[pk] = [];
    allN[pk].unshift({
      id: Date.now(),
      read: false,
      time: new Date().toISOString(),
      type: "lab",
      icon: "flask",
      title: "Lab Report Ready",
      message: `Your ${report.testName} report is now available for download.`,
    });
    // Notify doctor
    const doctorUser = load(KEY.users, SEED_USERS).find(
      (u) => u.doctorId === report.doctorId,
    );
    if (doctorUser) {
      const dk = `doctor${doctorUser.id}`;
      if (!allN[dk]) allN[dk] = [];
      allN[dk].unshift({
        id: Date.now() + 1,
        read: false,
        time: new Date().toISOString(),
        type: "lab",
        icon: "flask",
        title: "Lab Result Available",
        message: `${report.testName} result for ${report.patientName} is ready.`,
      });
    }
    save(KEY.notifications, allN);
    const actList = load(KEY.activity, SEED_ACTIVITY);
    actList.unshift({
      id: Date.now(),
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: "Today",
      type: "lab",
      icon: "flask",
      title: "Lab Report Uploaded",
      desc: `${report.testName} for ${report.patientName} marked completed.`,
    });
    save(KEY.activity, actList.slice(0, 50));
  },

  /** Payment made by patient */
  paymentMade({ invoice }) {
    const allN = load(KEY.notifications, SEED_NOTIFICATIONS);
    const pk = `patient${invoice.patientId}`;
    if (!allN[pk]) allN[pk] = [];
    allN[pk].unshift({
      id: Date.now(),
      read: false,
      time: new Date().toISOString(),
      type: "payment",
      icon: "rupee",
      title: "Payment Confirmed",
      message: `Payment of ₹${invoice.totalAmount} for ${invoice.id} confirmed. Thank you!`,
    });
    const ak = "admin1";
    if (!allN[ak]) allN[ak] = [];
    allN[ak].unshift({
      id: Date.now() + 1,
      read: false,
      time: new Date().toISOString(),
      type: "payment",
      icon: "rupee",
      title: "Payment Received",
      message: `₹${invoice.totalAmount} received from ${invoice.patientName} for ${invoice.id}.`,
    });
    save(KEY.notifications, allN);
    const actList = load(KEY.activity, SEED_ACTIVITY);
    actList.unshift({
      id: Date.now(),
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: "Today",
      type: "payment",
      icon: "rupee",
      title: "Payment Received",
      desc: `₹${invoice.totalAmount} from ${invoice.patientName} – ${invoice.id}.`,
    });
    save(KEY.activity, actList.slice(0, 50));
  },

  /** Patient admitted to IPD */
  patientAdmitted({ admission }) {
    const allN = load(KEY.notifications, SEED_NOTIFICATIONS);
    const pk = `patient${admission.patientId}`;
    if (!allN[pk]) allN[pk] = [];
    allN[pk].unshift({
      id: Date.now(),
      read: false,
      time: new Date().toISOString(),
      type: "admission",
      icon: "bed",
      title: "Admission Confirmed",
      message: `You have been admitted to ${admission.ward}, Bed ${admission.bed}. Doctor: ${admission.doctorName}.`,
    });
    const doctorUser = load(KEY.users, SEED_USERS).find(
      (u) => u.doctorId === admission.doctorId,
    );
    if (doctorUser) {
      const dk = `doctor${doctorUser.id}`;
      if (!allN[dk]) allN[dk] = [];
      allN[dk].unshift({
        id: Date.now() + 1,
        read: false,
        time: new Date().toISOString(),
        type: "admission",
        icon: "bed",
        title: "New IPD Patient",
        message: `${admission.patientName} has been admitted to your care in ${admission.ward}.`,
      });
    }
    save(KEY.notifications, allN);
    const actList = load(KEY.activity, SEED_ACTIVITY);
    actList.unshift({
      id: Date.now(),
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: "Today",
      type: "admit",
      icon: "bed",
      title: "New IPD Admission",
      desc: `${admission.patientName} admitted to ${admission.ward}, Bed ${admission.bed}.`,
    });
    save(KEY.activity, actList.slice(0, 50));
  },
};

// ─── Global Search ────────────────────────────────────────────────────────────

export const mockSearch = {
  search(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();

    const patients = load(KEY.users, SEED_USERS)
      .filter(
        (u) =>
          u.role === "patient" &&
          (u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)),
      )
      .slice(0, 3)
      .map((u) => ({
        type: "patient",
        label: u.name,
        subLabel: u.email,
        link: "/admin/patients",
        id: u.id,
      }));

    const doctors = load(KEY.doctors, SEED_DOCTORS)
      .filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.department.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q),
      )
      .slice(0, 3)
      .map((d) => ({
        type: "doctor",
        label: d.name,
        subLabel: `${d.specialization} · ${d.department}`,
        link: "/admin/doctors",
        id: d.id,
      }));

    const appointments = load(KEY.appointments, SEED_APPOINTMENTS)
      .filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.doctorName.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q),
      )
      .slice(0, 3)
      .map((a) => ({
        type: "appointment",
        label: `${a.patientName} → ${a.doctorName}`,
        subLabel: `${a.date} · ${a.department}`,
        link: "/admin/appointments",
        id: a.id,
      }));

    return [...patients, ...doctors, ...appointments];
  },
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const mockUsers = {
  getAll(filters = {}) {
    let list = load(KEY.users, SEED_USERS);
    if (filters.role) list = list.filter((u) => u.role === filters.role);
    return list;
  },
  create(data) {
    const list = load(KEY.users, SEED_USERS);
    const user = { ...data, id: nextId(KEY.users, list) };
    list.push(user);
    save(KEY.users, list);
    return user;
  },
  updateStatus(id, status) {
    const list = load(KEY.users, SEED_USERS);
    const idx = list.findIndex(u => u.id === Number(id));
    if (idx >= 0) {
      list[idx].status = status;
      save(KEY.users, list);
      return list[idx];
    }
    throw new Error("User not found");
  },
  delete(id) {
    const list = load(KEY.users, SEED_USERS).filter(u => u.id !== Number(id));
    save(KEY.users, list);
  }
};
