import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import {
	createInsertSchema,
	createUpdateSchema,
	createSelectSchema,
} from "drizzle-zod";
import type { z } from "zod/v4";

export const suspect = sqliteTable("suspect", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	geoId: text("geo_id").notNull(),
	accountCreated: integer("account_created", { mode: "timestamp" }).notNull(),
	nick: text("nick").notNull(),
	countryCode: text("country_code").notNull(),
	url: text("url").notNull(),
	banned: integer("banned", { mode: "boolean" }).notNull().default(false),
	suspended: integer("suspended", { mode: "boolean" }).notNull().default(false),
	suspendedUntil: integer("suspended_until", { mode: "timestamp" }),
	level: integer("level").notNull(),
	lookupCount: integer("lookup_count").notNull().default(1),
	banAnnounced: integer("ban_announced", { mode: "boolean" })
		.notNull()
		.default(false),
	suspensionAnnounced: integer("suspension_announced", { mode: "boolean" })
		.notNull()
		.default(false),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
});

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("email_verified", { mode: "boolean" })
		.$defaultFn(() => !1)
		.notNull(),
	image: text("image"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.$defaultFn(() => new Date())
		.notNull(),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at", {
		mode: "timestamp",
	}),
	refreshTokenExpiresAt: integer("refresh_token_expires_at", {
		mode: "timestamp",
	}),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
		() => new Date(),
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
		() => new Date(),
	),
});

export const selectSuspectSchema = createSelectSchema(suspect);

export type Suspect = z.infer<typeof selectSuspectSchema>;

export const insertSuspectSchema = createInsertSchema(suspect).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const updateSuspectSchema = createUpdateSchema(suspect);
