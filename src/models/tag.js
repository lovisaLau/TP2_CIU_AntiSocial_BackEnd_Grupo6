"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      Tag.belongsToMany(models.Post, {
        through: models.Post_Tags,
        foreignKey: "tagId",
        otherKey: "postId",
        as: {
          singular: "post",
          plural: "posts",
        },
      });
    }
  }

  Tag.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Tag",
      tableName: "Tags",
    },
  );

  return Tag;
};
