export const queryGetMe = `
query getMe {
  me {
    id
  }
}
`;

export const queryGetStory = `
query GetStory(
	$projectId: ID!,
	$storyId: ID!
) {
	story(projectId: $projectId, storyId: $storyId) {
		id
	  status
	}
}`;
