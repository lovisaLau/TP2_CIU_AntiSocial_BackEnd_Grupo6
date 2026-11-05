const { User } = require("../models");

const buscarUsuarioPorId = async (req, res, next) => {
  try {
    const usuario = await User.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    req.usuario = usuario;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

module.exports = buscarUsuarioPorId;
