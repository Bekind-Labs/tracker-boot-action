export const graphQlRequest = (query: string, variables: unknown) => {
	return {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.TRACKER_BOOT_API_TOKEN}`,
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	};
};
