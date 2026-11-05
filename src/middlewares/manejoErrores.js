// si no existe la ruta
const rutaNoEncontrada = (req, res) => {
  res.status(404).json({ message: `No existe la ruta ${req.method} ${req.originalUrl}` });
};

const manejarErrores = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "El body no es un JSON válido" });
  }

  if (err.code === "TIPO_DE_ARCHIVO_INVALIDO") {
    return res.status(400).json({message: err.message});
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    const maxMB = Number(process.env.UPLOAD_MAX_MB) || 5;
    return res.status(413).json({message: `La imagen supera el tamaño máximo permitido (${maxMB} MB)`});
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({message: `La imagen tiene que enviarse en el campo "imagen"`});
  }

  if (err.name === "MulterError") {
    return res.status(400).json({message: `Error al subir el archivo: ${err.message}`});
  }

  // por ej nickName repetido
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "Ya existe un registro con esos datos" });
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(404).json({ message: "Uno de los registros relacionados no existe" });
  }

  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
};

module.exports = { rutaNoEncontrada, manejarErrores };
