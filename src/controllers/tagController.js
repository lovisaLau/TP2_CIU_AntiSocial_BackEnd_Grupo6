const { Op } = require("sequelize");
const { Tag, Post } = require("../models");

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.findAll();
    res.json(tags);
  } catch (error) {
    next(error);
  }
};

exports.getTagById = async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Post,
          as: "posts",
          attributes: ["id", "description"],
          through: { attributes: [] }, 
        },
      ],
    });

    if (!tag) {
      return res.status(404).json({ status: "error", message: "Etiqueta no encontrada" });
    }

    res.json(tag);
  } catch (error) {
    next(error);
  }
};

exports.createTag = async (req, res, next) => {
  try {
    const { name } = req.body;

    const [tag, created] = await Tag.findOrCreate({
      where: { name },
    });

    if (!created) {
      return res.status(409).json({ status: "error", message: "La etiqueta ya existe" });
    }

    res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
};

exports.updateTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ status: "error", message: "Etiqueta no encontrada" });
    }

    const name = req.body.name;

    const repetida = await Tag.findOne({ where: { name, id: { [Op.ne]: tag.id } } });
    if (repetida) {
      return res.status(409).json({ status: "error", message: "Ya existe otra etiqueta con ese nombre" });
    }

    await tag.update({ name });
    res.json(tag);
  } catch (error) {
    next(error);
  }
};

exports.deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ status: "error", message: "Etiqueta no encontrada" });
    }

    await tag.destroy();
    res.json({ message: "Etiqueta eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

exports.addTagToPost = async (req, res, next) => {
  try {
    const postId = req.params.id || req.params.postId;
    const { tagId } = req.body;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ status: "error", message: "Publicación no encontrada" });
    }

    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      return res.status(404).json({ status: "error", message: "Etiqueta no encontrada" });
    }

    await post.addTag(tag);
    res.status(200).json({ message: "Etiqueta asociada correctamente al post" });
  } catch (error) {
    next(error);
  }
};

exports.removeTagFromPost = async (req, res, next) => {
  try {
    const { id, tagId } = req.params;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ status: "error", message: "Publicación no encontrada" });
    }

    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      return res.status(404).json({ status: "error", message: "Etiqueta no encontrada" });
    }

    const laTiene = await post.hasTag(tag);
    if (!laTiene) {
      return res.status(404).json({ status: "error", message: "La etiqueta no está asociada a esta publicación" });
    }

    await post.removeTag(tag);
    res.json({ message: "Etiqueta quitada correctamente del post" });
  } catch (error) {
    next(error);
  }
};
