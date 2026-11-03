import { Router } from "express";
import {
  createActivity,
  getAllActivities,
  deleteActivity,
  updateActivity, 
} from "../controllers/activity.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { upload } from "../utils/upload.js"; 

const router = Router();


router.get("/", getAllActivities);


router.post(
  "/",
  authenticate,
  isAdmin,
  upload.array("images", 5),
  createActivity
);
router.patch("/:id", authenticate, isAdmin, upload.array("images", 5), updateActivity);

router.delete("/:id", authenticate, isAdmin, deleteActivity);

export default router;