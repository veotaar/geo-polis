import { Queue } from "bullmq";
import Redis from "ioredis";
import env from "../../env";

export const redis = new Redis({
	host: env.REDIS_HOST,
	port: env.REDIS_PORT,
	maxRetriesPerRequest: null,
});

export const QUEUE_NAMES = {
	USER_BAN_CHECK: "user-ban-check",
	BAN_NOTIFICATIONS: "ban-notifications",
	SUSPENSION_NOTIFICATIONS: "suspension-notifications",
} as const;

// Create queues
export const userBanCheckQueue = new Queue(QUEUE_NAMES.USER_BAN_CHECK, {
	connection: redis,
	defaultJobOptions: {
		removeOnComplete: 10,
		removeOnFail: 50,
		attempts: 3,
		backoff: {
			type: "exponential",
			delay: 3000,
			jitter: 0.5,
		},
	},
});

export const banNotificationQueue = new Queue(QUEUE_NAMES.BAN_NOTIFICATIONS, {
	connection: redis,
	defaultJobOptions: {
		removeOnComplete: 10,
		removeOnFail: 50,
		attempts: 3,
		backoff: {
			type: "exponential",
			delay: 3000,
			jitter: 0.5,
		},
	},
});

export const suspensionNotificationQueue = new Queue(
	QUEUE_NAMES.SUSPENSION_NOTIFICATIONS,
	{
		connection: redis,
		defaultJobOptions: {
			removeOnComplete: 10,
			removeOnFail: 50,
			attempts: 3,
			backoff: {
				type: "exponential",
				delay: 3000,
				jitter: 0.5,
			},
		},
	},
);
