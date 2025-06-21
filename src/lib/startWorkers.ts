import { setupSchedulers } from "../scheduler";
import {
	userBanCheckWorker,
	banNotificationWorker,
	suspensionNotificationWorker,
} from "../workers";

export default async function startWorkers() {
	try {
		await setupSchedulers();

		console.log("BullMQ workers and schedulers started");

		process.on("SIGINT", async () => {
			console.log("Shutting down workers...");
			await userBanCheckWorker.close();
			await banNotificationWorker.close();
			await suspensionNotificationWorker.close();
			process.exit(0);
		});
	} catch (error) {
		console.error("Error starting application:", error);
		process.exit(1);
	}
}
