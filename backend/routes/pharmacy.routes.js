import express from "express";
import { getMedicines, restockMedicine, dispensePrescription } from '../controllers/pharmacy.controller.js';
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/medicines")
  .get(authorizeRoles("pharmacy", "doctor", "nurse", "admin"), getMedicines)
  .post(authorizeRoles("pharmacy", "admin"), restockMedicine);

router.post("/dispense/:prescriptionId", authorizeRoles("pharmacy"), dispensePrescription);

export default router;
