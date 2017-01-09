var helpers = require('../config/helperFunctions')
var UserModel = require('../models/userModel')
var CommentModel = require('../models/commentModel')
var Photo = require('../models/photoModel')

module.exports = function(server) {

  server.get('/users', (req, res, next) => {
    UserModel.find({}, function(err, users){
      Photo.populate(users, {path: "photo"}, function(err, users){
        helpers.success(res, next, users)
        return next()
      })
    })
  })


  server.get('/user/:id', (req, res, next) => {
    req.assert('id', 'Id es necesario').notEmpty()
    var errors = req.validationErrors()
    if(errors){
      helpers.failure(res, next, errors[0], 400)
      return next()
    }
    UserModel.findOne({ _id: req.params.id}, function (err, user) {
      Photo.populate(user, {path: "photo"}, function(err, user){
        if (user === null){
          helpers.failure(res, next, 'El usuario especificado no puede ser encontado', 404)
          return next()
        }
        helpers.success(res, next, user)
        return next()
      })
    })
  })

  server.post('/user', (req, res, next) => {
    var user = new UserModel()

    var error
    user.name = req.params.name
    user.last_name = req.params.last_name
    user.email = req.params.email
    user.password = req.params.password
    user.photo = req.params.photo

    user.save(function(err){
      if(err){
        helpers.failure(res, next, 'Error al guardar el usuario', 500)
        return next()
      }
      helpers.success(res, next, user)
      return next()
    })
  })

  server.put('/user/:id', (req, res, next) => {
    //Mensaje de error
    req.assert('id', 'Id es necesario').notEmpty()
    var errors = req.validationErrors()
    if(errors){
      helpers.failure(res, next, errors[0], 400)
      return next()
    }
    //
      UserModel.findOne({ _id: req.params.id}, function (err, user) {
      if(err){
        helpers.failure(res, next, 'Se produjo un error al recoger al usuario de la base de datos', 500)
        return next()
      }
      if (user === null || user === 'undefined'){
        helpers.failure(res, next, 'El usuario especificado no puede ser encontado', 404)
        return next()
      }
      var updates = req.params

      delete updates.id
      for(var field in updates){
        user[field] = updates[field]
      }

      user.save(function(err){
        if(err){
          helpers.failure(res, next, errors, 500)
          return next()
        }

      helpers.success(res, next, user)
      return next()
      })
    })
  })

  server.del('/user/:id', (req, res, next) => {
    //Mensaje de error
    req.assert('id', 'Id es necesario').notEmpty()
    var errors = req.validationErrors()
    if(errors){
      helpers.failure(res, next, errors[0], 400)
      return next()
    }
    //
    UserModel.findOne({ _id: req.params.id}, function (err, user) {
      if(err){
        helpers.failure(res, next, 'Se produjo un error al recoger al usuario de la base de datos', 500)
        return next()
      }
      if (user === null || user === 'undefined'){
        helpers.failure(res, next, 'El usuario especificado no puede ser encontado', 404)
        return next()
      }
      user.remove(function(err){
        if(err){
          helpers.failure(res, next, 'Error eliminando usuario de la base de batos', 500)
          return next()
        }
      helpers.success(res, next, user)
      return next()
      })
    })
  })
}
