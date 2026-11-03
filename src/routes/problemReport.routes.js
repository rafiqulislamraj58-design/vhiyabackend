import { Router } from "express";
import {
  submitProblem,
  getAllProblems,
  updateProblemStatus,
} from "../controllers/problemReport.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();

router.post("/", submitProblem);


router.get("/", authenticate, isAdmin, getAllProblems);
router.patch("/:id/status", authenticate, isAdmin, updateProblemStatus);

export default router;