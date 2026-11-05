const Joi = require('joi');

const createPostSchema = Joi.object({
  description: Joi.string().trim().min(1).required().messages({
    'string.empty': 'La descripción no puede estar vacía',
    'any.required': 'La descripción es obligatoria'
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': 'El userId debe ser un número',
    'number.integer': "El userId debe ser un número entero",
    'number.positive': "El userId debe ser un entero positivo",
    'any.required': 'El userId es obligatorio'
  }),
  images: Joi.array().items(Joi.string().uri()).optional(),
  tags: Joi.array().items(Joi.number().integer().positive()).optional()
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

const addImageSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    'string.uri': 'La URL debe ser un enlace válido',
    'any.required': 'La URL de la imagen es obligatoria'
  })
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

// Para modificar un post solo se puede cambiar la descripción
// (el autor no cambia; imágenes y etiquetas tienen sus propios endpoints)
const updatePostSchema = Joi.object({
  description: Joi.string().trim().min(1).required().messages({
    'string.empty': 'La descripción no puede estar vacía',
    'any.required': 'La descripción es obligatoria'
  })
}).messages({
  'object.unknown': 'El campo {#label} no está permitido'
});

module.exports = { createPostSchema, addImageSchema, updatePostSchema };
