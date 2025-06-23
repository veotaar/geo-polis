import { drizzle, type BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import env from "../../env";
import * as schema from "./schema";

const sqlite = new Database(env.DB_URL.replace("file:", ""));

export const db: BunSQLiteDatabase<typeof schema> = drizzle(sqlite, { schema });
