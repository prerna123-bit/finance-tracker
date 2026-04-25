// src/controllers/authController.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

// REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING *",
    [name, email, hashed, "user"]
  );

  res.json(result.rows[0]);
};

// LOGIN ✅ (ye missing hai tumhare case me)
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

  if (user.rows.length === 0) {
    return res.status(400).json({ msg: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.rows[0].password);

  if (!valid) {
    return res.status(400).json({ msg: "Wrong password" });
  }

  const token = jwt.sign(
  { id: user.rows[0].id, role: user.rows[0].role },
  process.env.JWT_SECRET,   // 👈 yaha change karo
  { expiresIn: "1d" }       // 👈 add karo
);

  res.json({
  token,
  user: {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role
  }
});
};