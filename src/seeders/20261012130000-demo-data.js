"use strict";
const bcrypt = require("bcryptjs");

const haceDias = (dias) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  return fecha;
};

const haceMeses = (meses) => {
  const fecha = new Date();
  fecha.setMonth(fecha.getMonth() - meses);
  return fecha;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const ahora = new Date();
    const fechas = { createdAt: ahora, updatedAt: ahora };
    const password = await bcrypt.hash("123456", 10);

    await queryInterface.bulkInsert("Users", [
      { id: 1, nickName: "marilin", password, ...fechas },
      { id: 2, nickName: "laura", password, ...fechas },
      { id: 3, nickName: "mili", password, ...fechas },
      { id: 4, nickName: "silvina", password, ...fechas },
    ]);

    await queryInterface.bulkInsert("Posts", [
      { id: 1, description: "Primer post de la red anti-social", userId: 1, createdAt: haceMeses(12), updatedAt: haceMeses(12) },
      { id: 2, description: "Arrancamos el TP de Estrategias de Persistencia", userId: 2, ...fechas },
      { id: 3, description: "Un post sin imágenes ni etiquetas", userId: 3, ...fechas },
      // Publicaciones extra para que en la Home se vea la paginación (de a 6)
      { id: 4, description: "Día feriado: se estudia mucho", userId: 4, createdAt: haceDias(1), updatedAt: haceDias(1) },
      { id: 5, description: "¿Alguien entendió useEffect a la primera?", userId: 1, createdAt: haceDias(2), updatedAt: haceDias(2) },
      { id: 6, description: "Mate, apuntes y TypeScript", userId: 2, createdAt: haceDias(3), updatedAt: haceDias(3) },
      { id: 7, description: "Probando la galería con tres fotos", userId: 3, createdAt: haceDias(4), updatedAt: haceDias(4) },
      { id: 8, description: "Hoy aprendí qué es CORS (y por qué Postman no se queja)", userId: 4, createdAt: haceDias(5), updatedAt: haceDias(5) },
      { id: 9, description: "Recomiendo la clase de rutas: todo tiene sentido ahora", userId: 1, createdAt: haceDias(6), updatedAt: haceDias(6) },
      { id: 10, description: "Último post de la semana, ¡a descansar!", userId: 2, createdAt: haceDias(7), updatedAt: haceDias(7) },
    ]);

    await queryInterface.bulkInsert("Post_Images", [
      { postId: 1, url: "https://picsum.photos/id/10/600/400", ...fechas },
      { postId: 1, url: "https://picsum.photos/id/20/600/400", ...fechas },
      { postId: 2, url: "https://picsum.photos/id/30/600/400", ...fechas },
      { postId: 4, url: "https://picsum.photos/id/0/600/400", ...fechas },
      { postId: 6, url: "https://picsum.photos/id/42/600/400", ...fechas },
      { postId: 7, url: "https://picsum.photos/id/15/600/400", ...fechas },
      { postId: 7, url: "https://picsum.photos/id/16/600/400", ...fechas },
      { postId: 7, url: "https://picsum.photos/id/17/600/400", ...fechas },
      { postId: 9, url: "https://picsum.photos/id/24/600/400", ...fechas },
    ]);

    await queryInterface.bulkInsert("Tags", [
      { id: 1, name: "unahur", ...fechas },
      { id: 2, name: "node", ...fechas },
      { id: 3, name: "sequelize", ...fechas },
    ]);

    await queryInterface.bulkInsert("Post_Tags", [
      { postId: 1, tagId: 1, ...fechas },
      { postId: 2, tagId: 1, ...fechas },
      { postId: 2, tagId: 2, ...fechas },
      { postId: 2, tagId: 3, ...fechas },
      { postId: 4, tagId: 1, ...fechas },
      { postId: 5, tagId: 2, ...fechas },
      { postId: 6, tagId: 1, ...fechas },
      { postId: 8, tagId: 2, ...fechas },
      { postId: 9, tagId: 1, ...fechas },
      { postId: 10, tagId: 1, ...fechas },
    ]);

    // en el post 1 hay 2 comentarios viejos para probar los X meses
    await queryInterface.bulkInsert("Comments", [
      { content: "Comentario de hace 10 meses", userId: 2, postId: 1, createdAt: haceMeses(10), updatedAt: haceMeses(10) },
      { content: "Comentario de hace 8 meses", userId: 3, postId: 1, createdAt: haceMeses(8), updatedAt: haceMeses(8) },
      { content: "Comentario de hace 1 mes", userId: 4, postId: 1, createdAt: haceMeses(1), updatedAt: haceMeses(1) },
      { content: "¡Vamos que sale!", userId: 1, postId: 2, ...fechas },
      { content: "¡Nadie! Pero con la clase de Conceptos se aclara", userId: 2, postId: 5, ...fechas },
      { content: "Yo tardé tres intentos", userId: 3, postId: 5, ...fechas },
      { content: "Qué lindas fotos", userId: 4, postId: 7, ...fechas },
      { content: "Gracias por explicarlo, me sirvió", userId: 1, postId: 8, ...fechas },
    ]);

    await queryInterface.bulkInsert("Follows", [
      { followerId: 2, followedId: 1, ...fechas },
      { followerId: 3, followedId: 1, ...fechas },
      { followerId: 1, followedId: 2, ...fechas },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Follows", null, {});
    await queryInterface.bulkDelete("Comments", null, {});
    await queryInterface.bulkDelete("Post_Tags", null, {});
    await queryInterface.bulkDelete("Tags", null, {});
    await queryInterface.bulkDelete("Post_Images", null, {});
    await queryInterface.bulkDelete("Posts", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
