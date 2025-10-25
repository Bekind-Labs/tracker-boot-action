export const mutationCreateStory = `
mutation ExecuteStoryCreate(
  $projectId: ID!
  $commandId: ID!
  $personId: ID!
  $title: String!
  $description: String
  $storyType: StoryType!
) {
  executeCommand(input: { 
    projectId: $projectId
    version: 1
    commandId: $commandId
    personId: $personId
    type: STORY_CREATE
    parameters: { title: $title, description: $description, storyType: $storyType }
  }) {
    version
    type
    data {
      __typename
      ... on Story {
      	id
      }
    }
  }
}
`;

export const mutationUpdateStoryStatus = `
mutation ExecuteStoryUpdate(
  $projectId: ID!
  $commandId: ID!
  $personId: ID!
  $id: ID!
  $status: String
) {
  executeCommand(
    input: {
      projectId: $projectId
      version: 1
      commandId: $commandId
      personId: $personId
      type: STORY_UPDATE
      parameters: { id: $id, status: $status }
    }
  ) {
    version
    type
    data {
      __typename
      ... on Story {
        id
      }
    }
  }
}`;
