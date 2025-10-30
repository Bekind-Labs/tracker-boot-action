import { beforeEach, describe, expect, type MockInstance, test, vi } from "vitest";
import type { StoryStatus, StoryType } from "../api/story-api.ts";
import * as storyApi from "../api/story-api.ts";
import * as userApi from "../api/user-api.ts";
import type { KeywordType } from "./finish-story.ts";
import * as sut from "./finish-story.ts";

describe("finish-story", () => {
	let spyGetMe: MockInstance;
	beforeEach(() => {
		spyGetMe = vi.spyOn(userApi, "getMe").mockResolvedValue({ id: 1000 });
	});

	test("given storyId is not existed, when run finish-story, then throw an error", async () => {
		await expect(sut.run()).rejects.toThrow(
			"[story-id] is not existed for [finish-story] command",
		);
		expect(spyGetMe).not.toHaveBeenCalled();
	});

	test("given keyword is not existed, when run finish-story, then throw an error", async () => {
		await expect(sut.run("keyword")).rejects.toThrow(
			"[keyword] is not existed for [finish-story] command",
		);
		expect(spyGetMe).not.toHaveBeenCalled();
	});

	test.each(["Feature", "Design", "Chore"])(
		"given %s story status is Started, but keyword is fix, when run process, then not to update story status",
		async (storyType) => {
			const spyUpdateStoryStatus = vi.spyOn(storyApi, "updateStoryStatus");
			const mockGetStory = vi.spyOn(storyApi, "getStory").mockResolvedValue({
				id: 1000001,
				status: "Started",
				storyType: storyType as StoryType,
			});

			await sut.run("1000001", "fix");

			expect(spyGetMe).not.toHaveBeenCalled();
			expect(mockGetStory).toHaveBeenCalledWith(1000001);
			expect(spyUpdateStoryStatus).not.toHaveBeenCalled();
		},
	);

	describe.each(["Feature", "Design"])(
		"given story type is %s",
		(storyType) => {
			test("when run process, then update story status to Finished", async () => {
				const spyUpdateStoryStatus = vi.spyOn(storyApi, "updateStoryStatus");
				const mockGetStory = vi.spyOn(storyApi, "getStory").mockResolvedValue({
					id: 1000001,
					status: "Started",
					storyType: storyType as StoryType,
				});

				await sut.run("1000001", "finish");

				expect(spyGetMe).toHaveBeenCalledTimes(1);
				expect(mockGetStory).toHaveBeenCalledWith(1000001);
				expect(spyUpdateStoryStatus).toHaveBeenCalledWith({
					personId: 1000,
					id: 1000001,
					status: "Finished",
				});
			});

			test.each([
				"Unscheduled",
				"Unstarted",
				"Finished",
				"Delivered",
				"Accepted",
				"Rejected",
			])(
				"given story status is %s, when run process, then not to update story status",
				async (staus) => {
					const spyUpdateStoryStatus = vi.spyOn(storyApi, "updateStoryStatus");
					const mockGetStory = vi
						.spyOn(storyApi, "getStory")
						.mockResolvedValue({
							id: 1000001,
							status: staus as StoryStatus,
							storyType: storyType as StoryType,
						});

					await sut.run("1000001", "finish");

					expect(spyGetMe).not.toHaveBeenCalled();
					expect(mockGetStory).toHaveBeenCalledWith(1000001);
					expect(spyUpdateStoryStatus).not.toHaveBeenCalled();
				},
			);
		},
	);

	describe.each(["finish", "fix"])(
		"given story type is Bug and keyword is %s",
		(keyword: string) => {
			test("when run process, then update story status to Finished", async () => {
				const spyUpdateStoryStatus = vi.spyOn(storyApi, "updateStoryStatus");
				const mockGetStory = vi.spyOn(storyApi, "getStory").mockResolvedValue({
					id: 1000001,
					status: "Started",
					storyType: "Bug",
				});

				await sut.run("1000001", keyword as KeywordType);

				expect(spyGetMe).toHaveBeenCalledTimes(1);
				expect(mockGetStory).toHaveBeenCalledWith(1000001);
				expect(spyUpdateStoryStatus).toHaveBeenCalledWith({
					personId: 1000,
					id: 1000001,
					status: "Finished",
				});
			});

			test.each([
				"Unscheduled",
				"Unstarted",
				"Finished",
				"Delivered",
				"Accepted",
				"Rejected",
			])(
				"given story status is %s, when run process, then not to update story status",
				async (staus) => {
					const spyUpdateStoryStatus = vi.spyOn(storyApi, "updateStoryStatus");
					const mockGetStory = vi
						.spyOn(storyApi, "getStory")
						.mockResolvedValue({
							id: 1000001,
							status: staus as StoryStatus,
							storyType: "Bug",
						});

					await sut.run("1000001", keyword as KeywordType);

					expect(spyGetMe).not.toHaveBeenCalled();
					expect(mockGetStory).toHaveBeenCalledWith(1000001);
					expect(spyUpdateStoryStatus).not.toHaveBeenCalled();
				},
			);
		},
	);

	describe("given story type is Chore", () => {
		test("when run process, then update story status to Finished", async () => {
			const spyUpdateStoryStatus = vi.spyOn(storyApi, "updateStoryStatus");
			const mockGetStory = vi.spyOn(storyApi, "getStory").mockResolvedValue({
				id: 1000001,
				status: "Started",
				storyType: "Chore",
			});

			await sut.run("1000001", "finish");

			expect(spyGetMe).toHaveBeenCalledTimes(1);
			expect(mockGetStory).toHaveBeenCalledWith(1000001);
			expect(spyUpdateStoryStatus).toHaveBeenCalledWith({
				personId: 1000,
				id: 1000001,
				status: "Accepted",
			});
		});

		test.each([
			"Unscheduled",
			"Unstarted",
			"Finished",
			"Delivered",
			"Accepted",
			"Rejected",
		])(
			"given story status is %s, when run process, then not to update story status",
			async (staus) => {
				const spyUpdateStoryStatus = vi.spyOn(storyApi, "updateStoryStatus");
				const mockGetStory = vi.spyOn(storyApi, "getStory").mockResolvedValue({
					id: 1000001,
					status: staus as StoryStatus,
					storyType: "Chore",
				});

				await sut.run("1000001", "finish");

				expect(spyGetMe).not.toHaveBeenCalled();
				expect(mockGetStory).toHaveBeenCalledWith(1000001);
				expect(spyUpdateStoryStatus).not.toHaveBeenCalled();
			},
		);

		test("given story status is Started but keyword is fix, when run process, then not to update story status", async () => {
			const spyUpdateStoryStatus = vi.spyOn(storyApi, "updateStoryStatus");
			const mockGetStory = vi.spyOn(storyApi, "getStory").mockResolvedValue({
				id: 1000001,
				status: "Started",
				storyType: "Chore",
			});

			await sut.run("1000001", "fix");

			expect(spyGetMe).not.toHaveBeenCalled();
			expect(mockGetStory).toHaveBeenCalledWith(1000001);
			expect(spyUpdateStoryStatus).not.toHaveBeenCalled();
		});
	});

	describe("given story type is Release", () => {
		test.each([
			"Unscheduled",
			"Unstarted",
			"Started",
			"Finished",
			"Delivered",
			"Accepted",
			"Rejected",
		])(
			"given story status is %s, when run process, then not to update story status",
			async (staus) => {
				const spyUpdateStoryStatus = vi.spyOn(storyApi, "updateStoryStatus");
				const mockGetStory = vi.spyOn(storyApi, "getStory").mockResolvedValue({
					id: 1000001,
					status: staus as StoryStatus,
					storyType: "Release",
				});

				await sut.run("1000001", "finish");

				expect(spyGetMe).not.toHaveBeenCalled();
				expect(mockGetStory).toHaveBeenCalledWith(1000001);
				expect(spyUpdateStoryStatus).not.toHaveBeenCalled();
			},
		);
	});
});
