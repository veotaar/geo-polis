import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";
import { getSuspectMessage } from "../lib/replyMessage";
import { upsertSuspect } from "../db/queries/suspect";

export const control = async (interaction: ChatInputCommandInteraction) => {
	const url = interaction.options.data[0]?.value as string;

	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	if (!url) {
		await interaction.reply("Bu profili bulamadım. Linki doğru girdin mi?");
		return;
	}

	const suspect = await upsertSuspect(url);

	if (!suspect) {
		await interaction.reply("Bu profili bulamadım. Linki doğru girdin mi?");
		return;
	}

	// send info about profile
	// await interaction.reply(getSuspectMessage(suspect));
	await interaction.editReply({ content: getSuspectMessage(suspect) });

	return;
};
