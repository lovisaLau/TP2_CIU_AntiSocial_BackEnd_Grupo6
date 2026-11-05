const { Comment, Post, User } = require("../models");

exports.createComment = async (req, res, next) => {
  try {
    const { content, userId, postId } = req.body;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "No se puede comentar: la publicación no existe",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "El usuario especificado no existe",
      });
    }

    const comment = await Comment.create({ content, userId, postId });
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      include: [{ model: User, as: "user", attributes: ["id", "nickName"] }],
      order: [["id", "ASC"]],
    });
    res.json(comments);
  } catch (error) {
    next(error);
  }
};
 
// Un comentario con su autor y el post al que pertenece
exports.getCommentById = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { model: User, as: "user", attributes: ["id", "nickName"] },
        { model: Post, as: "post", attributes: ["id", "description"] },
      ],
    });
 
    if (!comment) {
      return res.status(404).json({ status: "error", message: "Comentario no encontrado" });
    }
 
    res.json(comment);
  } catch (error) {
    next(error);
  }
};
// Modifica el texto de un comentario
exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ status: "error", message: "Comentario no encontrado" });
    }
 
    await comment.update({ content: req.body.content });
    res.json(comment);
  } catch (error) {
    next(error);
  }
};
 
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ status: "error", message: "Comentario no encontrado" });
    }
 
    await comment.destroy();
    res.json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};
