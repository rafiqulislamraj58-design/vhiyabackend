
import { Router } from "express";
import {
  register,
  login,
  refresh,
  getMe,
  logout
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator
} from "../validator/auth.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import passport from "../config/passport.js";

const router = Router();


// 
router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
// 
router.get("/me", authenticate, getMe);
import { googleCallback } from "../controllers/auth.controller.js";

// Google Login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  })
);


router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login"
  }),
  googleCallback
);
// 

export default router;