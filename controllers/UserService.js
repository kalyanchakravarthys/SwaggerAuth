'use strict';
var request = require('request');
var bcrypt = require('bcrypt-nodejs');

exports.testGET = function(args, res, next, req){
  res.send({ result: 'success'});
}

exports.userLoginPOST = function(args, res, next, req){
  var userDetails = args.userDetails.value;
  var result = {};
  if(args.loginId.value === 'kalyan' && userDetails.password === 'password'){
    var hash = bcrypt.hashSync(args.loginId.value);
    console.log('hash', hash);
    req.session.auth_key = hash;
    result.hash = hash;
    req.session.currentUser = result;
    res.setHeader('Authorization', hash);
  }
  else{
    result.message = "userid or password is incorrect."
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(result);
}
