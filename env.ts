import { z, type ZodError } from "zod/v4";

const EnvSchema = z.object({
	APPLICATION_ID: z.string(),
	PUBLIC_KEY: z.string(),
	TOKEN: z.string(),
	CLIENT_ID: z.string(),
	CLIENT_SECRET: z.string(),
	DB_FILE_NAME: z.string(),
	DB_URL: z.string(),
	NOTIFICATION_ROLE_NAME: z.string(),
	VERIFIED_ROLE_NAME: z.string(),
	CHANNEL_ID: z.string(),
	GUILD_ID: z.string(),
	REDIS_HOST: z.string(),
	REDIS_PORT: z.coerce.number(),
	HONO_PORT: z.coerce.number(),
	ALLOW_SIGNUP: z
		.enum(["0", "1", "true", "false"])
		.catch("false")
		.transform((value) => value === "true" || value === "1"),
	DEPLOYED_URL: z.url(),
	DAY_THRESHOLD: z.coerce.number(),
	LOGIN_REDIRECT_ROUTE: z.string(),
});

export type env = z.infer<typeof EnvSchema>;

let env: env;

try {
	env = EnvSchema.parse(process.env);
} catch (e) {
	const error = e as ZodError;
	console.error("Invalid ENV:");
	console.error(error.flatten().fieldErrors);
	process.exit(1);
}

export default env;
