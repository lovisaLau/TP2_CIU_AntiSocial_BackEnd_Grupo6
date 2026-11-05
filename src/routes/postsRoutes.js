const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const tagController = require('../controllers/tagController');
const validarId = require('../middlewares/validarId');
const validarSchema = require('../middlewares/validarSchema');
const upload = require('../middlewares/upload');
const uploadController = require('../controllers/uploadController');

// 1. Esquemas de posts
const { createPostSchema, addImageSchema, updatePostSchema } = require('../schemas/postSchema');

// 2. IMPORTANTE: Importar el esquema de tags que faltaba
const { addTagToPostSchema } = require('../schemas/tagSchema');

router.get('/', postController.getPosts);
router.get('/:id', validarId, postController.getPostById);
router.post('/', validarSchema(createPostSchema), postController.createPost);
router.put('/:id', validarId, validarSchema(updatePostSchema), postController.updatePost);
router.delete('/:id', validarId, postController.deletePost);

// Endpoints para imágenes
router.post('/:id/images', validarId, validarSchema(addImageSchema), postController.addImageToPost);
router.delete('/:id/images/:imageId', validarId, postController.removeImageFromPost);

// Endpoint para asociar tag
router.post('/:id/tags', validarId, validarSchema(addTagToPostSchema), tagController.addTagToPost);

router.delete('/:id/tags/:tagId',validarId,tagController.removeTagFromPost);
router.post('/:id/images/upload',validarId,uploadController.verificarPost,upload.single('imagen'),uploadController.subirImagen);

module.exports = router;