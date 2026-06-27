import express from "express";
import { 
  getDoctorAppointments, 
  createPrescription, 
  getPatientMedicalRecords, 
  addDiagnosisNote 
} from '../controllers/doctor.controller.js';
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/appointments", authorizeRoles("doctor"), getDoctorAppointments);
router.post("/prescriptions", authorizeRoles("doctor"), createPrescription);

router.get("/patients/:id/records", authorizeRoles("doctor", "nurse"), getPatientMedicalRecords);
router.post("/patients/:id/notes", authorizeRoles("doctor"), addDiagnosisNote);

export default router;
