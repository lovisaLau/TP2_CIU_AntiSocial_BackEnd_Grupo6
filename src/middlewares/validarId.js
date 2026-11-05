// revisa todos los params que sean id (id, tagId, etc)
const validarId = (req, res, next) => {
  for (const [nombre, valor] of Object.entries(req.params)) {
    if (nombre !== "id" && !nombre.endsWith("Id")) continue;

    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero <= 0) {
      return res
        .status(400)
        .json({ message: `El parámetro ${nombre} debe ser un entero positivo.` });
    }
  }
  next();
};

module.exports = validarId;
