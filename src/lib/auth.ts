import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { user, session, verification, account } from "../db/schema";
import env from "../../env";

export const auth = betterAuth({
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			ctx.setHeader("HX-Redirect", env.LOGIN_REDIRECT_ROUTE);
		}),
	},
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema: {
			user,
			session,
			verification,
			account,
		},
	}),
	trustedOrigins: [`http://localhost:${env.HONO_PORT}`, env.DEPLOYED_URL],
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		disableSignUp: !env.ALLOW_SIGNUP,
	},
});

export type AuthType = {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};
