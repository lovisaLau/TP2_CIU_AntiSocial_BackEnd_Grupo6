// BONUS de subida de imagenes al servidor (usando Multer)
const fs = require("fs");
const { Post, Post_Images } = require("../models");

// Se ejecuta ANTES de Multer: si el post no existe, responde 404
// y así no se guarda en el servidor una imagen que no va a usar nadie.
exports.verificarPost = async (req, res, next) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
        return res.status(404).json({ status: "error", message: "Publicación no encontrada" });
        }
        next();
    } catch (error) {
        next(error);
    }
};

// Se ejecuta DESPUÉS de Multer: el archivo ya está guardado en la carpeta uploads
// y sus datos están en req.file. Se guarda en Post_Images la URL pública de la imagen.
exports.subirImagen = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: 'Hay que enviar una imagen en el campo "imagen" (multipart/form-data)',
            });
        }

        const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        const imagen = await Post_Images.create({ url, postId: Number(req.params.id) });

        res.status(201).json(imagen);
    } catch (error) {
        // si falló al guardar en la base, se borra el archivo para no dejar basura
        if (req.file) fs.unlink(req.file.path, () => {});
        next(error);
    }
};
