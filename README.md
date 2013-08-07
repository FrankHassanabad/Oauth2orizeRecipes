OAuth2orizeRecipes
==================

OAuth2 security recipes and examples based on [OAuth2orize](https://github.com/jaredhanson/oauth2orize).

The express2 example from [OAuth2orize](https://github.com/jaredhanson/oauth2orize) is a great and simple
minimal OAuth2 Server in Node.js.  It is an example that you can use to get an idea of how to write your
own OAuth2 Server in Node.js.  The recipes here, in contrast, are more complete but are more complex OAuth2 solutions
in Node.js.  If you were wanting more after looking at the express2 example from [OAuth2orize](https://github.com/jaredhanson/oauth2orize)
then this is the project you want to look at next.

# Installation
```
git clone https://github.com/FrankHassanabad/Oauth2orizeRecipes.git
cd Oauth2orizeRecipes
npm install
node app.js
```
Then go here for more on how to use the REST endpoints
https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests

# Features Of The Authorization Server
* Access Tokens (includes configurable expiration)
* Refresh Tokens
* All 4 grant types exposed out of the box
* REST tokeninfo endPoint for verifying a token is valid.  This is similar to Google's tokeninfo endpoint and is useful
for token validations between the Resource Server and the Authorization Server

