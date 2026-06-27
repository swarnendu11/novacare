/**
 * NovaCare – Frontend-only API layer
 * Simulates async HTTP calls using mock data stored in localStorage.
 * All functions return promises so page components need zero changes.
 *
 * CROSS-ROLE WORKFLOW:
 *  - appointmentsApi.create   → workflowEvents.appointmentBooked  → notifies doctor + patient
 *  - appointmentsApi.update(complete) → workflowEvents.appointmentCompleted → auto-generates bill
 *  - prescriptionsApi.create  → workflowEvents.prescriptionCreated → notifies patient + admin
 *  - labReportsApi.updateResult → workflowEvents.labReportReady  → notifies patient + doctor
 *  - billingApi.pay           → workflowEvents.paymentMade       → notifies patient + admin
 *  - admissionsApi.create     → workflowEvents.patientAdmitted   → notifies patient + doctor
 */

import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import {
  mockAuth,
  mockDoctors,
  mockDepartments,
  mockAppointments,
  mockPrescriptions,
  mockAnalytics,
  mockUsers,
  mockLabReports,
  mockAdmissions,
  mockWards,
  mockBeds,
  mockEMR,
  mockNotifications,
  mockBilling,
  workflowEvents,
} from "./mockData";

// Simulates network latency (ms)
const DELAY = 250;
const delay = (ms = DELAY) => new Promise((r) => setTimeout(r, ms));

const ok = async (fn, ms = DELAY) => {
  await delay(ms);
  return { data: fn() };
};
const fail = (msg) => {
  throw { response: { data: { message: msg } } };
};

const decodeGoogleCredential = (credential) => {
  if (!credential || typeof credential !== "string") {
    return {
      name: "Google User",
      email: `google_${Date.now()}@novacare.local`,
    };
  }

  try {
    const payload = credential.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return {
      name: decoded.name || decoded.given_name || "Google User",
      email: decoded.email || `google_${Date.now()}@novacare.local`,
    };
  } catch {
    return {
      name: "Google User",
      email: `google_${Date.now()}@novacare.local`,
    };
  }
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (creds) => {
    await delay();
    try {
      const result = mockAuth.login(
        creds.identifier || creds.email,
        creds.password,
      );
      return { data: result };
    } catch (e) {
      fail(e.message);
    }
  },

  register: async (data) => {
    await delay();
    try {
      const result = mockAuth.register(data);
      return { data: result };
    } catch (e) {
      fail(e.message);
    }
  },

  me: async () => {
    await delay(100);
    const token = localStorage.getItem("token");
    if (!token) fail("Unauthorized");

    try {
      const userId = token.replace("mock-jwt-", "");
      return { data: mockAuth.me(userId) };
    } catch (e) {
      fail(e.message);
    }
  },

  google: async (credential, role) => {
    await delay();
    const profile = decodeGoogleCredential(credential);
    const result = mockAuth.google({ ...profile, role });
    return { data: result };
  },

  forgotPassword: async (email) => {
    await delay();
    try {
      return { data: mockAuth.forgotPassword(email) };
    } catch (e) {
      fail(e.message);
    }
  },

  verifyOtp: async (data) => {
    await delay();
    try {
      const otp = typeof data === "string" ? data : data?.otp;
      return { data: mockAuth.verifyOtp(otp) };
    } catch (e) {
      fail(e.message);
    }
  },

  resetPassword: async (data) => {
    await delay();
    try {
      const password = typeof data === "string" ? data : data?.password;
      return { data: mockAuth.resetPassword(password) };
    } catch (e) {
      fail(e.message);
    }
  },
};

// ─── Doctors ──────────────────────────────────────────────────────────────────

export const doctorsApi = {
  getAll: (params) => ok(() => mockDoctors.getAll()),
  getById: (id) => ok(() => mockDoctors.getById(id)),
  create: (data) => ok(() => mockDoctors.create(data)),
  update: (id, d) => ok(() => mockDoctors.update(id, d)),
  delete: (id) => ok(() => mockDoctors.delete(id)),
};

// ─── Departments ──────────────────────────────────────────────────────────────

export const departmentsApi = {
  getAll: () => ok(() => mockDepartments.getAll()),
  getById: (id) => ok(() => mockDepartments.getById(id)),
  create: (data) => ok(() => mockDepartments.create(data)),
  update: (id, d) => ok(() => mockDepartments.update(id, d)),
  delete: (id) => ok(() => mockDepartments.delete(id)),
};

// ─── Appointments ─────────────────────────────────────────────────────────────

export const appointmentsApi = {
  getAll: (params = {}) => ok(() => mockAppointments.getAll(params)),
  getById: (id) => ok(() => mockAppointments.getById(id)),

  create: async (data) => {
    await delay();
    const appt = mockAppointments.create(data);
    // Fire cross-role notifications
    workflowEvents.appointmentBooked({ appointment: appt });
    return { data: appt };
  },

  update: async (id, data) => {
    await delay();
    const appt = mockAppointments.update(id, data);
    // When appointment is marked completed → auto-generate bill + notify patient
    if (data.status === "completed") {
      workflowEvents.appointmentCompleted({ appointment: appt });
    }
    return { data: appt };
  },
};

