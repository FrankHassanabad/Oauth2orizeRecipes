OAuth2orizeRecipes
==================

OAuth2 security recipes and examples based on [OAuth2orize](https://github.com/jaredhanson/oauth2orize).

The express2 example from [OAuth2orize](https://github.com/jaredhanson/oauth2orize) is a great and simple
minimal OAuth2 Server in Node.js.  It is an example you can use to get an idea of how to write your
own OAuth2 Server in Node.js.  The recipes here are built from it and are more complete but also a bit more complex.

<p align="center">
  <img src="readme-media/images/login-in-screen.png?raw=true" alt="Sign In"/>
</p>

# Demo

Go [here](https://oauth2orizerecipes.herokuapp.com/) for a demo
<p align="center">
  <img src="readme-media/images/web-site.png?raw=true" alt="Sign In"/>
</p>


# Installation
```
git clone https://github.com/FrankHassanabad/Oauth2orizeRecipes.git
cd Oauth2orizeRecipes/resource-server
npm install
node app.js
```
Go here for how to use the REST API  
https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests

Go here for high level views of security scenarios  
https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/Security-Scenarios

# Features of the Authorization Server
* All 4 grant types exposed out of the box
* Access/Refresh Tokens
* Configurable expriation times on tokens
* Single Sign On (SSO) Example
* Example of trusted clients
* In-Memory or persistent tokens through MongoDB
* In-Memory or persistent web sessions through connect-mongo
* REST tokeninfo endPoint for verifying a token is valid.
* Authorization tokens are only useable once
* SSL/HTTPS usage
* More complex UI Examples for the Sign In/Login and the Decision Screens 
