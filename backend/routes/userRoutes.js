import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Mount auth protections
router.use(protect);

router
  .route("/")
  .get(authorizeRoles("admin", "doctor", "nurse", "receptionist"), getUsers)
  .post(authorizeRoles("admin"), createUser);

router
  .route("/:id")
  .get(getUserById)
  .put(updateUser)
  .delete(authorizeRoles("admin"), deleteUser);

export default router;
