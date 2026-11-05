require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const db = require("./models");
const routerUsers = require("./routes/usersRoutes");
const routerPosts = require("./routes/postsRoutes");
const routerComments = require("./routes/commentsRoutes");
const routerTags = require("./routes/tagsRoutes");
const routerDocs = require("./routes/docsRoutes");  // Swagger
const { rutaNoEncontrada, manejarErrores } = require("./middlewares/manejoErrores");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:4173"] }));
app.use(express.json());

// Carpeta publica para imagenes subidas (Bonus Multer)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/users", routerUsers);
app.use("/posts", routerPosts);
app.use("/comments", routerComments);
app.use("/tags", routerTags);
app.use("/docs", routerDocs);

// tienen que ir despues de las rutas
app.use(rutaNoEncontrada);
app.use(manejarErrores);

app.listen(PORT, async () => {
  try {
    await db.sequelize.sync();
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  } catch (error) {
    console.error("No se pudo conectar con la base de datos:", error);
  }
});
