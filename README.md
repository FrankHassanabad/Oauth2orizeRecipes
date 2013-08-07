OAuth2orizeRecipes
==================

OAuth2 security recipes and examples based on [OAuth2orize](https://github.com/jaredhanson/oauth2orize).

The express2 example from [OAuth2orize](https://github.com/jaredhanson/oauth2orize) is a great and simple
minimal OAuth2 Server in Node.js.  It is an example you can use to get an idea of how to write your
own OAuth2 Server in Node.js.  The recipes here, in contrast, are more complete but are more complex OAuth2 solutions
in Node.js.  If you were wanting more after looking at the express2 example from [OAuth2orize](https://github.com/jaredhanson/oauth2orize)
then this is the project you want to look at next.

# Installation
```
git clone https://github.com/FrankHassanabad/Oauth2orizeRecipes.git
cd Oauth2orizeRecipes/resource-server
npm install
node app.js
```
Then go here for more on how to use the REST endpoints
https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests

# Features Of The Authorization Server
* All 4 grant types exposed out of the box
* Access Tokens (includes configurable expiration time)
* Refresh Tokens
* REST tokeninfo endPoint for verifying a token is valid.

