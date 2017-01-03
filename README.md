OAuth2orizeRecipes
==================

[![Build Status](https://travis-ci.org/FrankHassanabad/Oauth2orizeRecipes.svg?branch=master)](https://travis-ci.org/FrankHassanabad/Oauth2orizeRecipes)

OAuth2 security recipes and examples based on [OAuth2orize](https://github.com/jaredhanson/oauth2orize).

The express2 example from [OAuth2orize](https://github.com/jaredhanson/oauth2orize) is a great and simple
minimal OAuth2 Server in Node.js.  It is an example you can use to get an idea of how to write your
own OAuth2 Server in Node.js.  The recipes here are built from it and are more complete but also a bit more complex.

<p align="center">
  <img src="readme-media/images/login-in-screen.png?raw=true" alt="Sign In"/>
</p>

You can see a demo of it in action [here](https://oauth2orizerecipes.herokuapp.com/)

# Installation
```
git clone https://github.com/FrankHassanabad/Oauth2orizeRecipes.git
cd Oauth2orizeRecipes/authorization-server
npm install
npm start
```
Go here for how to use the REST API  
https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests

Go here for high level views of security scenarios  
https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/Security-Scenarios

See the curl folder for headless operations and ad-hoc testing  
[authorization-server/curl/README.md](authorization-server/curl/README.md)

# Features of the Authorization Server
* All 4 grant types exposed out of the box
* Access/Refresh Tokens
* All Tokens are [JWT based tokens](https://jwt.io/)
* Configurable expiration times on tokens
* Single Sign On (SSO) Example
* Example of trusted clients
* REST tokeninfo endPoint for verifying a token is valid.
* REST revoke endPoint for revoking either an access token or a refresh token.
* Authorization tokens are only useable once and are short expiring JWT tokens
* Full tokens are NOT stored in the DB since they are JWT signed tokens.  Only ID's of tokens are stored.
* SSL/HTTPS usage
* Unit and Integration tests of the majority of code and OAuth2 flows
* More complex UI Examples for the Sign In/Login and the Decision Screens
