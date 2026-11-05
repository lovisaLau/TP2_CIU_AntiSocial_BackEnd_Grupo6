// BONUS de subida de imagenes al servidor (usando Multer)
// Las imágenes se guardan en la carpeta "uploads" (en la raíz del proyecto)
// y se publican en http://localhost:PORT/uploads/<nombre-del-archivo>
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const carpeta = path.join(__dirname, "../../uploads");
fs.mkdirSync(carpeta, { recursive: true }); // la crea si no existe

// tamaño máximo en MB, configurable con la variable de entorno UPLOAD_MAX_MB
const MAX_MB = Number(process.env.UPLOAD_MAX_MB) || 5;
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, carpeta),
    // nombre único: post-<id>-<fecha>-<número al azar>.<extensión original>
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const unico = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        cb(null, `post-${req.params.id}-${unico}${extension}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (TIPOS_PERMITIDOS.includes(file.mimetype)) {
        return cb(null, true);
    }
    const error = new Error("Solo se permiten imágenes (jpg, png, gif o webp)");
    error.code = "TIPO_DE_ARCHIVO_INVALIDO";
    cb(error);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_MB * 1024 * 1024 },
});

module.exports = upload;