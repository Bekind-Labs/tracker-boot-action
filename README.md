# Tracker Boot Action

A GitHub Action that automatically manages Tracker Boot story statuses based on commit messages and CI/CD pipeline results.

## Features

### 1. Update Story Status Action (`update-story-status`)

Automatically manages story lifecycle based on commit messages and CI/CD results:

- 🚀 **Automatic Story Starting**: Automatically starts stories when commits with story IDs are pushed
- ✅ **Story Completion**: Marks stories as finished when commits contain finish keywords and CI succeeds

### 2. Report Workflow Failure Action (`report-workflow-failure`)

Notifies your team when CI/CD pipelines fail:

- 🔔 **Automatic Failure Notifications**: Creates Chore stories in Tracker Boot when workflows fail
- 🔗 **Rich Context**: Includes workflow URLs, commit URLs, and commit hashes in notifications

## Usage

This action provides two separate actions for different use cases:

1. **update-story-status**: Updates story status based on commit messages and job results
2. **report-workflow-failure**: Reports workflow failures to Tracker Boot

### Prerequisites

- A Tracker Boot account and API token
- A GitHub repository with GitHub Actions enabled
- Project ID in your tracker boot project URL

### Setup

#### 1. Add Secrets to Your Repository

Navigate to your repository settings and add the following secret:

- `TRACKER_BOOT_API_TOKEN`: Your Tracker Boot API token

**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

#### 2. Create a Workflow File

Create a workflow file in your repository (e.g., `.github/workflows/tracker-boot.yml`):

**Option 1: Update Story Status Only**

```yaml
name: CI with Tracker Boot Integration

on:
  push:
    branches:
      - main
      - develop

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      # Your build and test steps here
      - run: npm run build
      - run: npm test

      - name: Update Tracker Boot Story Status
        uses: Bekind-Labs/tracker-boot-action/update-story-status@main
        if: always()  # Run even if previous steps fail
        with:
          tracker-boot-api-token: ${{ secrets.TRACKER_BOOT_API_TOKEN }}
          project-id: "YOUR_PROJECT_ID"  # Replace with your Tracker Boot project ID
          job-status: ${{ job.status }}
```

**Option 2: Report Workflow Failures**

```yaml
name: CI with Tracker Boot Integration

on:
  push:
    branches:
      - main
      - develop

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      # Your build and test steps here
      - run: npm run build
      - run: npm test

      - name: Report Workflow Failure
        uses: Bekind-Labs/tracker-boot-action/report-workflow-failure@main
        if: always()
        with:
          tracker-boot-api-token: ${{ secrets.TRACKER_BOOT_API_TOKEN }}
          project-id: "YOUR_PROJECT_ID"
          job-status: ${{ job.status }}
```

**Option 3: Use Both Actions**

```yaml
name: CI with Tracker Boot Integration

on:
  push:
    branches:
      - main
      - develop

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      # Your build and test steps here
      - run: npm run build
      - run: npm test

      - name: Update Tracker Boot Story Status
        uses: Bekind-Labs/tracker-boot-action/update-story-status@main
        if: always()
        with:
          tracker-boot-api-token: ${{ secrets.TRACKER_BOOT_API_TOKEN }}
          project-id: "YOUR_PROJECT_ID"
          job-status: ${{ job.status }}

      - name: Report Workflow Failure
        uses: Bekind-Labs/tracker-boot-action/report-workflow-failure@main
        if: always()
        with:
          tracker-boot-api-token: ${{ secrets.TRACKER_BOOT_API_TOKEN }}
          project-id: "YOUR_PROJECT_ID"
          job-status: ${{ job.status }}
```

### Configuration

#### Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `tracker-boot-api-token` | Yes | Your Tracker Boot API token for authentication |
| `project-id` | Yes | The Tracker Boot project ID (e.g., "100000025") |
| `job-status` | Yes | Current job status, typically `${{ job.status }}` |

#### Outputs

This action does not produce outputs but updates story statuses in Tracker Boot based on commit messages and job results.

## Commit Message Format

The action automatically detects story IDs and keywords in your commit messages:

### Starting a Story

When you push a commit with a story ID, the action automatically starts the story:

