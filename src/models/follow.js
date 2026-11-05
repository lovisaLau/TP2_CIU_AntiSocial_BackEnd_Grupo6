"use strict";
const { Model } = require("sequelize");

// BONUS: tabla intermedia para seguidores
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {}

  Follow.init(
    {
      followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      followedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Follow",
      tableName: "Follows",
      indexes: [{ unique: true, fields: ["followerId", "followedId"] }],
    },
  );

  return Follow;
};
