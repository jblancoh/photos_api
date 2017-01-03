var helpers = require('../config/helperFunctions')
var CommentModel = require('../models/commentModel')
var Autor = require('../models/userModel')

module.exports = function(server) {

  server.get('/comments', (req, res, next) => {
    CommentModel.find({}, function(err, comments){
      Autor.populate(comments, {path: "author"}, function(err, comments){
        helpers.success(res, next, comments)
        return next()
      })
    })
  })
  server.get('/comment/:id', (req, res, next) =>{
    req.assert('id', 'Id es necesario y debe ser numerico').notEmpty()
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

    comment.save(function(err){
      if (err) {
        helpers.failure(res, next, 'Error al guardar el comentario', 500)
      }
        helpers.success(res, next, comment)
        return next()
    })
  })
}
