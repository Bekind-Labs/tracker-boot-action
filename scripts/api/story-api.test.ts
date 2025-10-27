import { beforeEach, describe, expect, test, vi } from "vitest";
import { mockResponse } from "../testUtil/api.ts";
import { mutationCreateStory, mutationUpdateStoryStatus } from "./graphql/mutation.ts";
import { queryGetStory } from "./graphql/query.ts";
import * as sut from "./story-api.ts";

vi.mock("uuid", () => ({
	v4: vi.fn(() => "mocked-uuid-12345"), // Return a constant, predictable string
}));

describe("story-api", () => {
	beforeEach(() => {
		vi.stubGlobal("fetch", vi.fn());
		vi.stubEnv("TRACKER_BOOT_URL", "https://dev-tracker-boot.com");
		vi.stubEnv("TRACKER_BOOT_API_TOKEN", "api-token");
		vi.stubEnv("PROJECT_ID", "10000001");
	});

	describe("createStory", () => {
		test("when createStory, then log and fetch API is called", async () => {
			console.log = vi.fn();
			const expected = {
				data: { executeCommand: { data: [{ id: 9999999 }] } },
			};
			vi.mocked(fetch).mockResolvedValue(mockResponse(200, expected));

			await sut.createStory({
				personId: 1000,
				title: "title",
				description: "description",
				storyType: "Chore",
			});

			expect(console.log).toHaveBeenCalledWith(
				"Tracker Boot story link - https://dev-tracker-boot.com/projects/10000001/stories/9999999",
			);
			expect(fetch).toHaveBeenCalledWith(
				"https://dev-tracker-boot.com/graphql",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer api-token",
					},
					body: JSON.stringify({
						query: mutationCreateStory,
						variables: {
							personId: 1000,
							title: "title",
							description: "description",
							storyType: "Chore",
							projectId: "10000001",
							commandId: "mocked-uuid-12345",
						},
					}),
				},
			);
		});

		test.each([400, 401, 403, 404, 500])(
			"given server response is not ok with %s status, when getMe, then throw error",
			async (status) => {
				vi.mocked(fetch).mockResolvedValue(mockResponse(status, {}));

				await expect(
					sut.createStory({
						personId: 1000,
						title: "title",
						description: "description",
						storyType: "Chore",
					}),
				).rejects.toThrow(`failed to create user story, status: ${status}`);
			},
		);
	});

	describe("updateStory", () => {
		test("when updateStory, then fetch API is called", async () => {
			const expected = {
				data: { executeCommand: { data: [{ id: 9999999 }] } },
			};
			vi.mocked(fetch).mockResolvedValue(mockResponse(200, expected));

			await sut.updateStoryStatus({
				personId: 1000,
				id: 2000000,
				status: "Finished",
			});

			expect(console.log).toHaveBeenCalledWith(
				"Tracker Boot story link - https://dev-tracker-boot.com/projects/10000001/stories/9999999",
			);
			expect(fetch).toHaveBeenCalledWith(
				"https://dev-tracker-boot.com/graphql",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer api-token",
					},
					body: JSON.stringify({
						query: mutationUpdateStoryStatus,
						variables: {
							personId: 1000,
							id: 2000000,
							status: "Finished",
							projectId: "10000001",
							commandId: "mocked-uuid-12345",
						},
					}),
				},
			);
		});

		test.each([400, 401, 403, 404, 500])(
			"given server response is not ok with %s status, when getMe, then throw error",
			async (status) => {
				vi.mocked(fetch).mockResolvedValue(mockResponse(status, {}));

				await expect(
					sut.updateStoryStatus({
						personId: 1000,
						id: 2000000,
						status: "Finished",
					}),
				).rejects.toThrow(`failed to update story status, status: ${status}`);
			},
		);
	});

	describe("getStory", () => {
		test("when getStory, then fetch API is called", async () => {
			const expected = {
				data: { story: { id: 1000000, status: "Unstarted" } },
			};
			vi.mocked(fetch).mockResolvedValue(mockResponse(200, expected));

			await sut.getStory(1000000);

			expect(fetch).toHaveBeenCalledWith(
				"https://dev-tracker-boot.com/graphql",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer api-token",
					},
					body: JSON.stringify({
						query: queryGetStory,
						variables: {
							id: 1000000,
							projectId: "10000001",
						},
					}),
				},
			);
		});

		test("when getStory, then fetch story", async () => {
			const expected = {
				data: { story: { id: 1000000, status: "Unstarted" } },
			};
			vi.mocked(fetch).mockResolvedValue(mockResponse(200, expected));

			const result = await sut.getStory(1000000);

			expect(result).toEqual({ id: 1000000, status: "Unstarted" });
		});

		test.each([400, 401, 403, 404, 500])(
			"given server response is not ok with %s status, when getMe, then throw error",
			async (status) => {
				vi.mocked(fetch).mockResolvedValue(mockResponse(status, {}));

				await expect(sut.getStory(1000000)).rejects.toThrow(
					`failed to get story, status: ${status}`,
				);
			},
		);
	});
});
