Backend II - Proyecto Final
Descripción del Proyecto
Este proyecto corresponde a la entrega final del curso Backend II. Consiste en un sistema robusto y modularizado para un e-commerce, con implementación completa de autenticación, autorización por roles, gestión de productos y carritos, sistema de tickets, recuperación de contraseña por email, y arquitectura en capas aplicando DAO, Repositorio, DTO y Middlewares.

Requisitos
Node.js: 16.x o superior

MongoDB: Base de datos NoSQL (local o Atlas)

Postman: Para pruebas manuales

Variables de entorno necesarias:

PORT=
MONGO_URI=
SECRET_KEY=
JWT_SECRET=
MAIL_USER=
MAIL_PASS=
TWILIO_SID=
TWILIO_TOKEN=
WHATSAPP_DEST=

nstalación y Configuración
Paso 1: Clonar el repositorio
git clone https://github.com/tuusuario/proyecto-backend-avanzado-2.git
cd proyecto-backend-avanzado-2

Paso 2: Instalar las dependencias
npm install

Paso 3: Configurar .env con tus variables

Ejecución del Proyecto
npm run dev

Funcionalidades Principales

Registro de Usuarios
POST /api/sessions/register
Crea un usuario nuevo y le asigna automáticamente un carrito.

Login
POST /api/sessions/login
Autentica al usuario y genera un JWT que se guarda como cookie segura.

Sesión Actual
GET /api/sessions/current
Devuelve los datos del usuario logueado (DTO, sin contraseña).

Recuperación de Contraseña
POST /api/sessions/forgot-password
Envía un email con un link temporal para cambiar la contraseña.

POST /api/sessions/reset-password?token=...
Permite establecer una nueva contraseña (no puede ser la misma anterior).

Gestión de Carritos
POST /api/carts
GET /api/carts/:cid
POST /api/carts/:cid/product/:pid
PUT /api/carts/:cid/products
PUT /api/carts/:cid/products/:pid
DELETE /api/carts/:cid/products/:pid
POST /api/carts/:cid/purchase → Crea ticket, descuenta stock y envía WhatsApp

Gestión de Productos
GET /api/products
GET /api/products/:id
POST /api/products (solo admin)
PUT /api/products/:id (solo admin)
DELETE /api/products/:id (solo admin)

Arquitectura Aplicada
DAO: Acceso directo a modelos a través de managers (UserManager, CartManager, etc.)

Repository: Capa intermedia que abstrae la lógica de persistencia (UserRepository, etc.)

Service: Lógica de negocio desacoplada de Express (UserService, etc.)

DTO: Respuesta estandarizada en rutas sensibles (UsersDTO, ProductsDTO)

Middlewares: Autenticación, autorización por rol, validación de datos y manejo global de errores.

JWT + Cookies: Manejo de sesión sin almacenamiento en servidor.

Pruebas con Postman
Registro: POST /api/sessions/register

Login: POST /api/sessions/login

Current: GET /api/sessions/current

Recuperación de contraseña: POST /api/sessions/forgot-password

Productos y carritos: todas las rutas documentadas están listas para ser testeadas.

Consideraciones Finales
Este proyecto refleja una arquitectura backend moderna, escalable y segura, con separación clara de responsabilidades y herramientas profesionales de autenticación, persistencia, y comunicación.

Autor
Maximiliano Sastre Bocalon