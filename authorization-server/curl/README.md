# Curl Examples

Examples of using this in headless modes and environments.  Also useful for ad-hoc testing.  Ensure
you're running through

```sh
npm start
```

Then you can run any example such as getting a user's token directly through 

```sh
./resource_owner_grant.sh
{
  "access_token": "(some long token)",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

You can validate that token through the token info:

```sh
./token_info.sh (some long token)
{ 
  "audience": "abc123",
  "expires_in": 3560
}
```

As well as revoke the token through the token revoke endpoint:
```sh
./token_revoke.sh (some long token)
{ }
```

And then if trying token the info again you will get invalid token error:
```sh
./token_info.sh (some revoked or expired long token)
{
  "error": "invalid_token"
}
```

