#!/bin/sh

# Curl example of revoking a token.
# Typically you will be setup to not have to use the --insecure flag  
# See https://developers.google.com/identity/protocols/OAuth2WebServer

# Start the server with 'npm start' before running this command

# Run this with a valid token such from one of the other scripts such as:
# token_info.sh (some long token)
# You should get back an empty JSON object of the form:
# { }

if [ -z "${1}" ]; then
  echo "You need to set the access token.  Use one of the other scripts to get one."
  exit 1
fi

curl --insecure "https://localhost:3000/api/revoke?token=${1}"
