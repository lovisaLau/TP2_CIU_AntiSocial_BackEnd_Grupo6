const Joi = require("joi");

const createTagSchema = Joi.object({
  name: Joi.string().trim().lowercase().min(1).required().messages({
    "string.empty": "El nombre del tag no puede estar vacío",
    "any.required": "El nombre del tag es obligatorio",
  }),
}).messages({
  "object.unknown": "El campo {#label} no está permitido",
});

const addTagToPostSchema = Joi.object({
  tagId: Joi.number().integer().positive().required().messages({
    "number.base": "El tagId debe ser un número entero",
    'number.integer': "El tagId debe ser un número entero",
    'number.positive': "El tagId debe ser un entero positivo",
    "any.required": "El tagId es obligatorio",
  }),
}).messages({
  "object.unknown": "El campo {#label} no está permitido",
});

module.exports = { createTagSchema, addTagToPostSchema };