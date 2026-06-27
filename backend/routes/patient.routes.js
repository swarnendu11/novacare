import express from "express";
import {
  getPatientAppointments,
  bookAppointment,
  cancelAppointment,
  getPatientPrescriptions,
  getPatientLabReports,
  getPatientBills,
  payBill
} from '../controllers/patient.controller.js';
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("patient"));

router.route("/appointments")
  .get(getPatientAppointments)
  .post(bookAppointment);

router.put("/appointments/:id/cancel", cancelAppointment);

router.get("/prescriptions", getPatientPrescriptions);
router.get("/lab-reports", getPatientLabReports);

router.get("/bills", getPatientBills);
router.post("/bills/:id/pay", payBill);

export default router;
