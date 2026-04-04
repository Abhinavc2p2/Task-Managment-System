import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticate, createTask);
router.get("/", authenticate, getTasks);
router.patch("/:id", authenticate, updateTask);
router.delete("/:id", authenticate, deleteTask);
router.patch("/:id/toggle", authenticate, toggleTask);

export default router;