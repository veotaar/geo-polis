import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import env from "../../env";

const sqlite = new Database(env.DB_URL.replace("file:", ""));

export const db = drizzle(sqlite);
