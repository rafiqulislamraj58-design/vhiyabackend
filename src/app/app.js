
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "../config/passport.js";

import authRoutes from "../routes/auth.routes.js";
import problemRoutes from "../routes/problemReport.routes.js";
import galleryRoutes from "../routes/gallery.routes.js";
import activityRoutes from "../routes/activity.routes.js";
import futurePlanRoutes from "../routes/futurePlan.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://nauzulhosainsomon.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Somon Kondokar Backend API!",
    status: "Server is running successfully",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/plans", futurePlanRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  if (err.message.startsWith("CORS blocked")) {
    return res.status(403).json({
      success: false,
      message: "Origin not allowed by CORS policy",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
