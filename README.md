# Tracker Boot Action

A GitHub Action that automatically manages Tracker Boot story statuses based on commit messages and CI/CD pipeline results.

## Features

- 🚀 **Automatic Story Starting**: Automatically starts stories when commits are pushed
- ✅ **Story Completion**: Marks stories as finished when success criteria are met
- 🔔 **CI Failure Notifications**: Notifies Tracker Boot when CI pipelines fail

## Usage

### Prerequisites

- A Tracker Boot account and API token
- A GitHub repository with GitHub Actions enabled
- Story IDs in your Tracker Boot project (9-digit numbers, e.g., 200011863)

### Setup

#### 1. Add Secrets to Your Repository

Navigate to your repository settings and add the following secret:

- `TRACKER_BOOT_API_TOKEN`: Your Tracker Boot API token

**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

#### 2. Create a Workflow File

Create a workflow file in your repository (e.g., `.github/workflows/tracker-boot.yml`):

```yaml
name: CI with Tracker Boot Integration

on:
  push:
    branches:
      - main
      - develop
  pull_request:

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Run Tests
        run: |
          # Your build and test commands here
          npm install
          npm test
      
      - name: Update Tracker Boot Status
        uses: Bekind-Labs/tracker-boot-action@v1
        if: always()  # Run even if previous steps fail
        with:
          tracker-boot-api-token: ${{ secrets.TRACKER_BOOT_API_TOKEN }}
          project-id: "YOUR_PROJECT_ID"  # Replace with your Tracker Boot project ID
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

### Workflow Steps

1. **Story ID Extraction**: Extracts a 9-digit story ID from the commit message
2. **Status Detection**: Checks for finishing keywords in the commit message
3. **Story Starting**: Updates story status to "Started" if no finish keyword is found when story status is `Unstarted` yet.
4. **Story Finishing**: Updates story status to "Finished" if:
   - Finish keyword is present
   - CI job status is `success`
5. **Failure Notification**: Sends notification to Tracker Boot if:
   - CI job status is `failure`
   - This is the first run attempt

### Example Scenarios

#### Scenario 1: Start Working on a Story

```bash
# Commit with story ID
git commit -m "[#200011863] implement new feature"
git push
```

**Result**: Story #200011863 status → "Started"

#### Scenario 2: Complete a Story

```bash
# Commit with finish keyword
git commit -m "[Finished #200011863] implement new feature"
git push
```

**Result** (if CI passes): Story #200011863 status → "Finished"

#### Scenario 3: CI Failure

```bash
git commit -m "[#200011863] add tests"
git push
# CI fails
```

**Result**: Tracker Boot receives notification with workflow URL and commit URL

## Advanced Usage

### Using with Multiple Jobs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
  
  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - run: npm test
      
      - name: Update Tracker Boot
        uses: bekindlabs/tracker-boot-action@v1
        if: always()
        with:
          tracker-boot-api-token: ${{ secrets.TRACKER_BOOT_API_TOKEN }}
          project-id: "100000025"
          job-status: ${{ job.status }}
```

### Testing the Action Locally

You can test the action using the provided test script:

```bash
./action.test.sh
```

Or manually trigger the test workflow via GitHub UI:
**Actions** → **Test Custom Action** → **Run workflow**

## Troubleshooting

- **Check**: Ensure commit message contains a 9-digit story ID
- **Check**: Verify the story ID exists in your Tracker Boot project
- **Check**: Confirm the API token has proper permissions

## License

See [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or feature requests, please open an issue in the GitHub repository.
