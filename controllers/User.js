'use strict';

var url = require('url');
var session = require('express-session');

var svcUser = require('./UserService');

module.exports.testGET = function (req, res, next) {
  svcUser.testGET(req.swagger.params, res, next, req);
};

module.exports.userLoginPOST = function (req, res, next) {
  svcUser.userLoginPOST(req.swagger.params, res, next, req);
};

module.exports.userLogoutPOST = function(req, res, next){
	req.session.auth_key = undefined;
	req.session.currentUser = undefined;
	res.send({ 'message': 'Logged out successfully.' });
};