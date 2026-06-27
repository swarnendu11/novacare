import express from "express";
import { getActiveAdmissions, logPatientVitals, getNurseAssignments } from '../controllers/nurse.controller.js';
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/admissions", authorizeRoles("nurse", "doctor"), getActiveAdmissions);
router.post("/admissions/:id/vitals", authorizeRoles("nurse", "doctor"), logPatientVitals);
router.get("/assignments", authorizeRoles("nurse"), getNurseAssignments);

export default router;
