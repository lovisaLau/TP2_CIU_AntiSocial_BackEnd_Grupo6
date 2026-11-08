"use strict";
const bcrypt = require("bcryptjs");

// BONUS contraseña propia: agrega la columna password a Users.
// Los usuarios que ya existían quedan con la contraseña "123456"
// (la contraseña fija del login simulado), guardada encriptada.
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("Users", "password", {
        type: Sequelize.STRING,
        allowNull: true,
        });
        const hash = await bcrypt.hash("123456", 10);
        await queryInterface.bulkUpdate("Users", { password: hash }, { password: null });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("Users", "password");
    },
};