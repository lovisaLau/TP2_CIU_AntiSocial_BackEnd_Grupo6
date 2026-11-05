const Joi = require("joi");

const commentSchema = Joi.object({
  content: Joi.string().trim().min(1).required().messages({
    "string.empty": "El comentario no puede estar vacío",
    "any.required": "El contenido del comentario es obligatorio",
  }),
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "El userId debe ser un número entero",
    'number.integer': "El userId debe ser un número entero",
    'number.positive': "El userId debe ser un entero positivo",
    "any.required": "El userId es obligatorio",
  }),
  postId: Joi.number().integer().positive().required().messages({
    "number.base": "El postId debe ser un número entero",
    'number.integer': "El postId debe ser un número entero",
    'number.positive': "El postId debe ser un entero positivo",
    "any.required": "El postId es obligatorio",
  }),
}).messages({
  "object.unknown": "El campo {#label} no está permitido",
});

// Para modificar un comentario solo se puede cambiar el texto
// (el autor y el post al que pertenece no cambian)
const updateCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).required().messages({
    "string.empty": "El comentario no puede estar vacío",
    "any.required": "El contenido del comentario es obligatorio",
  }),
}).messages({
  "object.unknown": "El campo {#label} no está permitido",
});


module.exports = { commentSchema, updateCommentSchema };