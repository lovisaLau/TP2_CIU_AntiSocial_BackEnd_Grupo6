// Documentación de la API con Swagger UI.
// La especificación OpenAPI está escrita en YAML en docs/swagger.yaml
//   GET /docs              -> interfaz de Swagger UI
//   GET /docs/swagger.yaml -> el archivo YAML tal cual
const path = require("path");
const fs = require("fs");
const { Router } = require("express");
const swaggerUi = require("swagger-ui-express");
const yaml = require("js-yaml");

const router = Router();

const rutaYaml = path.join(__dirname, "../../docs/swagger.yaml");
const especificacion = yaml.load(fs.readFileSync(rutaYaml, "utf8"));

// el YAML crudo, por si se quiere importar en Postman / Insomnia / editor.swagger.io
router.get("/swagger.yaml", (req, res) => {
  res.type("text/yaml").sendFile(rutaYaml);
});

router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(especificacion, {
    customSiteTitle: "Anti-Social Net API - Docs",
  }),
);

module.exports = router;
