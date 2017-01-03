#!/bin/sh

# Curl example of getting the client credentials.
# Typically you will be setup to not have to use the --insecure flag  
# See Client Credentials Grant at: https://tools.ietf.org/html/rfc6749#section-4.4

# Start the server with 'npm start' before running this command

# You should get back something of the form:
# {
#   "access_token" : "(some long token)",
#   "expires_in" : 3600,
#   "token_type" : "Bearer"
# }

curl --insecure --user 'abc123:ssh-secret' 'https://localhost:3000/oauth/token' --data 'grant_type=client_credentials'
