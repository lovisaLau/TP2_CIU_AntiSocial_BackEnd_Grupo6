const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const validarId = require('../middlewares/validarId');
const validarSchema = require('../middlewares/validarSchema');
const { commentSchema, updateCommentSchema } = require('../schemas/commentSchema');
 
router.get('/', commentController.getComments);
router.get('/:id', validarId, commentController.getCommentById);
router.post('/', validarSchema(commentSchema), commentController.createComment);
router.put('/:id', validarId, validarSchema(updateCommentSchema), commentController.updateComment);
router.delete('/:id', validarId, commentController.deleteComment);
 
module.exports = router;
