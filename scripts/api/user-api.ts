import { queryGetMe } from "./graphql/query.ts";

export const getMe = async (): Promise<Me> => {
	const response = await fetch(
		`${process.env.TRACKER_BOOT_URL}/analytics/graphql`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-KEY": `${process.env.TRACKER_BOOT_API_TOKEN}`,
			},
			body: JSON.stringify({
				query: queryGetMe,
			}),
		},
	);
	if (!response.ok) {
		throw new Error(`failed to fetch user info, status: ${response.status}`);
	}
	const result = await response.json();
	return {
		id: result.data.me.id,
	};
};

export type Me = {
	id: number;
};
