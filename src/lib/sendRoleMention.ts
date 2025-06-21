import env from "../../env";
import { client } from "../discordClient";
import { TextChannel, roleMention } from "discord.js";
import roleStore from "./roleStore";

const sendNotificationRoleMention = async () => {
	try {
		const channel = await client.channels.fetch(env.CHANNEL_ID);
		if (!channel || !(channel instanceof TextChannel)) {
			console.error("Channel not found or is not a text channel!");
			return;
		}

		const roleId = roleStore.notificationRoleId;

		if (!roleId) {
			console.log("role not ready yet");
			return;
		}

		const role = roleMention(roleId);

		await channel.send(role);

		console.log(`announcement sent to channel ${env.CHANNEL_ID}`);
	} catch (error) {
		console.error("Error sending message:", error);
	}
};

export default sendNotificationRoleMention;
