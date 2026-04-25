// analyticsRoutes.js
import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/analytics", verifyToken, getAnalytics); // all roles

export default router;