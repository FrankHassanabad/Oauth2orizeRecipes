#!/bin/sh

# Curl example of getting the implicit grant.
# Typically you will be setup to not have to use the --insecure flag  
# See Implicit Grant at: https://tools.ietf.org/html/rfc6749#section-4.2

# Start the server with 'npm start' before running this command

# At the end of the output you should get back something of the form:
# access_token=(some long string)&expires_in=3600&token_type=Bearer

server=https://localhost:3000
username=bob
password=secret
clientid=trustedClient

redirecturi=`curl --silent --output /dev/null --cookie non-existing \
  --insecure "${server}/login/" --data "username=${username}&password=${password}" \
  --next --output /dev/null --write-out "%{redirect_url}" \
  --insecure "${server}/dialog/authorize?redirect_uri=${server}&response_type=token&client_id=${clientid}&scope=offline_access"`

code=${redirecturi:24}

echo "Redirect URI found is:"
echo "${redirecturi}"
echo
echo "Access token found is:"
echo "${code}"
