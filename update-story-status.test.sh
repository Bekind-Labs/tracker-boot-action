#!/bin/bash

if [ -f .env ]; then
    export $(grep -v '^#' .env | grep -v '^\s*$' | xargs)
else
    echo "[ERROR] .env file is not existed."
    exit 1
fi

STORY_ID="200012030"

# add testing cases here
test_commit_messages=(
#    "[#$STORY_ID] unstarted feature story to started"
#    "[$STORY_ID] unstarted feature story to started"
#    "[fix #$STORY_ID] started feature story not to change"
#    "[fixed #$STORY_ID] started feature story not to changed"
    "[finished #$STORY_ID] unstarted feature story to finished"
#    "[finish #$STORY_ID] started feature story to finished"
#    "[finishes #$STORY_ID] started feature story to finished"
#    "[finishing #$STORY_ID] started feature story to finished"

#    "[#$STORY_ID] unstarted design story to started"
#    "[$STORY_ID] unstarted design story to started"
#    "[fix #$STORY_ID] started design story not to change"
#    "[fixed #$STORY_ID] started design story not to changed"
#    "[finished #$STORY_ID] unstarted design story not to changed"
#    "[finish #$STORY_ID] started design story to finished"
#    "[finishes #$STORY_ID] started design story to finished"
#    "[finishing #$STORY_ID] started design story to finished"

#    "[#$STORY_ID] unstarted bug story to started"
#    "[finishing #$STORY_ID] started bug story to finished"
#    "[finishing #$STORY_ID] started bug story to finished"
#    "[finished #$STORY_ID] started bug story to finished"
#    "[fix #$STORY_ID] started bug story to finished"
#    "[fixed #$STORY_ID] started bug story to finished"
#    "[fixing #$STORY_ID] started bug story to finished"
#    "[fixes #$STORY_ID] started bug story to finished"

#    "[$STORY_ID] release story not to changed"
#    "[#$STORY_ID] release story not to changed"
#    "[finish #$STORY_ID] release story not to changed"
#    "[finishing #$STORY_ID] release story not to changed"
#    "[finishes #$STORY_ID] release story not to changed"
#    "[finishes #$STORY_ID] release story not to changed"
#    "[finished #$STORY_ID] release story not to changed"
#    "[fix #$STORY_ID] release story not to changed"
#    "[fixes #$STORY_ID] release story not to changed"
#    "[fixing #$STORY_ID] release story not to changed"
#    "[fixed #$STORY_ID] release story not to changed"

#    "[#$STORY_ID] unstarted chore story to started"
#    "[fix #$STORY_ID] started chore not to change"
#    "[fixing #$STORY_ID] started chore not to change"
#    "[fixes #$STORY_ID] started chore not to change"
#    "[fixed #$STORY_ID] started chore not to change"
#    "[FINISH #$STORY_ID] started chore to accepted"
#    "[FINISHES #$STORY_ID] started chore to accepted"
#    "[Finished #$STORY_ID] started chore to accepted"
#    "[Finishing #$STORY_ID] started chore to accepted"
)

TEMP_EVENT_FILE="temp-event.json"

echo "=========================================================="
echo "Testing GitHub Action with various commit messages"
echo "=========================================================="

for msg in "${test_commit_messages[@]}"; do
    echo ""
    echo "--- (Case) message: '$msg' ---"
    printf '{"head_commit": {"message": "%s"}}' "$msg" > $TEMP_EVENT_FILE
    act push -e $TEMP_EVENT_FILE \
             -j update-story-status \
             -s TRACKER_BOOT_API_TOKEN=$TRACKER_BOOT_API_TOKEN
done

rm $TEMP_EVENT_FILE
echo ""
echo "Testing completed."