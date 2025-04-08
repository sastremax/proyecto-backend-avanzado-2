Backend 2 - Primera Preentrega

Descripción del Proyecto

Este proyecto corresponde a la primera preentrega del curso Backend. Implementa un sistema completo de autenticación con Passport utilizando estrategias locales y de terceros (GitHub), middleware de roles, protección de rutas con JWT y manejo de sesiones mediante cookies. Las vistas están renderizadas con Handlebars y los datos se almacenan en MongoDB.

Requisitos

Node.js: Versión 16.x o superior

Express: Framework para el servidor web

MongoDB: Base de datos NoSQL (local o Atlas)

Passport: Autenticación local y con GitHub

bcrypt: Hasheo de contraseñas

jsonwebtoken: Generación y verificación de tokens JWT

cookie-parser: Lectura de cookies HTTP

express-session: Manejo de sesiones

dotenv: Variables de entorno

express-handlebars: Motor de vistas

Instalación y Configuración

Paso 1: Clonar el repositorio

git clone https://github.com/tuusuario/proyecto-backend-avanzado.git
cd proyecto-backend-avanzado

Paso 2: Instalar las dependencias

npm install

Paso 3: Crear el archivo .env

con estos datos: 
SECRET_KEY
JWT_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
MONGO_URI

Uso del Proyecto

Ejecutar el Servidor

npm run dev

Esto inicia el servidor en: http://localhost:8084

Funcionalidades Principales

1. Registro de Usuarios

Ruta: POST /api/sessions/register

Cuerpo:

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 30,
  "password": "clave123456"
}

2. Login Local

Ruta: POST /api/sessions/login

Genera un JWT y lo guarda en una cookie llamada jwtToken

3. Login con GitHub

Ruta: GET /api/users/github

Autenticación usando GitHub con creación automática del usuario

4. Ruta Protegida con JWT

Ruta: GET /api/sessions/current

Devuelve los datos del usuario logueado si el token JWT es válido

5. Logout

Ruta: GET /api/sessions/logout

Elimina la cookie y cierra sesión

6. Vista Protegida con Rol Admin

Ruta: GET /api/users/products

Protegida por passport.authenticate('current') y authorizationRol('admin').

Renderiza products.handlebars con los datos del usuario

7. Formularios Visuales

GET /api/users/login/form → Vista para loguearse

GET /api/users/register → Vista para registrarse

Middleware Aplicados

passport.authenticate('current') → Verifica el token JWT desde  cookies

authorizationRol(rol) → Verifica si el usuario tiene el rol requerido (por defecto cualquier rol)

Pruebas

Con Postman

Registro: POST /api/sessions/register

Login: POST /api/sessions/login

Current: GET /api/sessions/current (requiere cookie jwtToken)

Desde el Navegador

Ir a /api/users/register y crear un usuario

Ir a /api/users/login/form y hacer login

Redirige automáticamente a /api/users/products si el usuario es admin

Si no es admin, devuelve "Access Denied"

Consideraciones Finales

Este proyecto sienta las bases de un sistema seguro de autenticación en aplicaciones backend modernas, usando JWT, Passport y roles. Está listo para integrarse con rutas de usuarios, carritos, productos o cualquier módulo adicional que se requiera.

Autor

Maximiliano Sastre Bocalon
