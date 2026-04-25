import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "finance_db",
  password: "jbmarch1994",
  port: 5432,
});