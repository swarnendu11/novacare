import express from "express";
import { getAnalytics, getEquipment, addEquipment, updateEquipment } from '../controllers/admin.controller.js';
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Mount universal admin protections
router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/analytics", getAnalytics);

router.route("/equipment")
  .get(getEquipment)
  .post(addEquipment);

router.put("/equipment/:id", updateEquipment);

export default router;
