import { getStory, updateStoryStatus } from "../api/story-api.ts";
import { getMe } from "../api/user-api.ts";

export const run = async (storyId?: string) => {
	if (!storyId) {
		throw new Error("[story-id] is not existed for [start-story] command");
	}
	const story = await getStory(Number(storyId));
	if (story.status === "Unstarted") {
		const me = await getMe();
		void updateStoryStatus({
			personId: me.id,
			id: Number(storyId),
			status: "Started",
		});
	}
};
