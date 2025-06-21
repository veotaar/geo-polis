import { load } from "cheerio";
import { z } from "zod/v4";

const userResult = z.object({
	nick: z.string(),
	created: z.coerce.date(),
	userId: z.string(),
	isProUser: z.coerce.boolean(),
	isBanned: z.coerce.boolean(),
	url: z.string(),
	countryCode: z.string(),
	progress: z.object({
		level: z.coerce.number(),
	}),
	suspendedUntil: z.union([z.null(), z.coerce.date()]),
});

export type UserResult = z.infer<typeof userResult>;

const dataResult = z.object({
	props: z.object({
		pageProps: z.object({
			user: userResult,
		}),
	}),
});

const urlSchema = z.url().refine(
	(urlStr) => {
		try {
			const url = new URL(urlStr);
			return url.hostname === "geoguessr.com" || "www.geoguessr.com";
		} catch {
			return false;
		}
	},
	{
		message: "invalid url",
	},
);

const extractJson = (html: string) => {
	const $ = load(html);
	const script = $('script#__NEXT_DATA__[type="application/json"]');
	if (!script.length) {
		console.warn("Script tag with id __NEXT_DATA__ not found.");
		return null;
	}
	const jsonText = script.html();
	if (!jsonText) {
		console.warn("No content found inside script tag.");
		return null;
	}
	try {
		const json = JSON.parse(jsonText);
		const parsedData = dataResult.parse(json);
		return parsedData.props.pageProps.user;
	} catch (error) {
		console.error("Failed to parse JSON from script tag:", error);
		return null;
	}
};

const fetchUser = async (url: string) => {
	const result = urlSchema.safeParse(url);

	if (!result.success) {
		console.error("invalid url");
		return null;
	}

	const response = await fetch(url);
	if (!response.ok) {
		console.error(`Failed to fetch URL: ${url} (${response.status})`);
		return null;
	}
	const html = await response.text();
	return extractJson(html);
};

export default fetchUser;
