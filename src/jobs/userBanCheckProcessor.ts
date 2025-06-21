import type { Job } from "bullmq";
import { db } from "../db";
import { suspect } from "../db/schema";
import { and, eq, gt } from "drizzle-orm";
import { checkSuspect } from "../db/queries/suspect";

export async function processUserBanCheck(job: Job) {
	const tenDaysAgo = new Date(
		Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60,
	);

	// Get all non-banned users updated within last 10 days
	const usersToCheck = await db
		.select()
		.from(suspect)
		.where(and(eq(suspect.banned, false), gt(suspect.updatedAt, tenDaysAgo)));

	job.log(`Found ${usersToCheck.length} users to check for ban status`);

	for (let i = 0; i < usersToCheck.length; i++) {
		const user = usersToCheck[i];

		if (!user) continue;

		try {
			await job.updateProgress(((i + 1) / usersToCheck.length) * 100);

			job.log(`Checking user ${i + 1}/${usersToCheck.length}: ${user.nick}`);

			await checkSuspect(user);

			if (i < usersToCheck.length - 1) {
				await new Promise((resolve) => setTimeout(resolve, 15000));
			}
		} catch (error) {
			job.log(`Error checking user ${user.url}: ${error}`);
		}
	}

	job.log(`Completed checking ${usersToCheck.length} users`);
	return { processedUsers: usersToCheck.length };
}
