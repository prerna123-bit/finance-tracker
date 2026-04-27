import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app = express();

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://finance-tracker-git-main-prerna123-bits-projects.vercel.app"
  ],
  credentials: true
}));

app.use(helmet());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many requests, try again later"
});

const transactionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
});

// Apply limiters
app.use("/api/auth", authLimiter);
app.use("/api/transactions", transactionLimiter);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;