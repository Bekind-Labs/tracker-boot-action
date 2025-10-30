import dotenv from "dotenv";
import type { KeywordType } from "./process/finish-story.ts";
import * as finishStory from "./process/finish-story.ts";
import * as notifyFailedCI from "./process/notify-failed-ci.ts";
import * as startStory from "./process/start-story.ts";

dotenv.config();

const handleNotMatched = (command: string | undefined) => {
	throw new Error(`command is not existed. command: ${command}`);
};

const handleCommand = async () => {
	const command = process.argv[2];

	if (command === "start-story") {
		const storyId = process.argv[3];
		await startStory.run(storyId);
	} else if (command === "finish-story") {
		const storyId = process.argv[3];
		const keyword = process.argv[4];
		console.log(`[finish-story] keyword: ${keyword}`);
		await finishStory.run(storyId, keyword as KeywordType);
	} else if (command === "notify-failed-ci") {
		const workflowUrl = process.argv[3];
		const commitUrl = process.argv[4];
		const commitHash = process.argv[5];
		await notifyFailedCI.run({ workflowUrl, commitUrl, commitHash });
	} else {
		handleNotMatched(command);
	}
};

export const main = async () => {
	try {
		await handleCommand();
	} catch (error: unknown) {
		console.error((error as Error).message);
	}
	return 0;
};

await main();
