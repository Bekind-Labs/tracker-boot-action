import { createStory } from "../api/story-api.ts";
import { getMe } from "../api/user-api.ts";

const title = (commitHash: string) =>
	`Actions failed for ${commitHash.slice(0, 7)} commit`;
const description = (workflowUrl: string, commitUrl: string) =>
	`### Github Actions Link\n- ${workflowUrl}\n- ${commitUrl}`;

export const run = async ({ workflowUrl, commitUrl, commitHash }: Request) => {
	if (!workflowUrl) {
		throw new Error(
			"[workflow-url] is not existed for [notify-failed-ci] command",
		);
	}
	if (!commitUrl) {
		throw new Error(
			"[commit-url] is not existed for [notify-failed-ci] command",
		);
	}
	if (!commitHash) {
		throw new Error(
			"[commit-hash] is not existed for [notify-failed-ci] command",
		);
	}
	console.log(
		`[notify-failed-ci] request: ${JSON.stringify({ workflowUrl, commitUrl, commitHash })}`,
	);
	const me = await getMe();
	await createStory({
		personId: me.id,
		title: title(commitHash),
		description: description(workflowUrl, commitUrl),
		storyType: "Chore",
	});
};

export type Request = {
	workflowUrl?: string;
	commitUrl?: string;
	commitHash?: string;
};
