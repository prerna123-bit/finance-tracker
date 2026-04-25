// testDb.js
import { pool } from "./src/config/db.js";

const test = async () => {
  const res = await pool.query("SELECT NOW()");
  console.log(res.rows);
};

test();