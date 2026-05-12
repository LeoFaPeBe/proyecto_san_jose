**Finca Turística San José Tatacoa**

Sistema web fullstack para la gestión de reservas, alojamientos y actividades turísticas del Desierto de la Tatacoa.

**Descripción General**

La plataforma permite administrar:

Reservas de huéspedes
Alojamientos turísticos
Actividades recreativas
Autenticación segura con JWT
Panel administrativo
Gestión centralizada de información turística

El sistema fue desarrollado bajo una arquitectura moderna basada en contenedores Docker y servicios desacoplados.

**Objetivo del Proyecto**

Desarrollar una plataforma web moderna que permita optimizar la administración turística de la Finca Turística San José Tatacoa, facilitando la gestión de reservas, alojamientos y actividades para clientes y administradores.

**Tecnologías Utilizadas**
- Frontend
- React
- Vite
- TypeScript
- TailwindCSS
- Axios
- Backend
- NestJS
- Prisma ORM
- JWT Authentication
- bcrypt
- PostgreSQL
- Infraestructura
- Docker
- Docker Compose

**Estructura General del Proyecto**

proyecto-san-jose-tatacoa/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── Dockerfile
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── .env
│
├── docker-compose.yml
└── README.md


**Instalación del Proyecto**

1. Clonar el repositorio
git clone https://github.com/LeoFaPeBe/proyecto_san_jose.git
cd proyecto_san_jose


2. Configurar variables de entorno
Backend .env
DATABASE_URL="postgresql://tatacoa:tatacoa123@database:5432/tatacoa?schema=public"
JWT_SECRET="sjt-secret-super-seguro-cambiar-en-prod"
JWT_EXPIRES_IN="1d"
PORT=4000
FRONTEND_ORIGIN="http://localhost:5173"
NODE_ENV=development
Frontend .env
VITE_API_URL=http://localhost:4000


3. Levantar el proyecto con Docker

docker compose up --build

**Configuración de Base de Datos**

- Acceder al contenedor backend:

docker exec -it tatacoa-backend sh

- Generar Prisma Client:

npx prisma generate

- Aplicar esquema Prisma:

npx prisma db push

- Ejecutar seed de datos:

npm run db:seed

**Credenciales Administrativas**

Correo: admin@sanjosetatacoa.com
Contraseña: admin123

Puertos Utilizados

Servicio	    Puerto
- Frontend	  5173
- Backend	    4000
- PostgreSQL	5432

**Funcionalidades Principales**

*Cliente*

- Consultar alojamientos
- Ver actividades
- Realizar reservas
- Consultar disponibilidad

*Administrador*

- Iniciar sesión
- Gestionar reservas
- Gestionar alojamientos
- Gestionar actividades
- Administrar usuarios

**Seguridad Implementada**

El sistema implementa varias medidas de seguridad:

- Autenticación mediante JWT
- Contraseñas cifradas con bcrypt
- Variables de entorno protegidas
- Validación de rutas protegidas
- Separación de servicios mediante Docker

**Requerimientos Funcionales**
- Registro de reservas
- Gestión de alojamientos
- Gestión de actividades
- Inicio de sesión JWT
- Persistencia en PostgreSQL
- API RESTful
- Gestión de usuarios administradores

**Requerimientos No Funcionales**
- Arquitectura modular
- Escalabilidad
- Seguridad
- Portabilidad mediante Docker
- Persistencia confiable
- Compatibilidad multiplataforma
 
**ADR — Architectural Decision Records**

*ADR-001 — Uso de NestJS*
Decisión

Se seleccionó NestJS como framework backend.

Razones
Arquitectura modular
Escalabilidad
Excelente integración con TypeScript
Compatibilidad con JWT y Prisma
Buenas prácticas empresariales

*ADR-002 — Uso de PostgreSQL*
Decisión

Se seleccionó PostgreSQL como motor de base de datos.

Razones
Robustez
Integridad relacional
Excelente rendimiento
Compatibilidad con Prisma ORM

*ADR-003 — Uso de Prisma ORM*
Decisión

Se implementó Prisma ORM para el acceso a datos.

Razones
Tipado fuerte
Seguridad en consultas
Facilidad de migraciones
Integración con TypeScript

*ADR-004 — Uso de Docker*
Decisión

El proyecto fue contenerizado mediante Docker.

Razones
Portabilidad
Consistencia entre entornos
Facilidad de despliegue
Separación de servicios

**API REST**

El backend expone una API REST desarrollada con NestJS.

Principales endpoints: 

Auth
- POST /auth/login

Reservas
- GET /reservas
- POST /reservas
- PATCH /reservas/:id
- DELETE /reservas/:id

Alojamientos
- GET /alojamientos

Actividades
- GET /actividades

**Swagger API**

Acceso

http://localhost:4000/api

**Pruebas Realizadas**

- Conexión Frontend ↔ Backend
- Persistencia PostgreSQL
- Autenticación JWT
- Docker Compose
- Prisma ORM
- Seed de datos
- CRUD de reservas
- Validación de rutas protegidas

**ROADMAP FUTURO**

**Mejoras futuras**

- Pagos en línea
- Integración con WhatsApp
- Despliegue en AWS
- CI/CD con GitHub Actions
- Kubernetes
- Sistema de notificaciones
- Panel analítico
- Reservas en tiempo real

**Capturas del Sistema**

Página principal
![Home](./docs/images/home.png)

Login
![Login](./docs/images/login.png)

Reservas
![Reservas](./docs/images/reservas.png)

Nuevas reservas
![Nuevareserva](./docs/images/nuevareserva.png)

Docker funcionando
![Docker](./docs/images/docker.png)


**Autor**
Leonardo Fabio Pérez Bermúdez

**Proyecto académico y profesional desarrollado para la gestión turística de la:**

Finca Turística San José Tatacoa

**Licencia**
**Proyecto de uso académico y demostrativo.**