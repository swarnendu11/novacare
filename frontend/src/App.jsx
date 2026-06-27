/**
 * NovaCare ?" Unified Healthcare Frontend Application
 */

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleBasedRoute from "./routes/RoleBasedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import { DashboardSkeleton } from "./shared/components/Loading";
import ErrorBoundary from "./shared/components/ErrorBoundary";

// ==========================================
// Base & Auth Pages
// ==========================================
const LoginRole = lazy(() => import("./auth/LoginRole"));
const LoginSelect = lazy(() => import("./auth/LoginSelect"));
const RegisterRole = lazy(() => import("./auth/RegisterRole"));
const RegisterSelect = lazy(() => import("./auth/RegisterSelect"));
const Login = lazy(() => import("./auth/Login"));
const Register = lazy(() => import("./auth/Register"));
const NotFound = lazy(() => import("./components/errors/NotFound"));
const Unauthorized = lazy(() => import("./components/errors/Unauthorized"));

const Landing = lazy(() => import("./components/public/Landing"));
const Contact = lazy(() => import("./components/public/Contact"));
const DepartmentsPage = lazy(() => import("./components/public/DepartmentsPage"));
const Terms = lazy(() => import("./components/public/Terms"));
const Privacy = lazy(() => import("./components/public/Privacy"));

// ==========================================
// Admin Pages
// ==========================================
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const ManageDoctors = lazy(() => import("./admin/ManageDoctors"));
const ManagePatients = lazy(() => import("./admin/ManagePatients"));
const StaffManager = lazy(() => import("./admin/StaffManager"));
const ManageDepartments = lazy(() => import("./admin/ManageDepartments"));
const IPDManagement = lazy(() => import("./admin/IPDManagement"));
const WardManagement = lazy(() => import("./admin/WardManagement"));
const BillingManagement = lazy(() => import("./admin/BillingManagement"));
const PharmacyManagement = lazy(() => import("./admin/PharmacyManagement"));
const LabManagement = lazy(() => import("./admin/LabManagement"));
const RoomManagement = lazy(() => import("./admin/RoomManagement"));
const AmbulanceManagement = lazy(() => import("./admin/AmbulanceManagement"));
const AdminAppointments = lazy(() => import("./admin/AdminAppointments"));
const SystemSettings = lazy(() => import("./admin/SystemSettings"));
const AdminProfile = lazy(() => import("./admin/AdminProfile"));

// ==========================================
// Doctor Pages
// ==========================================
const DoctorDashboard = lazy(() => import("./doctor/DoctorDashboard"));
const DoctorAppointments = lazy(() => import("./doctor/DoctorAppointments"));
const CreatePrescription = lazy(() => import("./doctor/CreatePrescription"));
const PatientRecords = lazy(() => import("./doctor/PatientRecords"));
const EMRInterface = lazy(() => import("./doctor/EMRInterface"));
const DoctorLabReports = lazy(() => import("./doctor/DoctorLabReports"));
const IPDPatients = lazy(() => import("./doctor/IPDPatients"));
// const AdmitPatient = lazy(() => import("./doctor/AdmitPatient"));
const ScheduleManager = lazy(() => import("./doctor/ScheduleManager"));
const DoctorEarnings = lazy(() => import("./doctor/DoctorEarnings"));
const DoctorProfile = lazy(() => import("./doctor/DoctorProfile"));

// ==========================================
// Patient Pages
// ==========================================
const PatientDashboard = lazy(() => import("./patient/PatientDashboard"));
const BookAppointmentPatient = lazy(() => import("./patient/BookAppointment"));
const MyAppointments = lazy(() => import("./patient/MyAppointments"));
const MedicalHistory = lazy(() => import("./patient/MedicalHistory"));
const Prescriptions = lazy(() => import("./patient/Prescriptions"));
const PatientLabReports = lazy(() => import("./patient/PatientLabReports"));
const PatientBilling = lazy(() => import("./patient/Billing"));
const PatientProfile = lazy(() => import("./patient/Profile"));

