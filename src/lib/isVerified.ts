import type { ChatInputCommandInteraction } from "discord.js";
import env from "../../env";

export const isVerified = async (interaction: ChatInputCommandInteraction) => {
	const member = interaction.member;
	if (!interaction.inCachedGuild() || !member) {
		return false;
	}

	const guildMember = interaction.member;

	const verifiedRole = interaction.guild.roles.cache.find(
		(r) => r.name === env.VERIFIED_ROLE_NAME,
	);

	if (!verifiedRole || !guildMember.roles.cache.has(verifiedRole.id)) {
		return false;
	}

	return true;
};
