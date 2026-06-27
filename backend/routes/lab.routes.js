import express from "express";
import { getLabReports, requestLabTest, completeLabReport } from '../controllers/lab.controller.js';
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/reports")
  .get(authorizeRoles("lab_technician", "doctor", "nurse", "admin"), getLabReports)
  .post(authorizeRoles("doctor", "receptionist", "admin"), requestLabTest);

router.put("/reports/:id/results", authorizeRoles("lab_technician"), completeLabReport);

export default router;
