import { Hono } from "hono";
import { auth } from "../lib/auth";
import type { AuthType } from "../lib/auth";

const router = new Hono<{ Bindings: AuthType }>({
	strict: false,
});

router.on(["POST", "GET"], "/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

export default router;
