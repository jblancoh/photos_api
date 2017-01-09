var helpers = require('../config/helperFunctions')
var PhotoModel = require('../models/photoModel')
var Autor = require('../models/userModel')
var Comment = require('../models/commentModel')

module.exports = function(server) {

  server.get('/photos', (req, res, next) => {
    PhotoModel.find({}, function(err, photos){
      Autor.populate(photos, {path: "user"}, function(err, photos){
        Comment.populate(photos, { path: "comment"}, function(err,photos){
          helpers.success(res, next, photos)
          return next()
        })
      })
    })
  })
  server.get('/photo/:id', (req, res, next) =>{
    req.assert('id', 'Id es necesario').notEmpty()
    var errors = req.validationErrors()
    if(errors){
      helpers.failure(res, next, errors[0], 400)
      return next()
    }
    PhotoModel.findOne({_id: req.params.id}, function(err, photo){
      Comment.populate(photo, { path: "comment"}, function(err,photo){
        if (photo === null){
          helpers.failure(res, next, 'La foto especificada no puede ser encontrada', 404)
          return next()
        }
        helpers.success(res, next, photo)
        return next()
      })
    })
  })
  server.post('/photo', (req, res, next) => {
    var photo = new PhotoModel()
    var error

    photo.title = req.params.title
    photo.url = req.params.url
    photo.likes = req.params.likes
    photo.user = req.params.user
    photo.tag_user = req.params.tag_user
    photo.comment = req.params.comment

    photo.save(function(err){
      if (err) {
        helpers.failure(res, next, 'Error al guardar la foto', 500)
      }
        helpers.success(res, next, photo)
        return next()
    })
  })
  server.put('/photo/:id', (req, res, next) => {
    req.assert('id', 'Id es necesario').notEmpty()
    var errors = req.validationErrors()
    if(errors){
      helpers.failure(res, next, errors[0], 400)
      return next()
    }
    PhotoModel.findOne({ _id: req.params.id}, function (err, photo) {
      if(err){
        helpers.failure(res, next, 'Se produjo un error al recoger la foto de la base de datos', 500)
        return next()
      }
      if (photo === null || photo === 'undefined'){
        helpers.failure(res, next, 'La foto especificada no puede ser encontrada', 404)
        return next()
      }
      var updates = req.params

      delete updates.id
      for(var field in updates){
        photo[field] = updates[field]
      }

      photo.save(function(err){
        if(err){
          helpers.failure(res, next, errors, 500)
          return next()
        }

      helpers.success(res, next, photo)
      return next()
    })
  })
})
server.del('/photo/:id', (req, res, next) => {
  //Mensaje de error
  req.assert('id', 'Id es necesario').notEmpty()
  var errors = req.validationErrors()
  if(errors){
    helpers.failure(res, next, errors[0], 400)
    return next()
  }
  //
  PhotoModel.findOne({ _id: req.params.id}, function (err, photo) {
    if(err){
      helpers.failure(res, next, 'Se produjo un error al recoger la foto de la base de datos', 500)
      return next()
    }
    if (photo === null || photo === 'undefined'){
      helpers.failure(res, next, 'La foto especificada no puede ser encontrada', 404)
      return next()
    }
    photo.remove(function(err){
      if(err){
        helpers.failure(res, next, 'Error eliminando la foto de la base de batos', 500)
        return next()
      }
    helpers.success(res, next, photo)
    return next()
    })
  })
})
}
