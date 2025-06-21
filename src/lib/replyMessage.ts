import { formatDistanceToNowStrict, format } from "date-fns";
import { tr } from "date-fns/locale";
import type { Suspect } from "../db/schema";

export const getSuspectMessage = (suspect: Suspect): string => {
	return `**Kullanıcı adı:** ${suspect.nick} :flag_${suspect.countryCode}: (https://geoguessr.com${suspect.url})
**Level:** ${suspect.level}
**Hesap yaşı:** ${formatDistanceToNowStrict(suspect.accountCreated, { locale: tr })} (${formatDistanceToNowStrict(suspect.accountCreated, { locale: tr, unit: "day" })})
**Ban:** ${suspect.banned ? "Hesap banlanmıştır :prohibited:" : "Hayır. Şu an hesap banlı değil :white_check_mark:"}${suspect.suspended ? "\n**Uzaklaştırma Cezası:** " : ""}${suspect.suspended ? "Hesap uzaklaştırma cezası almış! :warning:" : ""}${suspect.suspendedUntil ? "\n**Uzaklaştırma Bitiş Tarihi:** " : ""}${suspect.suspendedUntil ? format(suspect.suspendedUntil, "PPPpp", { locale: tr }) : ""}
**Sorgu sayısı:** ${suspect.lookupCount}
`;
};
