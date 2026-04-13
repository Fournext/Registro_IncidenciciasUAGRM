import { Pool } from "@neondatabase/serverless";
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
import.meta.env;

const connectionString = import.meta.env.VITE_DATABASE_URL;

if (!connectionString) {
  throw new Error("La variable VITE_DATABASE_URL no está configurada");
}

export const pool = new Pool({
  connectionString,
});

// consultas normales
export const query = (text: string, params?: unknown[]) =>
  pool.query(text, params);

// 🔥 para transacciones
export const getClient = async () => {
  return await pool.connect();
};