// ==========================================
// Receptionist Pages
// ==========================================
const ReceptionistDashboard = lazy(() => import("./receptionist/ReceptionistDashboard"));
const ReceptionistAppointments = lazy(() => import("./receptionist/ReceptionistAppointments"));
const BookAppointmentReceptionist = lazy(() => import("./receptionist/BookAppointment"));
const PatientDirectory = lazy(() => import("./receptionist/PatientDirectory"));
const QueueManager = lazy(() => import("./receptionist/QueueManager"));
const ReceptionDeskBilling = lazy(() => import("./receptionist/ReceptionDeskBilling"));
const ReceptionistIPD = lazy(() => import("./receptionist/ReceptionistIPD"));
const ReceptionistWard = lazy(() => import("./receptionist/ReceptionistWard"));
const ReceptionistProfile = lazy(() => import("./receptionist/ReceptionistProfile"));
// const AmbulanceTracking = lazy(() => import("./receptionist/AmbulanceTracking"));
const DoctorRoster = lazy(() => import("./receptionist/DoctorRoster"));

// ==========================================
// Nurse Pages
// ==========================================
const NurseDashboard = lazy(() => import("./nurse/NurseDashboard"));
const NurseProfile = lazy(() => import("./nurse/NurseProfile"));
const AssignedPatients = lazy(() => import("./nurse/AssignedPatients"));
const NurseTasks = lazy(() => import("./nurse/NurseTasks"));
const NurseReports = lazy(() => import("./nurse/NurseReports"));
const ShiftHandover = lazy(() => import("./nurse/ShiftHandover"));
const WardInventory = lazy(() => import("./nurse/WardInventory"));
const CodeBlue = lazy(() => import("./nurse/CodeBlue"));
const NurseVitals = lazy(() => import("./nurse/NurseVitals"));
const NurseMedication = lazy(() => import("./nurse/NurseMedication"));

// ==========================================
// Wardboy Pages
// ==========================================
const WardboyDashboard = lazy(() => import("./wardboy/WardBoyDashboard"));
const WardBoyProfile = lazy(() => import("./wardboy/WardBoyProfile"));
const WardBoyTasks = lazy(() => import("./wardboy/WardBoyTasks"));
const PatientMovement = lazy(() => import("./wardboy/PatientMovement"));
const RoomInfo = lazy(() => import("./wardboy/RoomInfo"));
const MaintenanceLog = lazy(() => import("./wardboy/MaintenanceLog"));
const SupplyTransport = lazy(() => import("./wardboy/SupplyTransport"));

// ==========================================
// Pharmacy Pages
// ==========================================
const PharmacyDashboard = lazy(() => import("./pharmacy/PharmacyDashboard"));
const PrescriptionQueue = lazy(() => import("./pharmacy/PrescriptionQueue"));
const InventoryManagement = lazy(() => import("./pharmacy/InventoryManagement"));
const PharmacyPOS = lazy(() => import("./pharmacy/PharmacyPOS"));
const PharmacyProfile = lazy(() => import("./pharmacy/PharmacyProfile"));

// ==========================================
// Ambulance Pages
// ==========================================
const AmbulanceDashboard = lazy(() => import("./ambulance/Dashboard"));
const EmergencyRequests = lazy(() => import("./ambulance/EmergencyRequests"));
const LiveDispatch = lazy(() => import("./ambulance/LiveDispatch"));
const Tracking = lazy(() => import("./ambulance/Tracking"));
const Drivers = lazy(() => import("./ambulance/Drivers"));
const Vehicles = lazy(() => import("./ambulance/Vehicles"));
const Analytics = lazy(() => import("./ambulance/Analytics"));
const Settings = lazy(() => import("./ambulance/Settings"));
const AmbulanceProfile = lazy(() => import("./ambulance/Profile"));


// ==========================================
// Laboratory Pages
// ==========================================
const LabDashboard = lazy(() => import("./laboratory/LabDashboard"));
const TestRequests = lazy(() => import("./laboratory/TestRequests"));
const LabReports = lazy(() => import("./laboratory/LabReports"));
const LabProfile = lazy(() => import("./laboratory/LabProfile"));


