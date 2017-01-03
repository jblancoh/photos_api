var helpers = require('../config/helperFunctions')
var UserModel = require('../models/userModel')
var CommentModel = require('../models/commentModel')

module.exports = function(server) {

  server.get('/users', (req, res, next) => {
    UserModel.find({}, function(err, users){
      helpers.success(res, next, users)
      return next()
    })
  })


  server.get('/user/:id', (req, res, next) => {
    UserModel.findOne({ _id: req.params.id}, function (err, user) {
        if (user === null){
          helpers.failure(res, next, 'El usuario especificado no puede ser encontado', 404)
          return next()
        }
        helpers.success(res, next, user)
        return next()
    })
  })

  server.post('/user', (req, res, next) => {
    var user = new UserModel()

    var error
    user.name = req.params.name
    user.last_name = req.params.last_name
    user.email = req.params.email
    user.password = req.params.password

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

})

  server.del('/user/:id', (req, res, next) => {

  })
}
