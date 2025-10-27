export const queryGetMe = `
query getMe {
  me {
    id
  }
}
`;

export const queryGetStory = `
query getStory($projectId: ID!, $storyId: ID!) {
	story(projectId: $projectId, storyId: $storyId) {
		id
	  status
	}
}`;
