import { updateStoryStatus } from "../api/story-api.ts";
import { getMe } from "../api/user-api.ts";

export const run = async (storyId?: string) => {
	if (!storyId) {
		throw new Error("[story-id] is not existed for [finish-story] command");
	}
	const me = await getMe();
	void updateStoryStatus({
		personId: me.id,
		id: Number(storyId),
		status: "Finished",
	});
};
