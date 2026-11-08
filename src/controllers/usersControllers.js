const bcrypt = require("bcryptjs");
const { User, Post } = require("../models");

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: ["id", "nickName", "createdAt"],
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.usuario.id, {
      attributes: ["id", "nickName", "createdAt"],
      include: {
        model: Post,
        as: "posts",
        attributes: ["id", "description", "createdAt"],
      },
    });
    res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nickName, password } = req.body;

    const existente = await User.findOne({ where: { nickName } });
    if (existente) {
      return res.status(409).json({ message: "El nickName ya está en uso" });
    }

    // BONUS: la contraseña se guarda encriptada, nunca como texto plano
    const hash = await bcrypt.hash(password, 10);
    const usuario = await User.create({ nickName, password: hash });

    res.status(201).json({
      message: "Usuario creado con exito",
      usuario: {
        id: usuario.id,
        nickName: usuario.nickName,
        createdAt: usuario.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};

// BONUS contraseña propia
const iniciarSesion = async (req, res) => {
  try {
    const { nickName, password } = req.body;

    const usuario = await User.scope("conPassword").findOne({ where: { nickName } });

    const passwordOk = usuario && usuario.password
      ? await bcrypt.compare(password, usuario.password)
      : false;

    if (!passwordOk) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    res.status(200).json({
      message: "Sesión iniciada con éxito",
      usuario: {
        id: usuario.id,
        nickName: usuario.nickName,
        createdAt: usuario.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};


const actualizarUsuario = async (req, res) => {
  try {
    const { nickName } = req.body;
    const usuario = req.usuario;

    if (nickName !== usuario.nickName) {
      const existente = await User.findOne({ where: { nickName } });
      if (existente) {
        return res.status(409).json({ message: "El nickName ya está en uso" });
      }
    }

    await usuario.update({ nickName });

    res.status(200).json({
      message: "Usuario actualizado con exito",
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

// borra tambien sus posts y comentarios (cascade)
const eliminarUsuario = async (req, res) => {
  try {
    await req.usuario.destroy();
    res.status(200).json({ message: "Usuario eliminado con exito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

// BONUS seguidores

const obtenerSeguidores = async (req, res) => {
  try {
    const seguidores = await req.usuario.getFollowers({
      attributes: ["id", "nickName"],
      joinTableAttributes: [],
    });
    res.status(200).json(seguidores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los seguidores" });
  }
};

const obtenerSeguidos = async (req, res) => {
  try {
    const seguidos = await req.usuario.getFollowing({
      attributes: ["id", "nickName"],
      joinTableAttributes: [],
    });
    res.status(200).json(seguidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los seguidos" });
  }
};

const seguirUsuario = async (req, res) => {
  try {
    const usuario = req.usuario;
    const { seguidoId } = req.params;

    if (Number(seguidoId) === usuario.id) {
      return res
        .status(400)
        .json({ message: "Un usuario no puede seguirse a sí mismo" });
    }

    const seguido = await User.findByPk(seguidoId);
    if (!seguido) {
      return res
        .status(404)
        .json({ message: "El usuario a seguir no existe" });
    }

    const yaLoSigue = await usuario.hasFollowing(seguido);
    if (yaLoSigue) {
      return res
        .status(409)
        .json({ message: "El usuario ya sigue a ese usuario" });
    }

    await usuario.addFollowing(seguido);

    res.status(201).json({
      message: `${usuario.nickName} ahora sigue a ${seguido.nickName}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al seguir al usuario" });
  }
};

const dejarDeSeguir = async (req, res) => {
  try {
    const usuario = req.usuario;
    const { seguidoId } = req.params;

    const seguido = await User.findByPk(seguidoId);
    if (!seguido) {
      return res
        .status(404)
        .json({ message: "El usuario a dejar de seguir no existe" });
    }

    const loSigue = await usuario.hasFollowing(seguido);
    if (!loSigue) {
      return res
        .status(404)
        .json({ message: "El usuario no sigue a ese usuario" });
    }

    await usuario.removeFollowing(seguido);

    res.status(200).json({
      message: `${usuario.nickName} dejó de seguir a ${seguido.nickName}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al dejar de seguir al usuario" });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  iniciarSesion,
  actualizarUsuario,
  eliminarUsuario,
  obtenerSeguidores,
  obtenerSeguidos,
  seguirUsuario,
  dejarDeSeguir,
};
