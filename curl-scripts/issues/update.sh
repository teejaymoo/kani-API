#!/bin/bash

curl "http://localhost:4741/issues/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "issue": {
      "title": "'"${TITLE}"'",
      "body": "'"${BODY}"'",
      "completed": "'"${COMPLETED}"'"
    }
  }'

echo
