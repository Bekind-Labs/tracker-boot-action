import * as core from "@actions/core";
import { beforeEach, describe, expect, test, vi } from "vitest";
import * as sut from "./main.ts";
import * as finishStory from "./process/finish-story.ts";
import * as notifyFailedCI from "./process/notify-failed-ci.ts";
import * as startStory from "./process/start-story.ts";

describe("main", () => {
	beforeEach(() => {
		process.argv = ["node", "script/main.ts"];
	});

	test("finish-story command run finish-story process", () => {
		process.argv.push("finish-story", "200011756");
		const spyFinishStoryRun = vi.spyOn(finishStory, "run");

		sut.main();

		expect(spyFinishStoryRun).toHaveBeenCalledWith("200011756");
	});

	test("given story id is not existed, when finish-story command, then exit process without call", () => {
		process.argv.push("finish-story");
		const spyCoreSetFailed = vi.spyOn(core, "setFailed");
		const spyFinishStoryRun = vi
			.spyOn(finishStory, "run")
			.mockImplementation(() => {
				throw new Error("[story-id] is not existed for [finish-story] command");
			});

		sut.main();

		expect(spyFinishStoryRun).toHaveBeenCalledWith(undefined);
		expect(spyCoreSetFailed).toHaveBeenCalledWith(
			"[story-id] is not existed for [finish-story] command",
		);
	});

	test("start-story command run start-story process", () => {
		process.argv.push("start-story", "200011756");
		const spyStartStoryRun = vi.spyOn(startStory, "run");

		sut.main();

		expect(spyStartStoryRun).toHaveBeenCalledWith("200011756");
	});

	test("given story id is not existed, when start-story command, then exit process without call", () => {
		process.argv.push("start-story");
		const spyCoreSetFailed = vi.spyOn(core, "setFailed");
		const spyStartStoryRun = vi
			.spyOn(startStory, "run")
			.mockImplementation(() => {
				throw new Error("[story-id] is not existed for [start-story] command");
			});

		sut.main();

		expect(spyStartStoryRun).toHaveBeenCalledWith(undefined);
		expect(spyCoreSetFailed).toHaveBeenCalledWith(
			"[story-id] is not existed for [start-story] command",
		);
	});

	test("notify-failed-ci command run notify-failed-ci process", () => {
		process.argv.push(
			"notify-failed-ci",
			"https://github.com/actions/pipeline/id",
			"https://github.com/actions/aaa/commit/294a6091da868069a08330988a27fcbf3b2cd88a",
			"294a6091da868069a08330988a27fcbf3b2cd88a",
		);
		const spyNotifyFailedCI = vi.spyOn(notifyFailedCI, "run");

		sut.main();

		expect(spyNotifyFailedCI).toHaveBeenCalledWith({
			workflowUrl: "https://github.com/actions/pipeline/id",
			commitUrl:
				"https://github.com/actions/aaa/commit/294a6091da868069a08330988a27fcbf3b2cd88a",
			commitHash: "294a6091da868069a08330988a27fcbf3b2cd88a",
		});
	});

	test("given action workflow url is not existed, when notify-failed-ci command, then exit process without call", () => {
		process.argv.push("notify-failed-ci");
		const spyCoreSetFailed = vi.spyOn(core, "setFailed");
		const spyFinishStoryRun = vi
			.spyOn(notifyFailedCI, "run")
			.mockImplementation(() => {
				throw new Error(
					"[workflow-url] is not existed for [notify-failed-ci] command",
				);
			});

		sut.main();

		expect(spyFinishStoryRun).toHaveBeenCalledWith({
			workflowUrl: undefined,
			commitUrl: undefined,
			commitHash: undefined,
		});
		expect(spyCoreSetFailed).toHaveBeenCalledWith(
			"[workflow-url] is not existed for [notify-failed-ci] command",
		);
	});

	test.each([
		{ command: ["wrong-command"], expectedCommand: "wrong-command" },
		{ command: [], expectedCommand: "undefined" },
	])(
		"given command is not existed or undefined, when main, then exit process without call",
		({ command, expectedCommand }) => {
			process.argv.push(...command);
			const spyFinishStoryRun = vi.spyOn(finishStory, "run");
			const spyNotifyFailedCI = vi.spyOn(notifyFailedCI, "run");
			const spyCoreSetFailed = vi.spyOn(core, "setFailed");

			sut.main();

			expect(spyFinishStoryRun).not.toHaveBeenCalled();
			expect(spyNotifyFailedCI).not.toHaveBeenCalled();
			expect(spyCoreSetFailed).toHaveBeenCalledWith(
				`command is not existed. command: ${expectedCommand}`,
			);
		},
	);
});