// ─── Prescriptions ────────────────────────────────────────────────────────────

export const prescriptionsApi = {
  getAll: (patientId) => ok(() => mockPrescriptions.getAll(patientId)),
  getForPatient: (patientId) => ok(() => mockPrescriptions.getAll(patientId)),
  getById: (id) => ok(() => mockPrescriptions.getById(id)),

  create: async (data) => {
    await delay();
    const rx = mockPrescriptions.create(data);
    // Fire cross-role notifications
    workflowEvents.prescriptionCreated({ prescription: rx });
    return { data: rx };
  },

  updatePharmacyStatus: async (id, status) => {
    await delay();
    mockPrescriptions.updatePharmacyStatus(id, status);
    return { data: { success: true } };
  },

  getPdfUrl: (id) => `#prescription-${id}`,
};

// ─── Analytics ────────────────────────────────────────────────────────────────

export const analyticsApi = {
  dashboard: () => ok(() => mockAnalytics.dashboard()),
  patient: () => {
    const token = localStorage.getItem("token");
    const uid = token ? Number(token.replace("mock-jwt-", "")) : 3;
    return ok(() => mockAnalytics.patient(uid));
  },
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersApi = {
  getAll: (params) => ok(() => mockUsers.getAll(params)),
  create: (data) => ok(() => mockUsers.create(data)),
  updateStatus: (id, status) => ok(() => mockUsers.updateStatus(id, status)),
  delete: (id) => ok(() => mockUsers.delete(id)),
};

// ─── Lab Reports ──────────────────────────────────────────────────────────────

export const labReportsApi = {
  getAll: (filters = {}) => ok(() => mockLabReports.getAll(filters)),
  getForPatient: (patientId) => ok(() => mockLabReports.getAll({ patientId })),
  getById: (id) => ok(() => mockLabReports.getById(id)),

  create: (data) => ok(() => mockLabReports.create(data)),

  updateResult: async (id, result, interpretation) => {
    await delay();
    const report = mockLabReports.updateResult(id, result, interpretation);
    if (report) workflowEvents.labReportReady({ report });
    return { data: report };
  },

  updateStatus: (id, status) =>
    ok(() => mockLabReports.updateStatus(id, status)),
};

// ─── Admissions (IPD) ─────────────────────────────────────────────────────────

export const admissionsApi = {
  getAll: (filters = {}) => ok(() => mockAdmissions.getAll(filters)),
  getById: (id) => ok(() => mockAdmissions.getById(id)),

  create: async (data) => {
    await delay();
    const admission = mockAdmissions.create(data);
    workflowEvents.patientAdmitted({ admission });
    return { data: admission };
  },

  discharge: async (id, notes) => {
    await delay();
    mockAdmissions.discharge(id, notes);
    return { data: { success: true } };
  },

  addVitals: (id, vitals) => ok(() => mockAdmissions.addVitals(id, vitals)),
  transfer: (id, newWard, newBed) =>
    ok(() => mockAdmissions.transfer(id, newWard, newBed)),
};

// ─── Wards & Beds ─────────────────────────────────────────────────────────────

export const wardsApi = {
  getAll: () => ok(() => mockWards.getAll()),
  update: (id, data) => ok(() => mockWards.update(id, data)),
};

export const bedsApi = {
  getAll: (wardId) => ok(() => mockBeds.getAll(wardId)),
  getAvailable: () => ok(() => mockBeds.getAvailable()),
  updateStatus: (bedId, status, patientName, patientId) =>
    ok(() => mockBeds.updateStatus(bedId, status, patientName, patientId)),
};

// ─── EMR (Electronic Medical Records) ─────────────────────────────────────────

export const emrApi = {
  getByPatient: (patientId) => ok(() => mockEMR.getByPatient(patientId)),
  addVitals: (patientId, vitals) =>
    ok(() => mockEMR.addVitals(patientId, vitals)),
  addDoctorNote: (patientId, note, doctorName) =>
    ok(() => mockEMR.addDoctorNote(patientId, note, doctorName)),
  addDiagnosis: (patientId, diagnosisData) =>
    ok(() => mockEMR.addDiagnosis(patientId, diagnosisData)),
};

// ─── Billing ──────────────────────────────────────────────────────────────────

export const billingApi = {
  getAll: (filters = {}) => ok(() => mockBilling.getAll(filters)),
  getForPatient: (patientId) => ok(() => mockBilling.getAll({ patientId })),
  getById: (id) => ok(() => mockBilling.getById(id)),
  create: (data) => ok(() => mockBilling.create(data)),

  pay: async (id, method) => {
    await delay();
    const invoice = mockBilling.markPaid(id, method);
    if (invoice) workflowEvents.paymentMade({ invoice });
    return { data: invoice };
  },

  update: (id, data) => ok(() => mockBilling.update(id, data)),
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationsApi = {
  getForUser: (userId, role) =>
    ok(() => mockNotifications.getForUser(userId, role)),
  markRead: (userId, role, notifId) =>
    ok(() => mockNotifications.markRead(userId, role, notifId)),
  markAllRead: (userId, role) =>
    ok(() => mockNotifications.markAllRead(userId, role)),
};

export default {};
