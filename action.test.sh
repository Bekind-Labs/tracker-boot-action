#!/bin/bash

if [ -f .env ]; then
    export $(grep -v '^#' .env | grep -v '^\s*$' | xargs)
else
    echo "[ERROR] .env file is not existed."
    exit 1
fi

# add testing cases here
test_commit_messages=(
    "[finished 200011846] some test"
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
             -j test-all-cases \
             -s TRACKER_BOOT_API_TOKEN=$TRACKER_BOOT_API_TOKEN
done

rm $TEMP_EVENT_FILE
echo ""
echo "Testing completed."