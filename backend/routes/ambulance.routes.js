import express from "express";
import { getAmbulances, dispatchAmbulance, updateTripStatus } from '../controllers/ambulance.controller.js';
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/vehicles")
  .get(authorizeRoles("ambulance_staff", "receptionist", "admin"), getAmbulances);

router.route("/trips")
  .post(authorizeRoles("receptionist", "admin"), dispatchAmbulance);

router.put("/trips/:id/status", authorizeRoles("ambulance_staff"), updateTripStatus);

export default router;
