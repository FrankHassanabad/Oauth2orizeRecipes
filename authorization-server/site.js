/*jslint node: true */
/*global exports */
'use strict';

//TODO Document all of this

var passport = require('passport');
var login = require('connect-ensure-login');

exports.index = function (req, res) {
  if (!req.query.code) {
    res.render('index');
  } else {
    res.render('index-with-code');
  }
};

exports.loginForm = function (req, res) {
  res.render('login');
};

exports.login = [
  passport.authenticate('local', {successReturnToOrRedirect: '/', failureRedirect: '/login'})
];

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/');
};

exports.account = [
  login.ensureLoggedIn(),
  function (req, res) {
    res.render('account', {user: req.user});
  }
];
