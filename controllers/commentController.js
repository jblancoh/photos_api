var helpers = require('../config/helperFunctions')
var CommentModel = require('../models/commentModel')
var Autor = require('../models/userModel')

module.exports = function(server) {

  server.get('/comments', (req, res, next) => {
    CommentModel.find({}, function(err, comments){
      Autor.populate(comments, {path: "author"}, function(err, comments){
        CommentModel.populate(comments,{ path: "photo"}, function(err,comments){
        helpers.success(res, next, comments)
        return next()
        })
      })
    })
  })
  server.get('/comment/:id', (req, res, next) =>{
    req.assert('id', 'Id es necesario').notEmpty()
    var errors = req.validationErrors()
    if(errors){
      helpers.failure(res, next, errors[0], 400)
      return next()
    }
    CommentModel.findOne({_id: req.params.id}, function(err, comment){
      if (comment === null){
        helpers.failure(res, next, 'El comentario especificado no puede ser encontado', 404)
        return next()
      }
      helpers.success(res, next, comment)
      return next()
    })
  })
  server.post('/comment', (req, res, next) => {
    var comment = new CommentModel()
    var error

    comment.comment = req.params.comment
    comment.author = req.params.author
    comment.photo = req.params.photo

    comment.save(function(err){
      if (err) {
        helpers.failure(res, next, 'Error al guardar el comentario', 500)
      }
        helpers.success(res, next, comment)
        return next()
    })
  })
  server.put('/comment/:id', (req, res, next) => {
    req.assert('id', 'Id es necesario').notEmpty()
    var errors = req.validationErrors()
    if(errors){
      helpers.failure(res, next, errors[0], 400)
      return next()
    }
      CommentModel.findOne({ _id: req.params.id}, function (err, comment) {
        if(err){
          helpers.failure(res, next, 'Se produjo un error al recoger el comentario de la base de datos', 500)
          return next()
        }
        if (comment === null || comment === 'undefined'){
          helpers.failure(res, next, 'El comentario especificado no puede ser encontrado', 404)
          return next()
        }
        var updates = req.params

        delete updates.id
        for(var field in updates){
          comment[field] = updates[field]
        }

        comment.save(function(err){
          if(err){
            helpers.failure(res, next, errors, 500)
            return next()
          }

        helpers.success(res, next, comment)
        return next()
      })
    })
  })
  server.del('/comment/:id', (req, res, next) => {
    //Mensaje de error
    req.assert('id', 'Id es necesario').notEmpty()
    var errors = req.validationErrors()
    if(errors){
      helpers.failure(res, next, errors[0], 400)
      return next()
    }
    //
    CommentModel.findOne({ _id: req.params.id}, function (err, comment) {
      if(err){
        helpers.failure(res, next, 'Se produjo un error al recoger el comentario de la base de datos', 500)
        return next()
      }
      if (comment === null || comment === 'undefined'){
        helpers.failure(res, next, 'El comentario especificado no puede ser encontrado', 404)
        return next()
      }
      comment.remove(function(err){
        if(err){
          helpers.failure(res, next, 'Error eliminando el comentario de la foto', 500)
          return next()
        }
      helpers.success(res, next, comment)
      return next()
      })
    })
  })
}
