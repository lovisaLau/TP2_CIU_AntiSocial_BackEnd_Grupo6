const { sequelize, Post, Post_Images, Comment, User, Tag } = require('../models');

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: [
        // Coincide con as: "user" de Post.js
        { model: User, as: 'user', attributes: ['id', 'nickName'] },
        
        // Coincide con as: "images" de Post.js y el modelo Post_Images
        { model: Post_Images, as: 'images', attributes: ['id', 'url'] },
        
        // Coincide con as: "tags" de Post.js
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } },
        
        // Coincide con as: "comments" y su autor en Comment.js (as: "user")
        { 
          model: Comment, 
          as: 'comments', 
          include: [{ model: User, as: 'user', attributes: ['id', 'nickName'] }] 
        }
      ]
    });

    // Mapeamos para filtrar usando la propiedad virtual "visible" definida en Comment.js
    const response = posts.map(post => {
      const p = post.toJSON();
      if (p.comments) {
        p.comments = p.comments.filter(c => c.visible);
      }
      return p;
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'nickName'] },
        { model: Post_Images, as: 'images', attributes: ['id', 'url'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } },
        { 
          model: Comment, 
          as: 'comments', 
          include: [{ model: User, as: 'user', attributes: ['id', 'nickName'] }] 
        }
      ]
    });

    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Publicación no encontrada' });
    }

    const p = post.toJSON();
    if (p.comments) {
      p.comments = p.comments.filter(c => c.visible);
    }

    res.json(p);
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { description, userId, images, tags } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'El usuario especificado no existe' });
    }

    // Se verifica que existan TODAS las etiquetas ANTES de crear nada.
    // (Antes el post se creaba igual aunque una etiqueta no existiera.)
    const tagIds = [...new Set(tags || [])]; // sin ids repetidos
    if (tagIds.length > 0) {
      const encontradas = await Tag.count({ where: { id: tagIds } });
      if (encontradas !== tagIds.length) {
        return res.status(404).json({ status: 'error', message: 'Una o más etiquetas no existen' });
      }
    }

    // Transacción: el post, sus imágenes y sus etiquetas se guardan todos juntos.
    // Si algo falla, no se guarda nada (no queda un post "a medias").
    const post = await sequelize.transaction(async (t) => {
      const nuevoPost = await Post.create({ description, userId }, { transaction: t });

      if (images && images.length > 0) {
        const imageData = images.map(url => ({ url, postId: nuevoPost.id }));
        await Post_Images.bulkCreate(imageData, { transaction: t });
      }

      if (tagIds.length > 0) {
        await nuevoPost.setTags(tagIds, { transaction: t });
      }

      return nuevoPost;
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// Modifica la descripción de un post
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Publicación no encontrada' });
    }

    await post.update({ description: req.body.description });
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// Borra un post. Por el CASCADE de la base, también se borran
// sus imágenes, sus comentarios y sus asociaciones con etiquetas.
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Publicación no encontrada' });
    }

    await post.destroy();
    res.json({ message: 'Publicación eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

exports.addImageToPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Publicación no encontrada' });
    }

    const newImage = await Post_Images.create({ url: req.body.url, postId: Number(id) });
    res.status(201).json(newImage);
  } catch (error) {
    next(error);
  }
};

exports.removeImageFromPost = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;
    const image = await Post_Images.findOne({ where: { id: imageId, postId: id } });

    if (!image) {
      return res.status(404).json({ status: 'error', message: 'Imagen no encontrada en este post' });
    }

    await image.destroy();
    res.json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};