# Red Anti-Social

Se solicita el modelado y desarrollo del backend de una red social llamada **“UnaHur Anti-Social Net”**, inspirada en plataformas populares donde los usuarios publican contenido y reciben comentarios sobre él.

![Imagen](./assets/ANTI-SOCIALNET.jpeg)

# Contexto del Proyecto

En una primera reunión con los sponsors se definió el alcance de un **MVP (Producto Mínimo Viable)**. Lo que sigue es lo que ellos pidieron: **cómo resolverlo es decisión del equipo**.

- Un usuario registrado puede hacer publicaciones. Toda publicación tiene **obligatoriamente una descripción** y, opcionalmente, **una o más imágenes**. Las imágenes se pueden agregar o quitar después de publicado el post.
- Las publicaciones pueden recibir **comentarios** de otros usuarios.
- Las publicaciones pueden tener **etiquetas (tags)**, y una misma etiqueta puede aparecer en muchas publicaciones.
- Los **comentarios con más de X meses de antigüedad no deben mostrarse** al consultar un post. X tiene que ser configurable sin tocar el código. Si un comentario está visible o no **no se guarda en la base**: se calcula con un **atributo virtual** de Sequelize.

# Entidades

Los sponsors usan estos nombres para hablar del dominio. Respetenlos en el modelo:

- **User**: usuario registrado. Se identifica por su `nickName`, que no se puede repetir.
- **Post**: publicación que hace un usuario en una fecha determinada.
- **Post_Images**: imágenes asociadas a un post. Para el MVP alcanza con guardar la **URL** de la imagen.
- **Comment**: comentario de un usuario sobre un post, hecho en una fecha determinada.
- **Tag**: etiqueta que se le puede asignar a un post.

Los atributos, las relaciones, las claves y las restricciones las definen ustedes a partir de los requerimientos. Tienen que poder justificar cada decisión.

# Stack obligatorio

- **Node.js** con **Express**.
- Base de datos **relacional**, accedida **exclusivamente con Sequelize** (modelos y asociaciones). No se aceptan consultas SQL escritas a mano ni persistencia en memoria o archivos.
- Validación de los datos de entrada con **Joi**, aplicada a través de **middlewares** de Express.

# Qué se espera

- Un **DER** que refleje el modelo de datos.
- Una **API REST** que permita operar sobre todas las entidades y sobre las relaciones entre ellas.
- **Validaciones** que garanticen la integridad de los datos: que no entren datos inválidos (schemas de Joi en middlewares) y que las relaciones sean consistentes (por ejemplo, no comentar un post que no existe). Ante un error, la API tiene que responder con un código HTTP adecuado y un mensaje claro.
- Poder **cambiar de motor de base de datos** solo con configuración e instalación de dependencias, sin modificar el código.
- Que el **puerto** y demás parámetros (incluido el de los X meses) se configuren mediante **variables de entorno**.
- Un README con las instrucciones para levantar el proyecto desde cero.

# Documentación y pruebas: a investigar

Estos dos puntos **no se van a ver en clase**. Parte del trabajo es investigar por su cuenta qué son, para qué sirven y cómo se integran al proyecto.

- **Swagger / OpenAPI**: la API tiene que estar documentada con una especificación en formato **YAML** que cubra **todos** los endpoints, con sus parámetros, cuerpos de request, respuestas y códigos de error. La documentación tiene que poder consultarse desde el propio servidor.
- **Colecciones de prueba**: entregar una colección (Postman, Insomnia, Bruno, Thunder Client o la herramienta que elijan) que permita probar todos los endpoints, incluyendo casos de error.

# Bonus

Los bonus **tampoco se ven en clase**. Requieren investigar por su cuenta más allá de lo pedido para el MVP.

1. Permitir subir las imágenes de un post al servidor y guardarlas en una carpeta del servidor web, en lugar de recibir solo la URL.
2. ¿Cómo modelarían que un usuario pueda **seguir** a otros y a su vez ser seguido por muchos (followers)? Implementarlo.

# Cómo levantar el proyecto

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (incluye npm).
- Git.

## Pasos

1. Clonar el repositorio (o, si ya se clonó antes, actualizarlo con `git pull`):

   ```bash
   git clone https://gitea.unahur.edu.ar/Estrategia-de-persistencia-C2-2026/ejercicio-48-grupo-19.git
   cd ejercicio-48-grupo-19
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear el archivo `.env` a partir del ejemplo:

   ```bash
   cp .env.example .env
   ```

   Por defecto usa SQLite, así que no hace falta instalar ningún motor de base de datos.

4. Crear las tablas y cargar los datos de prueba:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Levantar el servidor:

   ```bash
   npm run dev
   ```

   Tiene que aparecer `Servidor ejecutándose en http://localhost:3000` (o el puerto definido en `PORT`).

