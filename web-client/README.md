Web Client Server
==================

This is a web client example that uses the resource server and authorization server.  It uses a very basic
reverse proxy to house everything and show the basic concepts of what micro services would look with.

# Installation

First install and run the authorization serer
```
git clone https://github.com/FrankHassanabad/Oauth2orizeRecipes.git
cd Oauth2orizeRecipes/authorization-server
npm install
npm start
```

Then install and run the resource server
```
cd Oauth2orizeRecipes/resource-server
npm install
npm start
```

Finally, run this server
```
cd Oauth2orizeRecipes/web-client
npm install
npm start
```
