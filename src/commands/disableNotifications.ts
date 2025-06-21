import type { ChatInputCommandInteraction } from "discord.js";
import { MessageFlags } from "discord.js";
import env from "../../env";

export const disableNotifications = async (
	interaction: ChatInputCommandInteraction,
) => {
	const member = interaction.member;
	if (!interaction.inCachedGuild() || !member) {
		await interaction.reply({
			content: "Bu komut sadece bir kanalda kullanılabilir.",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const guildMember = interaction.member;

	const role = interaction.guild.roles.cache.find(
		(r) => r.name === env.NOTIFICATION_ROLE_NAME,
	);

	if (!role || !guildMember.roles.cache.has(role.id)) {
		await interaction.reply({
			content: "Bildirim rolü sizde zaten yok :warning:",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	await guildMember.roles.remove(role);
	await interaction.reply({
		content: "Bildirim rolünüz kaldırıldı :white_check_mark:",
		flags: MessageFlags.Ephemeral,
	});
};