6. Abrir la documentación de la API en el navegador:

   ```text
   http://localhost:3000/docs
   ```

   (Cambiar `3000` por el valor de `PORT` si se modificó.)

## Variables de entorno

Toda la configuración, incluida la de la base de datos, se toma del `.env`. Para cambiar de motor, ver más abajo "Cambiar de motor de base de datos".

| Variable | Para qué sirve | Valor por defecto |
| --- | --- | --- |
| `PORT` | Puerto de la API | `3000` |
| `COMMENT_MAX_MONTHS` | Los comentarios con más meses que este valor no se muestran al consultar un post | `6` |
| `DB_DIALECT` | Motor de base de datos: `sqlite`, `mysql`, `mariadb`, `postgres`, `mssql` | `sqlite` |
| `DB_STORAGE` | Archivo de la base (solo SQLite) | `./src/data/antisocial.db` |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Conexión para motores cliente/servidor | - |
| `DB_LOGGING` | `true` para ver las consultas SQL en consola | `false` |
| `UPLOAD_MAX_MB` | Bonus: tamaño máximo (en MB) de las imágenes que se suben al servidor | `5` |

### Cambiar de motor de base de datos

Solo hay que cambiar el `.env` e instalar el driver del motor, sin tocar el código. Por ejemplo, para MySQL:

```bash
npm install mysql2
```

```env
DB_DIALECT=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=antisocial
DB_USER=root
DB_PASSWORD=
```

Después, crear la base `antisocial` en MySQL y volver a correr `npm run db:migrate` y `npm run db:seed`.

## Scripts disponibles

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Levanta el servidor con nodemon (se reinicia al guardar cambios) |
| `npm start` | Levanta el servidor sin nodemon |
| `npm run db:migrate` | Crea las tablas |
| `npm run db:migrate:undo` | Borra todas las tablas |
| `npm run db:seed` | Carga los datos de prueba |
| `npm run db:seed:undo` | Borra los datos de prueba |
| `npm test` | Corre la colección de pruebas con newman (con el servidor levantado) |

Para recargar los datos de prueba desde cero: `npm run db:seed:undo` y después `npm run db:seed`. (Si se corre `db:seed` dos veces seguidas da `Validation error`, porque los usuarios ya existen.)

## Documentación de la API (Swagger / OpenAPI)

La API está documentada con una especificación **OpenAPI 3** escrita en YAML, en [`docs/swagger.yaml`](./docs/swagger.yaml). Cubre todos los endpoints con sus parámetros, cuerpos de request, respuestas y códigos de error.

Con el servidor levantado se puede consultar desde el propio servidor:

| URL | Qué muestra |
| --- | --- |
| `http://localhost:3000/docs` | Interfaz de Swagger UI. Con **Try it out** se puede probar cada endpoint desde el navegador. |
| `http://localhost:3000/docs/swagger.yaml` | El archivo YAML (sirve para importarlo en Postman, Insomnia o editor.swagger.io). |

