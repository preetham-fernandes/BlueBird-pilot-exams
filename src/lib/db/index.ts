// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Create a pool instead of a single connection for better performance
const poolConnection = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  // Optional: configure pool settings
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create the drizzle instance
export const db = drizzle(poolConnection, { schema, mode: 'default' });

// If you need to create a function to connect on demand:
export async function getDB() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });
  
  return drizzle(connection, { schema, mode: 'default' });
}