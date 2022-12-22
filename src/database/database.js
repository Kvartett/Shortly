import dotenv from "dotenv";
import pg from "pg";

const { Pool } = pg;
dotenv.config();

const databaseConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
};

const db = new Pool(databaseConfig);

export default db;