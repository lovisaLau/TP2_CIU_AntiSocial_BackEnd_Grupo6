"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post_Tags extends Model {}

  Post_Tags.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Post_Tags",
      tableName: "Post_Tags",
      indexes: [{ unique: true, fields: ["postId", "tagId"] }],
    },
  );

  return Post_Tags;
};
