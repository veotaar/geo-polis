import type { ChatInputCommandInteraction } from "discord.js";
import { MessageFlags } from "discord.js";
import env from "../../env";

export const enableNotifications = async (
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

	const guild = interaction.guild;
	const role =
		guild.roles.cache.find((r) => r.name === env.NOTIFICATION_ROLE_NAME) ??
		(await guild.roles.create({
			name: env.NOTIFICATION_ROLE_NAME,
			reason: "Role for notification opt-in",
			permissions: [],
		}));

	const guildMember = interaction.member;

	if (guildMember.roles.cache.has(role.id)) {
		await interaction.reply({
			content: "Bildirim rolüne zaten sahipsiniz :warning:",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	await guildMember.roles.add(role);
	await interaction.reply({
		content: "Bildirim rolü verildi :white_check_mark:",
		flags: MessageFlags.Ephemeral,
	});
};
