import { beforeEach, describe, expect, type MockInstance, test, vi } from "vitest";
import * as storyApi from "../api/story-api.ts";
import * as userApi from "../api/user-api.ts";
import * as sut from "../process/notify-failed-ci.ts";

describe("notify-failed-ci", () => {
	let spyGetMe: MockInstance;
	beforeEach(() => {
		spyGetMe = vi.spyOn(userApi, "getMe").mockResolvedValue({ id: 1000 });
	});

	test("run notify-failed-ci, then create story", async () => {
		const spyCreatStory = vi.spyOn(storyApi, "createStory").mockResolvedValue();

		await sut.run({
			workflowUrl: "https://github.com/actions/pipeline/id",
			commitUrl:
				"https://github.com/actions/aaa/commit/294a6091da868069a08330988a27fcbf3b2cd88a",
			commitHash: "294a6091da868069a08330988a27fcbf3b2cd88a",
		});

		expect(spyGetMe).toHaveBeenCalledTimes(1);
		expect(spyCreatStory).toHaveBeenCalledWith({
			personId: 1000,
			title: "Actions failed for 294a609 commit",
			description:
				"### Github Actions Link\n- https://github.com/actions/pipeline/id\n- https://github.com/actions/aaa/commit/294a6091da868069a08330988a27fcbf3b2cd88a",
			storyType: "Chore",
		});
	});

	test.each([
		{
			request: {
				commitHash: "294a6091da868069a08330988a27fcbf3b2cd88a",
				commitUrl:
					"https://github.com/actions/aaa/commit/294a6091da868069a08330988a27fcbf3b2cd88a",
			},
			expectedError:
				"[workflow-url] is not existed for [notify-failed-ci] command",
		},
		{
			request: {
				commitUrl:
					"https://github.com/actions/aaa/commit/294a6091da868069a08330988a27fcbf3b2cd88a",
				workflowUrl: "https://github.com/actions/pipeline/id",
			},
			expectedError:
				"[commit-hash] is not existed for [notify-failed-ci] command",
		},
		{
			request: {
				commitHash: "294a6091da868069a08330988a27fcbf3b2cd88a",
				workflowUrl: "https://github.com/actions/pipeline/id",
			},
			expectedError:
				"[commit-url] is not existed for [notify-failed-ci] command",
		},
	])(
		"given required parameter is not existed, when run notify-failed-ci, then throw an error",
		async ({ request, expectedError }) => {
			await expect(sut.run(request)).rejects.toThrow(expectedError);
			expect(spyGetMe).not.toHaveBeenCalled();
		},
	);
});
