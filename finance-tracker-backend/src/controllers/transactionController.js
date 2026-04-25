// src/controllers/transactionController.js

import { pool } from "../config/db.js";

// GET transactions
export const getTransactions = async (req, res) => {
  let result;

  if (req.user.role === "admin" || req.user.role === "read-only") {
    // 👉 admin + read-only → sabka data
    result = await pool.query("SELECT * FROM transactions");
  } else {
    // 👉 normal user → sirf apna data
    result = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1",
      [req.user.id]
    );
  }

  res.json(result.rows);
};

// ADD transaction ✅ (ye missing hai tumhare case me)
export const addTransaction = async (req, res) => {
  try {
    const { amount, category } = req.body;

    const result = await pool.query(
      "INSERT INTO transactions(amount, category, user_id) VALUES($1,$2,$3) RETURNING *",
      [amount, category, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  const existing = await pool.query(
    "SELECT * FROM transactions WHERE id=$1",
    [id]
  );

  if (existing.rows.length === 0) {
    return res.status(404).json({ msg: "Not found" });
  }

  // 🔥 ADMIN BYPASS
  if (
    req.user.role !== "admin" &&
    existing.rows[0].user_id !== req.user.id
  ) {
    return res.status(403).json({ msg: "Not allowed" });
  }

  try {
    await pool.query("DELETE FROM transactions WHERE id=$1", [id]);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Delete failed" });
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, category } = req.body;

  const existing = await pool.query(
    "SELECT * FROM transactions WHERE id=$1",
    [id]
  );

  if (existing.rows.length === 0) {
    return res.status(404).json({ msg: "Not found" });
  }

  // 🔥 ADMIN BYPASS
  if (
    req.user.role !== "admin" &&
    existing.rows[0].user_id !== req.user.id
  ) {
    return res.status(403).json({ msg: "Not allowed" });
  }

  await pool.query(
    "UPDATE transactions SET amount=$1, category=$2 WHERE id=$3",
    [amount, category, id]
  );

  res.json({ msg: "Updated successfully" });
};