import { getStory, updateStoryStatus } from "../api/story-api.ts";
import { getMe } from "../api/user-api.ts";

export const run = async (storyId?: string) => {
	if (!storyId) {
		throw new Error("[story-id] is not existed for [start-story] command");
	}
	console.log(`[start-story] storyId: ${storyId}`);
	const story = await getStory(Number(storyId));
	if (story.storyType === "Release") {
		console.log(
			`[start-story] Release storyType is not to update story status`,
		);
		return;
	}
	if (story.status === "Unstarted") {
		const me = await getMe();
		void updateStoryStatus({
			personId: me.id,
			id: Number(storyId),
			status: "Started",
		});
	}
};
