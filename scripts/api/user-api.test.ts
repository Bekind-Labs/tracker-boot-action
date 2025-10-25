import { beforeEach, describe, expect, test, vi } from "vitest";
import { mockResponse } from "../testUtil/api.ts";
import { queryGetMe } from "./graphql/query.ts";
import * as sut from "./user-api.ts";

describe("user-api", () => {
	beforeEach(() => {
		vi.stubGlobal("fetch", vi.fn());
		vi.stubEnv("TRACKER_BOOT_URL", "https://dev-tracker-boot.com");
		vi.stubEnv("TRACKER_BOOT_API_TOKEN", "api-token");
	});

	test("when getMe, then return Me", async () => {
		const expected = { data: { me: { id: 10000 } } };
		vi.mocked(fetch).mockResolvedValue(mockResponse(200, expected));

		const result = await sut.getMe();

		expect(result).toEqual({ id: 10000 });
	});

	test("when getMe, then fetch API is called", async () => {
		const expected = { data: { me: { id: 10000 } } };
		vi.mocked(fetch).mockResolvedValue(mockResponse(200, expected));

		await sut.getMe();

		expect(fetch).toHaveBeenCalledWith(
			"https://dev-tracker-boot.com/analytics/graphql",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-API-KEY": "api-token",
				},
				body: JSON.stringify({
					query: queryGetMe,
				}),
			},
		);
	});

	test.each([400, 401, 403, 404, 500])(
		"given server response is not ok with %s status, when getMe, then throw error",
		async (status) => {
			vi.mocked(fetch).mockResolvedValue(mockResponse(status, {}));

			await expect(sut.getMe()).rejects.toThrow(
				`failed to fetch user info, status: ${status}`,
			);
		},
	);
});
