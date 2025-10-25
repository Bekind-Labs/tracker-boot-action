import { v4 as uuidv4 } from "uuid";
import { mutationRequest } from "../util/api.ts";
import { mutationCreateStory, mutationUpdateStoryStatus } from "./graphql/mutation.ts"

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
		mutationRequest(mutationCreateStory, {
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
		mutationRequest(mutationUpdateStoryStatus, {
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
