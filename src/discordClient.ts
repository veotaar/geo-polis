import { Client, Events, GatewayIntentBits } from "discord.js";
import { enableNotifications } from "./commands/enableNotifications";
import { disableNotifications } from "./commands/disableNotifications";
import { control } from "./commands/control";
import { isVerified } from "./lib/isVerified";
import roleStore from "./lib/roleStore";

import env from "../env";

export const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

export const setupDiscordClient = async () => {
	client.once(Events.ClientReady, (readyClient) => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}`);

		const guild = client.guilds.cache.get(env.GUILD_ID);

		if (!guild) {
			console.log("guild not found");
			return;
		}

		const notificationRole = guild.roles.cache.find(
			(role) => role.name === env.NOTIFICATION_ROLE_NAME,
		);

		if (notificationRole) {
			roleStore.notificationRoleId = notificationRole.id;
			console.log(
				`Notification role found: ${notificationRole.name} (ID: ${notificationRole.id})`,
			);
		} else {
			console.log(`Role ${env.NOTIFICATION_ROLE_NAME} not found`);
		}
	});

	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isChatInputCommand()) return;

		const verified = await isVerified(interaction);

		if (!verified) {
			await interaction.reply("Botu kullanma yetkiniz yok.");
			return;
		}

		try {
			if (interaction.commandName === "kontrol") {
				await control(interaction);
			}

			if (interaction.commandName === "takip") {
				await interaction.reply("Bu özellik yapım aşamasında.");
			}

			if (interaction.commandName === "bildirimleri-ac") {
				await enableNotifications(interaction);
			}

			if (interaction.commandName === "bildirimleri-kapat") {
				await disableNotifications(interaction);
			}
		} catch (error) {
			console.error(error);
		}
	});

	client.login(env.TOKEN);
};
