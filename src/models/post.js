"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      Post.hasMany(models.Post_Images, {
        foreignKey: "postId",
        as: "images",
        onDelete: "CASCADE",
      });

      Post.hasMany(models.Comment, {
        foreignKey: "postId",
        as: "comments",
        onDelete: "CASCADE",
      });

      Post.belongsToMany(models.Tag, {
        through: models.Post_Tags,
        foreignKey: "postId",
        otherKey: "tagId",
        as: {
          singular: "tag",
          plural: "tags",
        },
      });
    }
  }

  Post.init(
    {
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "Posts",
    },
  );

  return Post;
};
