import { getStory, type Story, type StoryStatus, updateStoryStatus } from "../api/story-api.ts";
import { getMe } from "../api/user-api.ts";

export type KeywordType = "finish" | "fix";

const isOkayToFinished = (story: Story, keyword: KeywordType) => {
	switch (story.storyType) {
		case "Feature":
		case "Design":
		case "Chore":
			return story.status === "Started" && keyword === "finish";
		case "Bug":
			return (
				story.status === "Started" &&
				(keyword === "fix" || keyword === "finish")
			);
		default:
			return false;
	}
};

const nextStatus = (story: Story): StoryStatus => {
	switch (story.storyType) {
		case "Chore":
			return "Accepted";
		default:
			return "Finished";
	}
};

export const run = async (storyId?: string, keyword?: KeywordType) => {
	if (!storyId) {
		throw new Error("[story-id] is not existed for [finish-story] command");
	}
	if (!keyword) {
		throw new Error("[keyword] is not existed for [finish-story] command");
	}
	console.log(`[finish-story] storyId: ${storyId}`);
	const id = Number(storyId);
	const story = await getStory(id);
	if (isOkayToFinished(story, keyword)) {
		const me = await getMe();
		void updateStoryStatus({
			personId: me.id,
			id: id,
			status: nextStatus(story),
		});
	}
};
