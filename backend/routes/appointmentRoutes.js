import express from "express";
import { 
  getPatientAppointments, 
  bookAppointment, 
  cancelAppointment 
} from "../controllers/patient.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getPatientAppointments)
  .post(bookAppointment);

router.route("/:id/cancel")
  .put(cancelAppointment);

export default router;
