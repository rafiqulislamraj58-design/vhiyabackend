import { populate } from 'dotenv';
import express from 'express';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import authRoutes from '../routes/auth.routes.js';
import passport from '../config/passport.js';
import problemRoutes from '../routes/problemReport.routes.js';
import galleryRoutes from "../routes/gallery.routes.js";
import activityRoutes from "../routes/activity.routes.js";
import futurePlanRoutes from "../routes/futurePlan.routes.js";

const app = express();


app.use(cors({
  origin: [
    'http://localhost:3000', 
     'https://nauzulhosainsomon.vercel.app'
  ],
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize()); 

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to somon kondokar Backend API! 🚀",
    status: "Server is up and running successfully",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/plans", futurePlanRoutes);

export default app;