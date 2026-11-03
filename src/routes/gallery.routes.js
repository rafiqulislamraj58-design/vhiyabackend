import { Router } from "express";
import {
  uploadGalleryImage,
  getAllGalleryImages,
  deleteGalleryImage,
} from "../controllers/gallery.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { upload } from "../utils/upload.js"; 

const router = Router();

router.get("/", getAllGalleryImages);


router.post("/", authenticate, isAdmin, upload.single("image"), uploadGalleryImage);
router.delete("/:id", authenticate, isAdmin, deleteGalleryImage);

export default router;