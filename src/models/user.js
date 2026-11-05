"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: "userId",
        as: "posts",
        onDelete: "CASCADE",
      });

      User.hasMany(models.Comment, {
        foreignKey: "userId",
        as: "comments",
        onDelete: "CASCADE",
      });

      // BONUS seguidores
      // followers = los que me siguen
      User.belongsToMany(models.User, {
        through: models.Follow,
        foreignKey: "followedId",
        otherKey: "followerId",
        as: "followers",
      });

      // following = los que sigo
      User.belongsToMany(models.User, {
        through: models.Follow,
        foreignKey: "followerId",
        otherKey: "followedId",
        as: "following",
      });
    }
  }

  User.init(
    {
      nickName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
    },
  );

  return User;
};
