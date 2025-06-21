import {
	userBanCheckQueue,
	banNotificationQueue,
	suspensionNotificationQueue,
} from "../queues/setup";

export async function setupSchedulers() {
	await userBanCheckQueue.upsertJobScheduler("user-ban-check-scheduler", {
		every: 2 * 60 * 60 * 1000, // 2 hours
	});

	await banNotificationQueue.upsertJobScheduler("ban-notification-scheduler", {
		every: 3 * 60 * 1000, // 3 minutes
	});

	await suspensionNotificationQueue.upsertJobScheduler(
		"suspension-notification-scheduler",
		{
			every: 3 * 60 * 1000, // 3 minutes
		},
	);

	console.log("Job schedulers set up successfully");
}
