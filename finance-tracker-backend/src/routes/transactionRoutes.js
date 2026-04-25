import express from "express";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";

const router = express.Router();

// ✅ sab dekh sakte (read-only bhi)
router.get("/", verifyToken, authorizeRoles("admin", "user", "read-only"), getTransactions);

// ✅ add: admin + user
router.post("/", verifyToken, authorizeRoles("admin", "user"), addTransaction);

// ✅ update: admin + user
router.put("/:id", verifyToken, authorizeRoles("admin", "user"), updateTransaction);

// ✅ delete: only admin (strict) — ya "admin","user" agar chaho
router.delete("/:id", verifyToken, authorizeRoles("admin", "user"), deleteTransaction);

export default router;