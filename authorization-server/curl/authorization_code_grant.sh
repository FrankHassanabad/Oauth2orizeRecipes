#!/bin/sh

# Curl example of getting the authorization code grant.
# Typically you will be setup to not have to use the --insecure flag  
# See Authorization Code Grant at: https://tools.ietf.org/html/rfc6749#section-4.1

# Start the server with 'npm start' before running this command

# At the end of the output you should get back something of the form:
# {
#   "access_token" : "(some long token)",
#   "refresh_token" : "(some long token)"
#   "expires_in" : 3600,
#   "token_type" : "Bearer"
# }

server=https://localhost:3000
username=bob
password=secret
clientid=trustedClient
clientsecret=ssh-otherpassword

redirecturi=`curl --silent --output /dev/null --cookie non-existing \
  --insecure "${server}/login/" --data "username=${username}&password=${password}" \
  --next --output /dev/null --write-out "%{redirect_url}" \
  --insecure "${server}/dialog/authorize?redirect_uri=${server}&response_type=code&client_id=${clientid}&scope=offline_access"`

code=${redirecturi:29}

echo "Redirect URI found is:"
echo "${redirecturi}"
echo
echo "Code extracted from URI is:"
echo "${code}"
echo

echo "Access and refresh token found is:"
curl --insecure -X POST "${server}/oauth/token/" --data "code=${code}&redirect_uri=${server}&client_id=${clientid}&client_secret=${clientsecret}&grant_type=authorization_code"
