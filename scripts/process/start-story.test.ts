import { beforeEach, describe, expect, type MockInstance, test, vi } from "vitest";
import type { StoryStatus } from "../api/story-api.ts";
import * as storyApi from "../api/story-api.ts";
import * as userApi from "../api/user-api.ts";
import * as sut from "./start-story.ts";

describe("start-story", () => {
	let spyGetMe: MockInstance;
	beforeEach(() => {
		spyGetMe = vi.spyOn(userApi, "getMe").mockResolvedValue({ id: 1000 });
	});

	test("given story is unstarted, when run start-story, then update story status", async () => {
		const spyUpdateStoryStatus = vi.spyOn(storyApi, "updateStoryStatus");
		const mockGetStory = vi.spyOn(storyApi, "getStory").mockResolvedValue({
			id: 1000001,
			status: "Unstarted",
		});

		await sut.run("1000001");

		expect(spyGetMe).toHaveBeenCalledTimes(1);
		expect(mockGetStory).toHaveBeenCalledWith(1000001);
		expect(spyUpdateStoryStatus).toHaveBeenCalledWith({
			personId: 1000,
			id: 1000001,
			status: "Started",
		});
	});

	test.each([
		"Unscheduled",
		"Started",
		"Finished",
		"Delivered",
		"Accepted",
		"Rejected",
	])(
		"given story is %s, when run start-story, then update story status",
		async (staus) => {
			const spyUpdateStoryStatus = vi.spyOn(storyApi, "updateStoryStatus");
			const mockGetStory = vi.spyOn(storyApi, "getStory").mockResolvedValue({
				id: 1000001,
				status: staus as StoryStatus,
			});

			await sut.run("1000001");

			expect(spyGetMe).not.toHaveBeenCalled();
			expect(mockGetStory).toHaveBeenCalledWith(1000001);
			expect(spyUpdateStoryStatus).not.toHaveBeenCalled();
		},
	);

	test("given workflowUrl is not existed, when run start-story, then throw an error", async () => {
		await expect(sut.run()).rejects.toThrow(
			"[story-id] is not existed for [start-story] command",
		);
		expect(spyGetMe).not.toHaveBeenCalled();
	});
});