// ==========================================
// Route Wrappers
// ==========================================
function AdminRoutesWrapper() {
  return (
    <RoleBasedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <Suspense fallback={<DashboardSkeleton />}>
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="doctors" element={<ManageDoctors />} />
            <Route path="patients" element={<ManagePatients />} />
            <Route path="staff" element={<StaffManager />} />
            <Route path="departments" element={<ManageDepartments />} />
            <Route path="ipd" element={<IPDManagement />} />
            <Route path="wards" element={<WardManagement />} />
            <Route path="billing" element={<BillingManagement />} />
            <Route path="pharmacy" element={<PharmacyManagement />} />
            <Route path="lab" element={<LabManagement />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="ambulance" element={<AmbulanceManagement />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </RoleBasedRoute>
  );
}

function DoctorRoutesWrapper() {
  return (
    <RoleBasedRoute allowedRoles={["doctor"]}>
      <DashboardLayout>
        <Suspense fallback={<DashboardSkeleton />}>
          <Routes>
            <Route index element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="prescriptions" element={<CreatePrescription />} />
            <Route path="records" element={<PatientRecords />} />
            <Route path="emr" element={<EMRInterface />} />
            <Route path="lab" element={<DoctorLabReports />} />
            <Route path="ipd-patients" element={<IPDPatients />} />
            {/* <Route path="admit" element={<AdmitPatient />} /> */}
            <Route path="schedule" element={<ScheduleManager />} />
            <Route path="earnings" element={<DoctorEarnings />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="*" element={<Navigate to="/doctor" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </RoleBasedRoute>
  );
}

function PatientRoutesWrapper() {
  return (
    <RoleBasedRoute allowedRoles={["patient"]}>
      <DashboardLayout>
        <Suspense fallback={<DashboardSkeleton />}>
          <Routes>
            <Route index element={<PatientDashboard />} />
            <Route path="book" element={<BookAppointmentPatient />} />
            <Route path="appointments" element={<MyAppointments />} />
            <Route path="history" element={<MedicalHistory />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="lab-reports" element={<PatientLabReports />} />
            <Route path="billing" element={<PatientBilling />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="book-appointment" element={<BookAppointmentPatient />} />
            <Route path="my-appointments" element={<MyAppointments />} />
            <Route path="medical-history" element={<MedicalHistory />} />
            <Route path="my-profile" element={<PatientProfile />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="*" element={<Navigate to="/patient" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </RoleBasedRoute>
  );
}

function ReceptionRoutesWrapper() {
  return (
    <RoleBasedRoute allowedRoles={["receptionist"]}>
      <DashboardLayout>
        <Suspense fallback={<DashboardSkeleton />}>
          <Routes>
            <Route index element={<ReceptionistDashboard />} />
            <Route path="appointments" element={<ReceptionistAppointments />} />
            <Route path="book" element={<BookAppointmentReceptionist />} />
            <Route path="patients" element={<PatientDirectory />} />
            <Route path="queue" element={<QueueManager />} />
            <Route path="billing" element={<ReceptionDeskBilling />} />
            <Route path="ipd" element={<ReceptionistIPD />} />
            <Route path="ward" element={<ReceptionistWard />} />
            <Route path="profile" element={<ReceptionistProfile />} />
            {/* <Route path="ambulance" element={<AmbulanceTracking />} /> */}
            <Route path="roster" element={<DoctorRoster />} />
            <Route path="*" element={<Navigate to="/receptionist" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </RoleBasedRoute>
  );
}

function NurseRoutesWrapper() {
  return (
    <RoleBasedRoute allowedRoles={["nurse"]}>
      <DashboardLayout>
        <Suspense fallback={<DashboardSkeleton />}>
          <Routes>
            <Route index element={<NurseDashboard />} />
            <Route path="patients" element={<AssignedPatients />} />
            <Route path="tasks" element={<NurseTasks />} />
            <Route path="handover" element={<ShiftHandover />} />
            <Route path="inventory" element={<WardInventory />} />
            <Route path="code-blue" element={<CodeBlue />} />
            <Route path="reports" element={<NurseReports />} />
            <Route path="vitals" element={<NurseVitals />} />
            <Route path="medication" element={<NurseMedication />} />
            <Route path="profile" element={<NurseProfile />} />
            <Route path="*" element={<Navigate to="/nurse" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </RoleBasedRoute>
  );
}

function WardboyRoutesWrapper() {
  return (
    <RoleBasedRoute allowedRoles={["wardboy"]}>
      <DashboardLayout>
        <Suspense fallback={<DashboardSkeleton />}>
          <Routes>
            <Route index element={<WardboyDashboard />} />
            <Route path="tasks" element={<WardBoyTasks />} />
            <Route path="movement" element={<PatientMovement />} />
            <Route path="ward-status" element={<RoomInfo />} />
            <Route path="maintenance" element={<MaintenanceLog />} />
            <Route path="transport" element={<SupplyTransport />} />
            <Route path="profile" element={<WardBoyProfile />} />
            <Route path="*" element={<Navigate to="/wardboy" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </RoleBasedRoute>
  );
}

function PharmacyRoutesWrapper() {
  return (
    <RoleBasedRoute allowedRoles={["pharmacy"]}>
      <DashboardLayout>
        <Suspense fallback={<DashboardSkeleton />}>
          <Routes>
            <Route index element={<PharmacyDashboard />} />
            <Route path="prescriptions" element={<PrescriptionQueue />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="billing" element={<PharmacyPOS />} />
            <Route path="profile" element={<PharmacyProfile />} />
            <Route path="*" element={<Navigate to="/pharmacy" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </RoleBasedRoute>
  );
}

function AmbulanceRoutesWrapper() {
  return (
    <RoleBasedRoute allowedRoles={["ambulance"]}>
      <DashboardLayout>
        <Suspense fallback={<DashboardSkeleton />}>
          <Routes>
            <Route index element={<AmbulanceDashboard />} />
            <Route path="dashboard" element={<AmbulanceDashboard />} />
            <Route path="requests" element={<EmergencyRequests />} />
            <Route path="dispatch" element={<LiveDispatch />} />
            <Route path="tracking" element={<Tracking />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<AmbulanceProfile />} />
            <Route path="*" element={<Navigate to="/ambulance" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </RoleBasedRoute>
  );
}

function LaboratoryRoutesWrapper() {
  return (
    <RoleBasedRoute allowedRoles={["laboratory"]}>
      <DashboardLayout>
        <Suspense fallback={<DashboardSkeleton />}>
          <Routes>
            <Route index element={<LabDashboard />} />
            <Route path="requests" element={<TestRequests />} />
            <Route path="reports" element={<LabReports />} />
            <Route path="profile" element={<LabProfile />} />
            <Route path="*" element={<Navigate to="/laboratory" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </RoleBasedRoute>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-blue-600 font-medium">
                Initializing NovaCare...
              </div>
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginSelect />} />
              <Route path="/login/:role" element={<LoginRole />} />
              <Route path="/register" element={<RegisterSelect />} />
              <Route path="/register/:role" element={<RegisterRole />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Role Routes */}
              <Route path="/admin/*" element={<AdminRoutesWrapper />} />
              <Route path="/doctor/*" element={<DoctorRoutesWrapper />} />
              <Route path="/patient/*" element={<PatientRoutesWrapper />} />
              <Route path="/receptionist/*" element={<ReceptionRoutesWrapper />} />
              <Route path="/nurse/*" element={<NurseRoutesWrapper />} />
              <Route path="/wardboy/*" element={<WardboyRoutesWrapper />} />
              <Route path="/pharmacy/*" element={<PharmacyRoutesWrapper />} />
              <Route path="/laboratory/*" element={<LaboratoryRoutesWrapper />} />
              <Route path="/ambulance/*" element={<AmbulanceRoutesWrapper />} />

              {/* Fallback */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { 
              background: '#fff', 
              color: '#1e293b', 
              border: '1px solid #e2e8f0', 
              borderRadius: 16, 
              fontFamily: 'Outfit, sans-serif', 
              fontWeight: 600, 
              fontSize: 14, 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            duration: 3500,
          }}
        />
      </AuthProvider>
    </ErrorBoundary>
  );
}
