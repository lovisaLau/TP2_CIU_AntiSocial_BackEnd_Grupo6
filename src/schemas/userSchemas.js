const Joi = require("joi");

const userSchema = Joi.object({
  nickName: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9._-]+$/)
    .required()
    .messages({
      "string.base": "El nickName debe ser un texto",
      "string.empty": "El nickName no puede estar vacío",
      "string.min": "El nickName debe tener al menos 3 caracteres",
      "string.max": "El nickName no puede superar los 30 caracteres",
      "string.pattern.base":
        "El nickName solo puede tener letras, números, puntos, guiones y guiones bajos",
      "any.required": "El nickName es obligatorio",
    }),
}).messages({
  "object.unknown": "El campo {#label} no está permitido",
});

module.exports = {
  userSchema,
};
