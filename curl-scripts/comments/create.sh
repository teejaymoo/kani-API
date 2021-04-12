
curl "http://localhost:4741/issues/${ID}" \
  --include \
  --request POST \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "comment": {
      "response": "'"${RESPONSE}"'"
    }
  }'

echo
