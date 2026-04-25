// src/controllers/analyticsController.js

import { pool } from "../config/db.js";
import redis from "../config/redis.js";

export const getAnalytics = async (req, res) => {
  try {
    const cacheKey = `analytics:${req.user.id}`;

    // 🔹 STEP 1: Check cache
    // const cached = await redis.get(cacheKey);
    // if (cached) {
    //   return res.json(JSON.parse(cached)); // ⚡ fast response
    // }

    // 🔹 STEP 2: DB query
    const result = await pool.query(
      "SELECT category, SUM(amount) as total FROM transactions WHERE user_id=$1 GROUP BY category",
      [req.user.id]
    );

    // 🔹 STEP 3: Save in Redis (15 min)
    // await redis.set(cacheKey, JSON.stringify(result.rows), "EX", 900);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};