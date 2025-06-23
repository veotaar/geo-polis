import { REST, Routes } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import env from "../../env";

const check = new SlashCommandBuilder()
	.setName("kontrol")
	.setDescription("Kullanıcının anlık ban statüsünü öğrenir.")
	.addStringOption((option) =>
		option
			.setName("profil-link")
			.setDescription("Kullanıcının profil linki.")
			.setRequired(true),
	);

const enableNotifications = new SlashCommandBuilder()
	.setName("bildirimleri-ac")
	.setDescription("Ban veya zaman aşımı bildirimleri için size rol ekler.");

const disableNotifications = new SlashCommandBuilder()
	.setName("bildirimleri-kapat")
	.setDescription("Bildirim rolünü sizden kaldırır.");

const commands = [check, enableNotifications, disableNotifications];

const rest = new REST({ version: "10" }).setToken(env.TOKEN);

try {
	console.log("Started refreshing application (/) commands.");

	// const result = await rest.put(Routes.applicationCommands(env.CLIENT_ID), {
	// 	body: commands,
	// });

	// using guild update when global update by discrod takes too long
	const result = await rest.put(
		Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID),
		{
			body: commands,
		},
	);

	console.log(result);

	console.log("Successfully reloaded application (/) commands.");
} catch (error) {
	console.error(error);
}
