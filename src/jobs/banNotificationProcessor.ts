// jobs/banNotificationProcessor.ts
import type { Job } from "bullmq";
import { db } from "../db";
import { suspect } from "../db/schema";
import { and, eq } from "drizzle-orm";
import sendAnnouncement from "../lib/sendAnnouncement";
import sendNotificationRoleMention from "../lib/sendRoleMention";

export async function processBanNotifications(job: Job) {
	// Get all banned users who haven't been announced
	const bannedUsers = await db
		.select()
		.from(suspect)
		.where(and(eq(suspect.banned, true), eq(suspect.banAnnounced, false)));

	job.log(`Found ${bannedUsers.length} banned users to announce`);

	if (bannedUsers.length === 0) {
		return { notifiedUsers: 0 };
	}

	for (let i = 0; i < bannedUsers.length; i++) {
		const user = bannedUsers[i];

		if (!user) continue;

		try {
			await job.updateProgress(((i + 1) / bannedUsers.length) * 100);

			job.log(
				`Sending notification for user ${i + 1}/${bannedUsers.length}: ${user.url}`,
			);

			// Send discord message
			await sendAnnouncement(user, "ban");

			// Update the banAnnounced flag
			await db
				.update(suspect)
				.set({ banAnnounced: true })
				.where(eq(suspect.id, user.id));
		} catch (error) {
			job.log(`Error notifying for user ${user.geoId}: ${error}`);
			// Continue with next user
		}
	}

	job.log(`Sent notifications for ${bannedUsers.length} users`);

	await sendNotificationRoleMention();

	return { notifiedUsers: bannedUsers.length };
}
