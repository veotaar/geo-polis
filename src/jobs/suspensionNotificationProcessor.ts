import type { Job } from "bullmq";
import { db } from "../db";
import { suspect } from "../db/schema";
import { and, eq } from "drizzle-orm";
import sendAnnouncement from "../lib/sendAnnouncement";
import sendNotificationRoleMention from "../lib/sendRoleMention";

export async function processSuspensionNotifications(job: Job) {
	// Get all suspended users who haven't been announced
	const suspendedUsers = await db
		.select()
		.from(suspect)
		.where(
			and(eq(suspect.suspended, true), eq(suspect.suspensionAnnounced, false)),
		);

	job.log(`Found ${suspendedUsers.length} banned users to announce`);

	if (suspendedUsers.length === 0) {
		return { notifiedUsers: 0 };
	}

	for (let i = 0; i < suspendedUsers.length; i++) {
		const user = suspendedUsers[i];

		if (!user) continue;

		try {
			await job.updateProgress(((i + 1) / suspendedUsers.length) * 100);

			job.log(
				`Sending notification for user ${i + 1}/${suspendedUsers.length}: ${user.url}`,
			);

			await sendAnnouncement(user, "suspension");

			await db
				.update(suspect)
				.set({ suspensionAnnounced: true })
				.where(eq(suspect.id, user.id));
		} catch (error) {
			job.log(`Error notifying for user ${user.geoId}: ${error}`);
		}
	}

	job.log(`Sent notifications for ${suspendedUsers.length} users`);

	await sendNotificationRoleMention();

	return { notifiedUsers: suspendedUsers.length };
}
