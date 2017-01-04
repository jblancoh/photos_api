"use strict"

var restify = require('restify')
var server = restify.createServer()
var setupController = require('./controllers/setupController')
var userController = require('./controllers/userController')
var commentController = require('./controllers/commentController')
var photoController = require('./controllers/photoController')
var restifyValidator = require('restify-validator')
var mongoose = require('mongoose');
var config = require('./config/dbConnection')
//

setupController(server, restify, restifyValidator)
userController(server)
commentController(server)
photoController(server)

mongoose.connect(config.getMongoConnection(), function(err,res){
  if(err){
    console.log('ERROR: connecting to Database. ' + err);
  }
  server.listen(8080, function(){
    config.getMongoConnection();
    console.log('%s listening at %s', server.name, server.url);
    console.log(config.getMongoConnection());
  })

});
