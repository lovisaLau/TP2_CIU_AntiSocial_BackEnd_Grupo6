const { Router } = require("express");
const router = Router();
const userController = require("../controllers/usersControllers");
const validarId = require("../middlewares/validarId");
const validarSchema = require("../middlewares/validarSchema");
const buscarUsuarioPorId = require("../middlewares/buscarUsuarioPorId");
const { userSchema, crearUsuarioSchema, loginSchema } = require("../schemas/userSchemas");

router.get("/", userController.obtenerUsuarios);
router.get(
  "/:id",
  validarId,
  buscarUsuarioPorId,
  userController.obtenerUsuario,
);
router.post("/", validarSchema(crearUsuarioSchema), userController.crearUsuario);
router.post("/login", validarSchema(loginSchema), userController.iniciarSesion);
router.put(
  "/:id",
  validarId,
  validarSchema(userSchema),
  buscarUsuarioPorId,
  userController.actualizarUsuario,
);
router.delete(
  "/:id",
  validarId,
  buscarUsuarioPorId,
  userController.eliminarUsuario,
);

// BONUS seguidores
router.get(
  "/:id/followers",
  validarId,
  buscarUsuarioPorId,
  userController.obtenerSeguidores,
);
router.get(
  "/:id/following",
  validarId,
  buscarUsuarioPorId,
  userController.obtenerSeguidos,
);
router.post(
  "/:id/following/:seguidoId",
  validarId,
  buscarUsuarioPorId,
  userController.seguirUsuario,
);
router.delete(
  "/:id/following/:seguidoId",
  validarId,
  buscarUsuarioPorId,
  userController.dejarDeSeguir,
);

module.exports = router;
