#!/bin/sh

# Curl example of getting token information.
# Typically you will be setup to not have to use the --insecure flag  
# See https://developers.google.com/accounts/docs/OAuth2UserAgent#validatetoken

# Start the server with 'npm start' before running this command

# Run this with a valid token such from one of the other scripts such as:
# token_info.sh (some long token)
# You should get back something of the form:
# { 
#   "audience": "abc123",
#   "expires_in": 3560
# }

if [ -z "${1}" ]; then
  echo "You need to set the access token.  Use one of the other scripts to get one."
  exit 1
fi

curl --insecure "https://localhost:3000/api/tokeninfo?access_token=${1}"

