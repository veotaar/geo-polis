import { defineConfig } from "drizzle-kit";
import env from "./env";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: env.DB_URL.replace("file:", ""),
	},
});
