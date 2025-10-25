import * as core from "@actions/core";
import dotenv from "dotenv";
import * as finishStory from "./process/finish-story.ts";
import * as notifyFailedCI from "./process/notify-failed-ci.ts";

dotenv.config();

const handleNotMatched = (command: string | undefined) => {
	throw new Error(`command is not existed. command: ${command}`);
};

const handleCommand = () => {
	const command = process.argv[2];

	if (command === "finish-story") {
		const storyId = process.argv[3];
		void finishStory.run(storyId);
	} else if (command === "notify-failed-ci") {
		const workflowUrl = process.argv[3];
		const commitHash = process.argv[4];
		void notifyFailedCI.run({ workflowUrl, commitHash });
	} else {
		handleNotMatched(command);
	}
};

export const main = () => {
	try {
		handleCommand();
	} catch (error: unknown) {
		core.setFailed((error as Error).message);
	}
};

main();
