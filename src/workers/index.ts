import { Worker } from "bullmq";
import { redis, QUEUE_NAMES } from "../queues/setup";
import { processUserBanCheck } from "../jobs/userBanCheckProcessor";
import { processBanNotifications } from "../jobs/banNotificationProcessor";
import { processSuspensionNotifications } from "../jobs/suspensionNotificationProcessor";

export const userBanCheckWorker = new Worker(
	QUEUE_NAMES.USER_BAN_CHECK,
	processUserBanCheck,
	{
		connection: redis,
		concurrency: 1,
	},
);

export const banNotificationWorker = new Worker(
	QUEUE_NAMES.BAN_NOTIFICATIONS,
	processBanNotifications,
	{
		connection: redis,
		concurrency: 1,
	},
);

export const suspensionNotificationWorker = new Worker(
	QUEUE_NAMES.SUSPENSION_NOTIFICATIONS,
	processSuspensionNotifications,
	{
		connection: redis,
		concurrency: 1,
	},
);

userBanCheckWorker.on("completed", (job) => {
	console.log(`User ban check job ${job.id} completed:`, job.returnvalue);
});

userBanCheckWorker.on("failed", (job, err) => {
	console.error(`User ban check job ${job?.id} failed:`, err);
});

banNotificationWorker.on("completed", (job) => {
	console.log(`Ban notification job ${job.id} completed:`, job.returnvalue);
});

banNotificationWorker.on("failed", (job, err) => {
	console.error(`Ban notification job ${job?.id} failed:`, err);
});

suspensionNotificationWorker.on("completed", (job) => {
	console.log(
		`Suspension notification job ${job.id} completed:`,
		job.returnvalue,
	);
});

suspensionNotificationWorker.on("failed", (job, err) => {
	console.error(`Suspension notification job ${job?.id} failed:`, err);
});
