"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post_Images extends Model {
    static associate(models) {
      Post_Images.belongsTo(models.Post, {
        foreignKey: "postId",
        as: "post",
      });
    }
  }

  Post_Images.init(
    {
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Post_Images",
      tableName: "Post_Images",
    },
  );

  return Post_Images;
};