Se sirve con [`swagger-ui-express`](https://www.npmjs.com/package/swagger-ui-express); el YAML se lee con [`js-yaml`](https://www.npmjs.com/package/js-yaml). La ruta está en `src/routes/docsRoutes.js`.

> Si se agrega o cambia un endpoint, hay que actualizar también `docs/swagger.yaml`.

## Colección de pruebas (Postman)
 
En [`postman/antiSocialNet.postmanCollection.json`](./postman/antiSocialNet.postmanCollection.json) hay una colección que prueba **todos los endpoints**, incluidos los casos de error (400, 404 y 409). Cada request tiene tests que verifican el código HTTP y el mensaje de respuesta.
 
Para usarla:
 
1. Levantar el proyecto (`npm run db:migrate`, `npm run db:seed`, `npm run dev`).
2. En Postman: **Import** → elegir el archivo `.json`.
3. Si el puerto no es 3000, cambiar la variable `baseUrl` de la colección (pestaña *Variables*).
4. Correrla entera con **Run collection**, en el orden en que está (los requests guardan ids en variables que usan los siguientes).
 
También se puede correr desde la terminal, sin instalar Postman:
 
```bash
npx newman run postman/antiSocialNet.postmanCollection.json
```

O, con el mismo resultado:

```bash
npm test
```

La colección crea sus propios usuarios y tags con nombres únicos y los borra al final, así que se puede correr varias veces sin volver a cargar los datos de prueba.

La subida de imágenes (bonus) se prueba con los archivos 'postman/imagen-prueba.png' y 'postman/archivo-prueba.txt'; por eso newman hay que correrlo desde la carpeta raíz del proyecto.

## Bonus: subida de imágenes al servidor
 
Además de agregar una imagen por URL (`POST /posts/:id/images`), se puede **subir el archivo** al servidor con `POST /posts/:id/images/upload`. Para eso se usa [Multer](https://www.npmjs.com/package/multer):
 
- El archivo se envía como `multipart/form-data`, en el campo **`imagen`**.
- Se aceptan imágenes jpg, png, gif o webp, de hasta `UPLOAD_MAX_MB` MB (por defecto 5).
- El archivo se guarda en la carpeta `uploads/` (se crea sola y no se sube al repo) y en `Post_Images` queda su URL pública, por ejemplo `http://localhost:3000/uploads/post-1-1729100000000-123456.png`.
 
Para probarlo desde la terminal (en Windows, escribir `curl.exe`):
 
```bash
curl.exe -F "imagen=@foto.png" http://localhost:3000/posts/1/images/upload
```
 
En Postman: pestaña **Body** → **form-data** → key `imagen`, tipo **File**, y elegir el archivo.

## Estructura del proyecto

```text
docs/              DER y especificación OpenAPI (swagger.yaml)
postman/           Colección de pruebas de Postman
uploads/           Imágenes subidas con el bonus (sin subir al repo)
src/
├── config/        Configuración de la base de datos (lee el .env)
├── models/        Modelos de Sequelize y sus asociaciones
├── migrations/    Creación de las tablas
├── seeders/       Datos de prueba
├── routes/        Un archivo de rutas por entidad (y docsRoutes para Swagger)
├── controllers/   Lógica de cada endpoint
├── middlewares/   validarId, validarSchema, manejo de errores y upload (Multer)
├── schemas/       Schemas de Joi
├── data/          Archivo de la base SQLite (no se sube al repo)
└── main.js        Punto de entrada
```

El modelo de datos está en [docs/DER.md](./docs/DER.md).

## Cambios para el TP2 de Construcción de Interfaces de Usuario

Este repositorio es una copia del BackEnd de **Red Anti-Social**, la API que desarrollamos para **Estrategias de Persistencia**. Lo usamos como BackEnd propio del TP2 de **Construcción de Interfaces de Usuario** (UNAHUR), cuyo FrontEnd (React + TypeScript) vive en otro repositorio.

Para no modificar la entrega original, se creó este repo nuevo y los cambios del TP2 quedaron en commits separados. Las demás rutas de la API se usan tal como estaban.

### 1. Origen del código

El código base es el de la entrega de Estrategias de Persistencia, importado sin cambios en el primer commit de este repo.

- Repositorio original: `<link al repo original de Estrategias>`

### 2. CORS

El navegador bloquea los pedidos de una página (`http://localhost:5173`) a otro origen (`http://localhost:3000`) si el servidor no lo autoriza. Para permitir que el FrontEnd consuma la API se instaló el paquete `cors` y se lo configuró en `src/main.js`:

```js
const cors = require("cors");
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:4173"] }));
```

- `5173` es el puerto de `npm run dev` del FrontEnd.
- `4173` es el puerto de `npm run preview`.

### 3. Bonus: contraseña propia y login validado por el BackEnd

Cada usuario elige su contraseña al registrarse, y el BackEnd valida las credenciales al iniciar sesión.

**Qué se agregó**

- **Columna `password`** en la tabla `Users`, mediante la migración `20261105120000-add-password-to-user.js`. Los usuarios que ya existían quedan con la contraseña `123456`.
- **Encriptación con `bcryptjs`:** en la base se guarda el hash, nunca el texto real.
- **`defaultScope` en el modelo `User`:** excluye `password` de todas las consultas, así ninguna ruta la devuelve por error. Solo el login usa `User.scope("conPassword")`.
- **`POST /users`** ahora requiere `nickName` y `password` (mínimo 6 caracteres).
- **`POST /users/login`** (nuevo): compara la contraseña con `bcrypt.compare`.
  - `200`: credenciales correctas, devuelve el usuario sin la contraseña.
  - `400`: datos inválidos.
  - `401`: "Usuario o contraseña incorrectos". El mensaje es el mismo si el nickName no existe, para no dar pistas de qué usuarios hay.
- **Seeders:** los usuarios de prueba son las cuatro integrantes del grupo (`laura`, `marilin`, `mili` y `silvina`), todos con la contraseña `123456`.
- **Documentación y pruebas:** Swagger (`/docs`) y la colección de Postman incluyen el login y los casos nuevos.

**Cómo actualizar una base existente**

```bash
git pull
npm install
npm run db:migrate
npm run db:seed:undo
npm run db:seed
npm run dev
```

> Ojo: `db:seed:undo` borra los datos de prueba, incluido lo que se haya creado a mano en la base local.

**Ejemplo de login**

```http
POST /users/login
Content-Type: application/json


{ "nickName": "laura", "password": "123456" }
```