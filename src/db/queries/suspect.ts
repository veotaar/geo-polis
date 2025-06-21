import { db } from "../../db";
import { suspect, insertSuspectSchema, updateSuspectSchema } from "../schema";
import fetchUser from "../../api/fetchUser";
import { eq, sql } from "drizzle-orm";
import type { Suspect } from "../schema";

export const checkSuspect = async (suspectFromDb: Suspect) => {
	const userInfo = await fetchUser(
		`https://www.geoguessr.com${suspectFromDb.url}`,
	);

	if (!userInfo) {
		console.error("cannot fetch user data");
		return null;
	}

	try {
		const {
			nick,
			countryCode,
			progress: { level },
			isBanned: banned,
			suspendedUntil,
		} = userInfo;

		const updated = await db
			.update(suspect)
			.set({
				nick,
				countryCode,
				level,
				banned,
				suspendedUntil,
				suspended: !!suspendedUntil,
				updatedAt: sql`"updated_at"`, // updating with sql to bypass onUpdate
				// lookupCount: suspectFromDb.lookupCount + 1,
			})
			.where(eq(suspect.id, suspectFromDb.id))
			.returning();

		return updated[0];
	} catch (e) {
		return null;
	}
};

export const upsertSuspect = async (userProfile: string) => {
	const userInfo = await fetchUser(userProfile);

	if (!userInfo) {
		console.error("cannot fetch user data");
		return null;
	}

	try {
		const {
			nick,
			url,
			countryCode,
			progress: { level },
			userId: geoId,
			created: accountCreated,
			isBanned: banned,
			suspendedUntil,
		} = userInfo;

		const existing = await db
			.select()
			.from(suspect)
			.where(eq(suspect.geoId, geoId))
			.limit(1);

		if (existing.length > 0) {
			const id = existing[0]?.id as number;
			const lookupCount = existing[0]?.lookupCount as number;

			const parsedUpdate = updateSuspectSchema.parse({
				nick,
				countryCode,
				level,
				banned,
				suspendedUntil,
				suspended: !!suspendedUntil,
				lookupCount: lookupCount + 1,
			});

			const updated = await db
				.update(suspect)
				.set(parsedUpdate)
				.where(eq(suspect.id, id))
				.returning();

			return updated[0];
		}

		const parsedUser = insertSuspectSchema.parse({
			geoId,
			accountCreated,
			nick,
			countryCode,
			url,
			banned,
			level,
			suspended: !!suspendedUntil,
			suspendedUntil,
		});

		const inserted = await db.insert(suspect).values(parsedUser).returning();
		return inserted[0];
	} catch (e) {
		return null;
	}
};
