"use strict";

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

    await queryInterface.bulkInsert("Users", [
      { id: 1, nickName: "carla", ...fechas },
      { id: 2, nickName: "laura", ...fechas },
      { id: 3, nickName: "mili", ...fechas },
      { id: 4, nickName: "silvina", ...fechas },
    ]);

    await queryInterface.bulkInsert("Posts", [
      { id: 1, description: "Primer post de la red anti-social", userId: 1, createdAt: haceMeses(12), updatedAt: haceMeses(12) },
      { id: 2, description: "Arrancamos el TP de Estrategias de Persistencia", userId: 2, ...fechas },
      { id: 3, description: "Un post sin imágenes ni etiquetas", userId: 3, ...fechas },
    ]);

    await queryInterface.bulkInsert("Post_Images", [
      { postId: 1, url: "https://picsum.photos/id/10/600/400", ...fechas },
      { postId: 1, url: "https://picsum.photos/id/20/600/400", ...fechas },
      { postId: 2, url: "https://picsum.photos/id/30/600/400", ...fechas },
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
    ]);

    // en el post 1 hay 2 comentarios viejos para probar los X meses
    await queryInterface.bulkInsert("Comments", [
      { content: "Comentario de hace 10 meses", userId: 2, postId: 1, createdAt: haceMeses(10), updatedAt: haceMeses(10) },
      { content: "Comentario de hace 8 meses", userId: 3, postId: 1, createdAt: haceMeses(8), updatedAt: haceMeses(8) },
      { content: "Comentario de hace 1 mes", userId: 4, postId: 1, createdAt: haceMeses(1), updatedAt: haceMeses(1) },
      { content: "¡Vamos que sale!", userId: 1, postId: 2, ...fechas },
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
