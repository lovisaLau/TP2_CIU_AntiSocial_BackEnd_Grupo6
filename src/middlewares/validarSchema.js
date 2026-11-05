// se usa asi: router.post("/", validarSchema(userSchema), controller.crear)
const validarSchema = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Datos inválidos",
      errores: error.details.map((detalle) => detalle.message),
    });
  }
  req.body = value;
  next();
};

module.exports = validarSchema;
