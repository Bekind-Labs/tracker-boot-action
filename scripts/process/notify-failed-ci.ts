import { createStory } from "../api/story-api.ts";
import { getMe } from "../api/user-api.ts";

const title = (commitHash: string) => `Actions failed for ${commitHash} commit`;
const description = (workflowUrl: string) =>
	`### Github Actions Link\n- ${workflowUrl}`;

export const run = async ({ workflowUrl, commitHash }: Request) => {
	if (!workflowUrl) {
		throw new Error(
			"[workflow-url] is not existed for [notify-failed-ci] command",
		);
	}
	if (!commitHash) {
		throw new Error(
			"[commit-hash] is not existed for [notify-failed-ci] command",
		);
	}
	const me = await getMe();
	await createStory({
		personId: me.id,
		title: title(commitHash),
		description: description(workflowUrl),
		storyType: "Chore",
	});
};

export type Request = {
	workflowUrl?: string;
	commitHash?: string;
};
