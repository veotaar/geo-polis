import env from "../../env";
import { client } from "../discordClient";
import { TextChannel, hideLinkEmbed } from "discord.js";
import type { Suspect } from "../db/schema";

const sendAnnouncement = async (
	user: Suspect,
	announcementType: "ban" | "suspension",
) => {
	const userUrl = hideLinkEmbed(`https://geoguessr.com${user.url}`);

	try {
		const channel = await client.channels.fetch(env.CHANNEL_ID);
		if (!channel || !(channel instanceof TextChannel)) {
			console.error("Channel not found or is not a text channel!");
			return;
		}

		switch (announcementType) {
			case "ban":
				await channel.send(
					`:rotating_light: ${user.nick} :flag_${user.countryCode}: banlandı! ${userUrl}`,
				);
				break;
			case "suspension":
				if (!user.suspendedUntil) return;
				if (user.suspendedUntil.getTime() < new Date().getTime()) return;
				await channel.send(
					`:warning: ${user.nick} :flag_${user.countryCode}: uzaklaştırma cezası aldı! ${userUrl}`,
				);
				break;
		}

		console.log(`announcement sent to channel ${env.CHANNEL_ID}`);
	} catch (error) {
		console.error("Error sending message:", error);
	}
};

export default sendAnnouncement;
