import { v4 as uuidv4 } from "uuid";
import { graphQlRequest } from "../util/api.ts";
import { mutationCreateStory, mutationUpdateStoryStatus } from "./graphql/mutation.ts";
import { queryGetStory } from "./graphql/query.ts";

const print = async ({
	url,
	projectId,
	response,
}: {
	url?: string;
	projectId?: string;
	response: Response;
}) => {
	const result = await response.json();
	console.log("mutate story: ", { result: JSON.stringify(result) });
	const storyId = result.data.executeCommand.data[0].id;
	console.log(
		`Tracker Boot story link - ${url}/projects/${projectId}/stories/${storyId}`,
	);
};

export const createStory = async (request: CreateStory) => {
	const url = process.env.TRACKER_BOOT_URL;
	const projectId = process.env.PROJECT_ID;
	const response = await fetch(
		`${url}/graphql`,
		graphQlRequest(mutationCreateStory, {
			...request,
			projectId,
			commandId: uuidv4(),
		}),
	);
	if (!response.ok) {
		throw new Error(`failed to create user story, status: ${response.status}`);
	}
	await print({ url, projectId, response });
};

export const updateStoryStatus = async (request: UpdateStoryStatus) => {
	const url = process.env.TRACKER_BOOT_URL;
	const projectId = process.env.PROJECT_ID;
	const response = await fetch(
		`${url}/graphql`,
		graphQlRequest(mutationUpdateStoryStatus, {
			...request,
			projectId,
			commandId: uuidv4(),
		}),
	);
	if (!response.ok) {
		throw new Error(
			`failed to update story status, status: ${response.status}`,
		);
	}
	await print({ url, projectId, response });
};

export const getStory = async (storyId: number): Promise<Story> => {
	const url = process.env.TRACKER_BOOT_URL;
	const projectId = process.env.PROJECT_ID;
	const response = await fetch(
		`${url}/graphql`,
		graphQlRequest(queryGetStory, {
			storyId,
			projectId,
		}),
	);
	if (!response.ok) {
		throw new Error(`failed to get story, status: ${response.status}`);
	}
	const result = await response.json();
	console.log("story status: ", { result: JSON.stringify(result) });
	return {
		id: result.data.story.id,
		status: result.data.story.status,
		storyType: result.data.story.storyType,
	};
};

export type CreateStory = {
	personId: number;
	title: string;
	description: string;
	storyType: string;
};

export type UpdateStoryStatus = {
	personId: number;
	id: number;
	status: string;
};

export type Story = {
	id: number;
	status: StoryStatus;
	storyType: StoryType;
};

export type StoryStatus =
	| "Unscheduled"
	| "Unstarted"
	| "Started"
	| "Finished"
	| "Delivered"
	| "Accepted"
	| "Rejected";

export type StoryType = "Feature" | "Bug" | "Chore" | "Release" | "Design";