```bash
git commit -m "[#200011863] implement user authentication"
git commit -m "#200011863 add login feature"
git commit -m "200011863 update API endpoint"
```

### Finishing a Story

To mark a story as finished, include finish keywords in your commit message:

```bash
git commit -m "[Finished #200011863] implement user authentication"
git commit -m "[Finish #200011863] add login feature"
git commit -m "[Finishes #200011863] update API endpoint"
```

**Note**: The story will only be marked as finished if:
- The commit message contains a finish keyword (`finished`, `finish`, or `finishes`)
- The CI job completes successfully

### Multiple Stories

The action extracts the **first** story ID found in the commit message:

```bash
# This will process story #200011863
git commit -m "[#200011863] [#200011864] implement features"
```

## How It Works

### Update Story Status Action

This action manages the story lifecycle based on commit messages:

1. **Story ID Extraction**: Extracts a 9-digit story ID from the commit message
2. **Status Detection**: Checks for finishing keywords (e.g. `finish`, `finished`, `fix`, `fixing`) in the commit message
3. **Story Starting**: Updates story status to "Started" if:
   - Story ID is found in commit message
   - No finish keyword is present
   - Story status is currently `Unstarted`
   - CI job status is `success`
4. **Story Finishing**: Updates story status to "Finished" if:
   - Story ID is found in commit message
   - Finish or fix keyword is present
   - Fix keyword is working for only Bug story types
   - CI job status is `success`

### Report Workflow Failure Action

This action creates notification stories when workflows fail:

1. **Failure Detection**: Monitors job status for failures
2. **First Attempt Only**: Only creates notification on the first run attempt (ignores retries)
3. **Story Creation**: Creates a new Chore story in Tracker Boot with:
   - Title: "Actions failed for {commit_hash}"
   - Description: Links to failed workflow and commit
   - Assigned to: The user who owns the API token

### Example Scenarios

#### Scenario 1: Start Working on a Story (update-story-status)

```bash
# Commit with story ID
git commit -m "[#200011863] implement new feature"
git push
```

**Result** (if CI passes): Story #200011863 status → "Started"

#### Scenario 2: Complete a Story (update-story-status)

```bash
# Commit with finish keyword
git commit -m "[Finished #200011863] implement new feature"
git push
```

**Result** (if CI passes): Story #200011863 status → "Finished"

#### Scenario 3: CI Failure Notification (report-workflow-failure)

```bash
git commit -m "[#200011863] add tests"
git push
# CI fails on first attempt
```

**Result**: Tracker Boot receives a new Chore story with:
- Title: "Actions failed for {commit_hash}"
- Description: Links to workflow and commit
- Assigned to the API token owner

#### Scenario 4: Using Both Actions

```bash
git commit -m "[Finished #200011863] complete feature implementation"
git push
# CI fails on first attempt
```

**Results**:
- Story #200011863 status remains unchanged (because CI failed)
- A new Chore story is created to notify about the failure

## Testing the Actions Locally

You can customize test cases by modifying the commit messages in the test scripts:

```bash
# add testing cases here
test_commit_messages=(
    "[Finished #200011863] logging for action"
    "[#200011863] implement new feature"
)
```

You can test the actions locally using the provided test scripts:

### Test Update Story Status

```bash
./update-story-status.test.sh
```

### Test Report Workflow Failure

```bash
./report-workflow-failure.test.sh
```

## Common Issues

### Story Status Not Updating

- **Check**: Ensure commit message contains a 9-digit story ID
- **Check**: Verify the story ID exists in your Tracker Boot project
- **Check**: Confirm the CI job status is `success` (stories only update on successful builds)

### Failure Notifications Not Sent

- **Check**: Verify that `report-workflow-failure` action is being used
- **Check**: Ensure this is the first run attempt (retries are ignored)
- **Check**: Confirm the job status is `failure`

### General Issues

- **Check**: Confirm the API token has proper permissions
- **Check**: Verify the project ID is correct
- **Check**: Ensure you're using `if: always()` in the workflow to run the actions even if previous steps fail
- **Check**: Review the action logs in GitHub Actions for detailed error messages

## License

See [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or feature requests, please open an issue in the GitHub repository.
