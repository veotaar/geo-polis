import { Hono } from "hono";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { HonoAdapter } from "@bull-board/hono";
import { showRoutes } from "hono/dev";
import { serveStatic } from "hono/bun";
import {
	userBanCheckQueue,
	banNotificationQueue,
	suspensionNotificationQueue,
} from "./queues/setup";
import { setupDiscordClient } from "./discordClient";
import startWorkers from "./lib/startWorkers";

import type { AuthType } from "./lib/auth";
import authRoute from "./routes/auth";
import { auth } from "./lib/auth";

import { loginPage } from "./templates/login";
import { signupPage } from "./templates/signup";
import { suspectView } from "./templates/suspectView";

import env from "../env";

await startWorkers();

console.log("ALLOW_SIGNUP: ", env.ALLOW_SIGNUP);

const bullBoardBasePath = "/bullboard";

const serverAdapter = new HonoAdapter(serveStatic);
serverAdapter.setBasePath(bullBoardBasePath);

createBullBoard({
	queues: [
		new BullMQAdapter(userBanCheckQueue),
		new BullMQAdapter(banNotificationQueue),
		new BullMQAdapter(suspensionNotificationQueue),
	],
	serverAdapter,
});

const app = new Hono<{ Variables: AuthType }>({
	strict: false,
});

const routes = [authRoute] as const;

for (const route of routes) {
	app.basePath("/api").route("/", route);
}

app.get("/login", async (c) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (session) {
		return c.redirect("/list");
	}

	return c.html(loginPage());
});

app.get("/signup", async (c) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (session) {
		return c.redirect("/list");
	}

	return c.html(signupPage());
});

app.get("/logout", async (c) => {
	await auth.api.signOut({
		headers: c.req.header(),
	});
	return c.redirect("/login");
});

app.get("/list", async (c) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session) {
		return c.redirect("/login");
	}

	const html = await suspectView();

	return c.html(html);
});

app.use("/bullboard/*", async (c, next) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session) {
		return c.redirect("/login");
	}

	c.set("user", session.user);
	c.set("session", session.session);
	await next();
});

app.route(bullBoardBasePath, serverAdapter.registerPlugin());

app.get("/", (c) => c.text("Nothing here yet!"));

showRoutes(app);

await setupDiscordClient();

export default {
	port: env.HONO_PORT,
	fetch: app.fetch,
};
