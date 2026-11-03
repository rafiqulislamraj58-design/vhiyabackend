import { Router } from "express";
import {
  createFuturePlan,
  getAllFuturePlans,
  deleteFuturePlan,
} from "../controllers/futurePlan.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();

router.get("/", getAllFuturePlans);

router.post("/", authenticate, isAdmin, createFuturePlan);
router.delete("/:id", authenticate, isAdmin, deleteFuturePlan);

export default router;