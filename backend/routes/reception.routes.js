import express from "express";
import { registerPatientByStaff, admitPatient, getRoomsLayout } from '../controllers/reception.controller.js';
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/patients", authorizeRoles("receptionist", "admin"), registerPatientByStaff);
router.post("/admissions", authorizeRoles("receptionist", "admin"), admitPatient);
router.get("/rooms", authorizeRoles("receptionist", "admin", "nurse"), getRoomsLayout);

export default router;
