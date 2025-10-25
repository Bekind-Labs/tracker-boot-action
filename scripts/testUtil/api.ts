export const mockResponse = (status: number, expected: unknown): Response => {
	return {
		ok: status === 200,
		status: status,
		json: async () => expected,
	} as Response;
};
