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

// BONUS contraseña propia
const passwordSchema = Joi.string().min(6).max(50).required().messages({
  "string.base": "La contraseña debe ser un texto",
  "string.empty": "La contraseña no puede estar vacía",
  "string.min": "La contraseña debe tener al menos 6 caracteres",
  "string.max": "La contraseña no puede superar los 50 caracteres",
  "any.required": "La contraseña es obligatoria",
});

// Para crear un usuario: nickName + contraseña
const crearUsuarioSchema = userSchema.keys({
  password: passwordSchema,
});

// Para iniciar sesión
const loginSchema = Joi.object({
  nickName: Joi.string().trim().required().messages({
    "string.empty": "El nickName no puede estar vacío",
    "any.required": "El nickName es obligatorio",
  }),
  password: Joi.string().required().messages({
    "string.empty": "La contraseña no puede estar vacía",
    "any.required": "La contraseña es obligatoria",
  }),
}).messages({
  "object.unknown": "El campo {#label} no está permitido",
});

module.exports = {
  userSchema,
  crearUsuarioSchema,
  loginSchema,
};

