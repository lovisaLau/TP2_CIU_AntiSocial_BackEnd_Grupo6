"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      Comment.belongsTo(models.Post, {
        foreignKey: "postId",
        as: "post",
      });
    }

    // los meses salen del .env (COMMENT_MAX_MONTHS)
    static fechaLimiteVisible() {
      const meses = Number(process.env.COMMENT_MAX_MONTHS) || 6;
      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() - meses);
      return fecha;
    }
  }

  Comment.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // virtual: no se guarda en la base
      visible: {
        type: DataTypes.VIRTUAL(DataTypes.BOOLEAN, ["createdAt"]),
        get() {
          const creado = this.getDataValue("createdAt");
          if (!creado) return true;
          return new Date(creado) >= Comment.fechaLimiteVisible();
        },
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "Comments",
    },
  );

  return Comment;
};
