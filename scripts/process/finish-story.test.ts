import { beforeEach, describe, expect, type MockInstance, test, vi } from "vitest";
import * as storyApi from "../api/story-api.ts";
import * as userApi from "../api/user-api.ts";
import * as sut from "./finish-story.ts";

describe("finish-story", () => {
	let spyGetMe: MockInstance;
	beforeEach(() => {
		spyGetMe = vi.spyOn(userApi, "getMe").mockResolvedValue({ id: 1000 });
	});

	test("when run finish-story, then update story status", async () => {
		const spyUpdateStoryStatus = vi.spyOn(storyApi, "updateStoryStatus");

		await sut.run("1000001");

		expect(spyGetMe).toHaveBeenCalledTimes(1);
		expect(spyUpdateStoryStatus).toHaveBeenCalledWith({
			personId: 1000,
			id: 1000001,
			status: "Finished",
		});
	});

	test("given workflowUrl is not existed, when run finish-story, then throw an error", async () => {
		await expect(sut.run()).rejects.toThrow(
			"[story-id] is not existed for [finish-story] command",
		);
		expect(spyGetMe).not.toHaveBeenCalled();
	});
});
