# 🌵 San José Tatacoa — Portal de Reservas

> **Finca Hotel Turística · Villavieja, Huila, Colombia**  
> Sistema de gestión interna de reservas, alojamientos y actividades.

---

## Tabla de contenido

1. [Visión general](#1-visión-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Arquitectura](#3-arquitectura)
4. [Modelo de datos](#4-modelo-de-datos)
5. [API REST](#5-api-rest)
6. [Historias de usuario](#6-historias-de-usuario)
7. [Datos iniciales (seed)](#7-datos-iniciales-seed)
8. [Variables de entorno](#8-variables-de-entorno)
9. [Estructura del proyecto](#9-estructura-del-proyecto)
10. [Despliegue con Docker](#10-despliegue-con-docker)
11. [Bugs identificados y mejoras pendientes](#11-bugs-identificados-y-mejoras-pendientes)
12. [Glosario](#12-glosario)
13. [Contacto](#13-contacto)

---

## 1. Visión general

### Descripción

Portal web **fullstack** diseñado para la gestión interna de reservas, alojamientos y actividades de la Finca Hotel Turística San José Tatacoa, ubicada en el Desierto de la Tatacoa, Villavieja, Huila, Colombia.

El sistema permite al equipo administrativo registrar, consultar, filtrar y gestionar el estado de todas las reservas de huéspedes desde un único panel centralizado, integrando además un asistente de inteligencia artificial (Google Gemini) para responder consultas turísticas.

### Objetivos

- Centralizar la gestión de reservas eliminando el uso de hojas de cálculo o registros en papel.
- Proveer un catálogo actualizado de alojamientos y actividades disponibles.
- Automatizar el cálculo del costo total de cada estadía.
- Integrar un asistente IA capaz de responder preguntas frecuentes de turistas.
- Ofrecer una interfaz responsiva y fácil de usar para el personal administrativo.

### Alcance

El sistema cubre exclusivamente la **gestión administrativa interna (back-office)**. No incluye pasarela de pagos ni sistema de reservas en línea para clientes finales.

### Credenciales demo

| Campo | Valor |
|---|---|
| Email | `admin@sanjosetatacoa.com` |
| Contraseña | `admin123` |

> ⚠️ Cambiar la contraseña después del primer inicio de sesión en producción.

---

## 2. Stack tecnológico

| Capa | Tecnología | Versión | Propósito |
|---|---|---|---|
| Backend | NestJS | 10.x | Framework API REST |
| ORM | Prisma | 6.x | Acceso a base de datos |
| Base de datos | PostgreSQL | 16 | Base de datos relacional |
| Auth | JWT + Passport | — | Autenticación stateless |
| Docs | Swagger / OpenAPI | 3.0 | Documentación de la API |
| Frontend | React + Vite | 19 / 6.x | SPA con TypeScript |
| Router | React Router | v7 | Navegación cliente |
| Asistente IA | Google Gemini | 1.5 Flash | Chat inteligente |
| Contenedor | Docker Compose | 3.x | Orquestación de servicios |
| Proxy | Nginx | 1.27 | SPA + proxy API (producción) |

---

## 3. Arquitectura

### Diagrama de componentes

```
Navegador
    │
    ▼
[React SPA]  ──── puerto 5173 (dev) / 80 (prod)
    │
    │  /api/*
    ▼
[Nginx]  ──── proxy inverso en producción
    │
    ▼
[NestJS API]  ──── puerto 4000
    │
    ▼
[PostgreSQL]  ──── puerto 5432
```

### Servicios Docker

| Contenedor | Puerto | Tecnología | Descripción |
|---|---|---|---|
| `tatacoa-frontend` | 5173 / 80 | React + Nginx | Interfaz de usuario SPA |
| `tatacoa-backend` | 4000 | NestJS | API REST con JWT |
| `tatacoa-db` | 5432 | PostgreSQL 16 | Base de datos relacional |

### Módulos del backend

| Módulo | Ruta base | Acceso | Responsabilidad |
|---|---|---|---|
| `AppController` | `/api/health` | Público | Health check del servicio |
| `AuthModule` | `/api/auth` | Mixto | Login, JWT, perfil de usuario |
| `ReservasModule` | `/api/reservas` | Protegido | CRUD completo de reservas |
| `AlojamientosModule` | `/api/alojamientos` | Público | Catálogo de alojamientos |
| `ActividadesModule` | `/api/actividades` | Público | Catálogo de actividades |
| `PrismaModule` | — | Interno (`@Global`) | Servicio global de BD |

### Seguridad

- **Guard JWT global** (`JwtAuthGuard`) aplicado a todas las rutas mediante `APP_GUARD`.
- Rutas públicas marcadas con el decorador `@Public()` (health, login, catálogos).
- Contraseñas almacenadas con **bcrypt** (10 rondas de salt).
- **CORS** configurado para aceptar solo el origen del frontend (`FRONTEND_ORIGIN`).
- **Helmet** habilitado para cabeceras de seguridad HTTP.
- Validación global de DTOs con `class-validator` y `class-transformer`.

---

## 4. Modelo de datos

### User

| Campo | Tipo | Restricción | Descripción |
|---|---|---|---|
| `id` | String (CUID) | PK | Identificador único |
| `email` | String | UNIQUE | Correo corporativo |
| `passwordHash` | String | NOT NULL | Hash bcrypt de la contraseña |
| `nombre` | String | NOT NULL | Nombre completo |
| `rol` | String | DEFAULT `'ADMIN'` | Rol del usuario |
| `isActive` | Boolean | DEFAULT `true` | Estado de la cuenta |
| `createdAt` | DateTime | DEFAULT `now()` | Fecha de creación |

### Reserva

| Campo | Tipo | Restricción | Descripción |
|---|---|---|---|
| `id` | String (CUID) | PK | Identificador único |
| `codigo` | String | UNIQUE | Código legible: R-001, R-002… |
| `huesped` | String | NOT NULL | Nombre del huésped |
| `email` | String | NOT NULL | Correo del huésped |
| `telefono` | String | DEFAULT `""` | Teléfono de contacto |
| `alojamiento` | String | NOT NULL | Nombre del alojamiento |
| `llegada` | DateTime | NOT NULL | Fecha de check-in |
| `salida` | DateTime | NOT NULL | Fecha de check-out |
| `personas` | Int | DEFAULT `1` | Número de huéspedes |
| `actividades` | String (JSON) | DEFAULT `"[]"` | Lista de actividades incluidas |
| `notas` | String | DEFAULT `""` | Observaciones adicionales |
| `estado` | String | DEFAULT `'Pendiente'` | `Pendiente` / `Confirmada` / `Cancelada` |
| `total` | String | DEFAULT `""` | Total calculado en COP |
| `creadoEn` | DateTime | DEFAULT `now()` | Timestamp de creación |
| `creadoPor` | String? | FK → User | Usuario que creó la reserva |

### Alojamiento

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | String (CUID) | Identificador único |
| `nombre` | String | Nombre del alojamiento |
| `icon` | String | Emoji representativo |
| `capacidad` | String | Ej: `"2-4 personas"` |
| `precio` | Int | Precio por noche en COP |
| `descripcion` | String | Descripción detallada |
| `disponible` | Boolean | `true` = habilitado para reservar |

### Actividad

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | String (CUID) | Identificador único |
| `nombre` | String | Nombre de la actividad |
| `icon` | String | Emoji representativo |
| `duracion` | String | Ej: `"2 horas"`, `"Libre"` |
| `precio` | Int | Precio por persona en COP |
| `descripcion` | String | Descripción detallada |

### Diagrama de relaciones

```
User (1) ──────────────────── (N) Reserva
         creadoPor (opcional)
```

---

## 5. API REST

> Todas las rutas protegidas requieren el header:
> ```
> Authorization: Bearer <access_token>
> ```

### Autenticación

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/login` | Público | Login, retorna `accessToken` + `user` |
| `GET` | `/api/auth/me` | Protegido | Devuelve perfil del usuario actual |

**Body de login:**
```json
{
  "email": "admin@sanjosetatacoa.com",
  "password": "admin123"
}
```

**Respuesta de login:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "clx...",
    "email": "admin@sanjosetatacoa.com",
    "nombre": "Administrador",
    "rol": "ADMIN"
  }
}
```

### Reservas (todas protegidas)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/reservas` | Listar reservas (filtros: `?q=texto&estado=Confirmada`) |
| `GET` | `/api/reservas/stats` | Contadores: total, confirmadas, pendientes, canceladas |
| `GET` | `/api/reservas/:id` | Detalle de una reserva por ID |
| `POST` | `/api/reservas` | Crear nueva reserva |
| `PATCH` | `/api/reservas/:id/estado` | Cambiar estado de la reserva |
| `DELETE` | `/api/reservas/:id` | Eliminar reserva permanentemente |

**Body de creación (POST /api/reservas):**
```json
{
  "huesped": "María Gómez",
  "email": "maria@email.com",
  "telefono": "+57 300 000 0000",
  "alojamiento": "Cabaña El Cactus",
  "llegada": "2026-06-01",
  "salida": "2026-06-03",
  "personas": 2,
  "actividades": ["Observación de estrellas", "Cabalgata por el desierto"],
  "notas": "Aniversario de bodas",
  "precioPorNoche": 180000
}
```

**Body de cambio de estado (PATCH /api/reservas/:id/estado):**
```json
{ "estado": "Confirmada" }
```

**Respuesta de stats:**
```json
{
  "total": 15,
  "confirmadas": 8,
  "pendientes": 5,
  "canceladas": 2
}
```

### Catálogos (acceso público)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/alojamientos` | Listar todos los alojamientos |
| `GET` | `/api/actividades` | Listar todas las actividades |
| `GET` | `/api/health` | Health check del servidor |

> 📖 Documentación interactiva disponible en `http://localhost:4000/api/docs` (Swagger UI).

---

## 6. Historias de usuario

### Épica: Autenticación y Seguridad

---

#### HU-01 — Inicio de sesión

| Campo | Detalle |
|---|---|
| **ID** | HU-01 |
| **Como** | Administrador de la finca |
| **Quiero** | Ingresar con mi correo y contraseña |
| **Para** | Acceder al panel de gestión de reservas y datos del hotel |
| **Prioridad** | Alta |
| **Estado** | ✅ Completada |

**Criterios de aceptación:**
- El sistema valida correo y contraseña contra la base de datos.
- Si las credenciales son correctas devuelve un token JWT.
- El token se almacena en `localStorage` y se envía en cada petición protegida.
- Si las credenciales son incorrectas muestra mensaje de error claro.
- La sesión persiste al recargar la página (rehydratación desde `localStorage`).

---

#### HU-02 — Cierre de sesión

| Campo | Detalle |
|---|---|
| **ID** | HU-02 |
| **Como** | Administrador |
| **Quiero** | Cerrar mi sesión desde el sidebar |
| **Para** | Proteger el acceso cuando dejo el equipo desatendido |
| **Prioridad** | Alta |
| **Estado** | ✅ Completada |

**Criterios de aceptación:**
- Al hacer clic en "Cerrar sesión" se elimina el token del almacenamiento local.
- Se redirige automáticamente a la pantalla de login.
- Las rutas protegidas son inaccesibles sin autenticación.

---

### Épica: Gestión de Reservas

---

#### HU-03 — Ver listado de reservas

| Campo | Detalle |
|---|---|
| **ID** | HU-03 |
| **Como** | Administrador |
| **Quiero** | Ver una tabla con todas las reservas del sistema |
| **Para** | Tener visibilidad del estado de ocupación de la finca |
| **Prioridad** | Alta |
| **Estado** | ✅ Completada |

**Criterios de aceptación:**
- La tabla muestra: código, huésped, alojamiento, llegada, salida, personas, estado y total.
- Las reservas se ordenan por fecha de creación descendente.
- Se puede buscar por nombre de huésped, correo o alojamiento.
- Se puede filtrar por estado: `Pendiente`, `Confirmada`, `Cancelada`.
- Se muestra el total de resultados encontrados.

---

#### HU-04 — Crear nueva reserva

| Campo | Detalle |
|---|---|
| **ID** | HU-04 |
| **Como** | Administrador |
| **Quiero** | Completar un formulario con los datos del huésped y su estadía |
| **Para** | Registrar la reserva en el sistema y tener trazabilidad |
| **Prioridad** | Alta |
| **Estado** | ✅ Completada |

**Criterios de aceptación:**
- El formulario incluye: nombre, correo, teléfono, alojamiento, llegada, salida, personas, actividades y notas.
- Se calcula automáticamente el total (`noches × precio/noche`).
- El sistema asigna automáticamente un código único (R-001, R-002…).
- El estado inicial es siempre `Pendiente`.
- Validación de campos requeridos antes de enviar.
- Mensaje de éxito con el código y total asignados.

---

#### HU-05 — Cambiar estado de reserva

| Campo | Detalle |
|---|---|
| **ID** | HU-05 |
| **Como** | Administrador |
| **Quiero** | Cambiar el estado de una reserva a Confirmada o Cancelada |
| **Para** | Reflejar la situación real de cada huésped |
| **Prioridad** | Alta |
| **Estado** | ✅ Completada |

**Criterios de aceptación:**
- Desde la tabla de reservas se puede confirmar o cancelar cada registro.
- Se muestra un modal de confirmación antes de aplicar el cambio.
- El modal indica el código de reserva y el estado destino.
- La fila se actualiza visualmente tras confirmar.
- Indicador visual por color: verde = Confirmada, ámbar = Pendiente, rojo = Cancelada.

---

#### HU-06 — Eliminar reserva

| Campo | Detalle |
|---|---|
| **ID** | HU-06 |
| **Como** | Administrador |
| **Quiero** | Eliminar una reserva creada por error |
| **Para** | Mantener la base de datos limpia y sin registros inválidos |
| **Prioridad** | Media |
| **Estado** | ✅ Completada |

**Criterios de aceptación:**
- Botón de eliminar disponible en la columna de acciones.
- Modal de confirmación con advertencia de que la acción es irreversible.
- La reserva desaparece del listado tras confirmar.
- El listado se actualiza automáticamente.

---

### Épica: Catálogo de Servicios

---

#### HU-07 — Ver catálogo de alojamientos

| Campo | Detalle |
|---|---|
| **ID** | HU-07 |
| **Como** | Administrador |
| **Quiero** | Ver las opciones de hospedaje con precios y disponibilidad |
| **Para** | Seleccionar el alojamiento correcto al crear una reserva |
| **Prioridad** | Media |
| **Estado** | ✅ Completada |

**Criterios de aceptación:**
- Se muestran todas las opciones en tarjetas visuales.
- Cada tarjeta incluye: nombre, ícono, descripción, capacidad, precio/noche y estado de disponibilidad.
- Los alojamientos no disponibles muestran badge `No disponible`.
- Acceso rápido al formulario de nueva reserva desde esta pantalla.

---

#### HU-08 — Ver catálogo de actividades

| Campo | Detalle |
|---|---|
| **ID** | HU-08 |
| **Como** | Administrador |
| **Quiero** | Ver el listado de actividades con duración y precios |
| **Para** | Informarme e incluirlas en las reservas de los huéspedes |
| **Prioridad** | Media |
| **Estado** | ✅ Completada |

**Criterios de aceptación:**
- Se muestran todas las actividades en tarjetas.
- Cada tarjeta incluye: nombre, ícono, descripción, duración y precio por persona.
- Las actividades se pueden incluir en el formulario de nueva reserva mediante checkboxes.

---

### Épica: Dashboard

---

#### HU-09 — Ver indicadores KPI

| Campo | Detalle |
|---|---|
| **ID** | HU-09 |
| **Como** | Administrador |
| **Quiero** | Ver un resumen rápido del estado de las reservas al iniciar |
| **Para** | Tomar decisiones informadas sobre la ocupación de la finca |
| **Prioridad** | Alta |
| **Estado** | ✅ Completada |

**Criterios de aceptación:**
- El dashboard muestra 4 KPIs: total, confirmadas, pendientes y canceladas.
- Los datos se cargan desde la API al iniciar la sesión.
- Accesos rápidos (tiles) a todas las secciones del portal.
- Hero banner con imagen de la finca y saludo personalizado al usuario logueado.

---

### Épica: Galería

---

#### HU-10 — Ver galería de imágenes

| Campo | Detalle |
|---|---|
| **ID** | HU-10 |
| **Como** | Administrador o visitante |
| **Quiero** | Ver fotos del desierto, alojamientos y actividades |
| **Para** | Conocer y mostrar el aspecto visual de la finca |
| **Prioridad** | Baja |
| **Estado** | ✅ Completada |

**Criterios de aceptación:**
- Mosaico de imágenes con diseño responsivo.
- Filtros por categoría: Paisaje, Finca, Alojamientos, Actividades, Eventos.
- Lightbox al hacer clic en cada foto con nombre, categoría y botón de cierre.
- Panel inferior con información de contacto de la finca.

---

### Épica: Asistente IA

---

#### HU-11 — Consultar asistente virtual

| Campo | Detalle |
|---|---|
| **ID** | HU-11 |
| **Como** | Administrador o recepcionista |
| **Quiero** | Chatear con un asistente inteligente sobre la finca |
| **Para** | Responder dudas de turistas y clientes de forma rápida |
| **Prioridad** | Media |
| **Estado** | ✅ Completada |

**Criterios de aceptación:**
- Interfaz de chat con burbujas diferenciadas para usuario y asistente.
- El asistente conoce precios, alojamientos, actividades, horarios y cómo llegar.
- Sugerencias rápidas de preguntas frecuentes.
- Indicador visual de "escribiendo…" mientras el modelo responde.
- Botón para limpiar la conversación.
- En caso de error de conexión muestra mensaje amigable con el WhatsApp de contacto.

---

## 7. Datos iniciales (seed)

Ejecutar con:
```bash
# Con Docker
docker exec tatacoa-backend npm run db:seed

# En local
cd backend && npm run db:seed
```

### Usuario administrador

| Campo | Valor |
|---|---|
| Email | `admin@sanjosetatacoa.com` |
| Contraseña | `admin123` |
| Nombre | Administrador |
| Rol | ADMIN |

### Alojamientos

| Nombre | Capacidad | Precio/noche | Disponible |
|---|---|---|---|
| Cabaña El Cactus | 2–4 personas | $180.000 COP | ✅ |
| Glamping Estrella del Desierto | 2 personas | $220.000 COP | ✅ |
| Habitación Familiar | 4–6 personas | $250.000 COP | ✅ |
| Habitación Doble | 2 personas | $120.000 COP | ✅ |
| Camping Bajo las Estrellas | 1–3 personas | $45.000 COP | ✅ |
| Cúpula Astronómica | 2 personas | $280.000 COP | ❌ |

### Actividades

| Nombre | Duración | Precio/persona |
|---|---|---|
| Observación de estrellas | 2 horas | $35.000 COP |
| Cabalgata por el desierto | 1.5 horas | $40.000 COP |
| Caminata guiada | 3 horas | $30.000 COP |
| Ordeño de vacas | 45 min | $20.000 COP |
| Tour Desierto Rojo | 4 horas | $55.000 COP |
| Tour Desierto Gris | 4 horas | $55.000 COP |
| Piscina y relax | Libre | $15.000 COP |
| Restaurante típico huilense | Servicio diario | Desde $25.000 COP |

---

## 8. Variables de entorno

### Backend — `backend/.env`

| Variable | Ejemplo | Descripción |
|---|---|---|
| `DATABASE_URL` | `postgresql://tatacoa:tatacoa123@database:5432/tatacoa` | URL de conexión a PostgreSQL |
| `JWT_SECRET` | `sjt-secret-super-seguro` | Clave para firmar tokens JWT |
| `JWT_EXPIRES_IN` | `1d` | Duración del token |
| `PORT` | `4000` | Puerto del servidor NestJS |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | URL del frontend para CORS |
| `NODE_ENV` | `development` | Entorno de ejecución |

> ⚠️ `DATABASE_URL` usa el hostname `database` que solo existe dentro de Docker. En desarrollo local cámbialo a `localhost`.

### Frontend — `frontend/.env`

| Variable | Ejemplo | Descripción |
|---|---|---|
| `VITE_API_URL` | `http://localhost:4000` | URL base del backend |
| `VITE_GEMINI_API_KEY` | `AIzaSy...` | Clave de API de Google Gemini |

> 🔴 **Nunca subas el archivo `.env` al repositorio.** Usa `.env.example` como plantilla pública.

---

## 9. Estructura del proyecto

```
proyecto san jose tatacoa/
├── docker-compose.yml
│
├── backend/
│   ├── .env
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── prisma/
│   │   ├── schema.prisma          ← Modelos: User, Reserva, Alojamiento, Actividad
│   │   ├── seed.ts                ← Datos iniciales
│   │   └── migrations/            ← Historial de migraciones SQL (PostgreSQL)
│   └── src/
│       ├── main.ts                ← Bootstrap: Helmet, CORS, ValidationPipe, Swagger
│       ├── app.module.ts          ← Módulo raíz con APP_GUARD JWT global
│       ├── app.controller.ts      ← GET /api/health (público)
│       ├── prisma/
│       │   ├── prisma.module.ts   ← @Global()
│       │   └── prisma.service.ts  ← PrismaClient + OnModuleInit
│       ├── common/
│       │   ├── decorators/
│       │   │   ├── public.decorator.ts        ← @Public()
│       │   │   └── current-user.decorator.ts  ← @CurrentUser()
│       │   └── guards/
│       │       └── jwt-auth.guard.ts          ← Extiende AuthGuard('jwt')
│       └── modules/
│           ├── auth/              ← Login, JWT strategy, getMe
│           ├── reservas/          ← CRUD completo + stats + filtros
│           ├── alojamientos/      ← Catálogo público
│           └── actividades/       ← Catálogo público
│
└── frontend/
    ├── .env
    ├── .dockerignore
    ├── Dockerfile
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx               ← Punto de entrada: BrowserRouter + AuthProvider
        ├── App.tsx                ← Rutas con RequireAuth guard
        ├── index.css              ← Estilos globales y componentes
        ├── styles/
        │   └── design-system.css  ← Variables CSS y tokens de diseño
        ├── api/
        │   └── http.ts            ← Cliente HTTP con JWT Bearer automático
        ├── auth/
        │   └── AuthContext.tsx    ← Contexto: login / logout / rehydrate
        ├── components/
        │   └── Layout.tsx         ← Sidebar + Outlet + chip de usuario
        └── pages/
            ├── Login.tsx          ← Pantalla de inicio de sesión
            ├── Home.tsx           ← Dashboard con KPIs y accesos rápidos
            ├── Reservas.tsx       ← Tabla con filtros, búsqueda y acciones
            ├── NuevaReserva.tsx   ← Formulario de creación de reserva
            ├── Alojamientos.tsx   ← Catálogo de alojamientos
            ├── Actividades.tsx    ← Catálogo de actividades
            ├── Galeria.tsx        ← Mosaico + lightbox + filtros de categoría
            └── Asistente.tsx      ← Chat con Google Gemini 1.5 Flash
```

---

## 10. Despliegue con Docker

### Requisitos

| Herramienta | Versión mínima |
|---|---|
| Docker | 24+ |
| Docker Compose | v2.20+ |

### Levantar en producción

```bash
# 1. Clonar el repositorio
git clone <repo-url> sjt && cd sjt

# 2. Configurar variables de entorno
#    (editar los archivos según tu entorno)
nano backend/.env
nano frontend/.env

# 3. Construir y levantar los contenedores
docker compose up -d --build

# 4. Cargar datos iniciales
docker exec tatacoa-backend npm run db:seed

# 5. Acceder al portal
#    → http://localhost:5173
```

### Comandos útiles

```bash
# Ver estado de los contenedores
docker compose ps

# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend
docker compose logs -f frontend

# Detener los contenedores
docker compose down

# Eliminar todo (contenedores + volumen de BD)
docker compose down -v

# Reconstruir las imágenes tras cambios de código
docker compose up -d --build
```

### Scripts disponibles — Backend

| Script | Comando | Acción |
|---|---|---|
| `start:dev` | `nest start --watch` | Desarrollo con hot reload |
| `build` | `nest build` | Compilar TypeScript |
| `start:prod` | `node dist/src/main` | Iniciar en producción |
| `db:push` | `prisma db push` | Sincronizar schema con la BD |
| `db:seed` | `ts-node prisma/seed.ts` | Cargar datos iniciales |

### Desarrollo local sin Docker

```bash
# Backend
cd backend
npm install
# Cambiar DATABASE_URL a localhost en .env
npm run db:push
npm run db:seed
npm run start:dev    # → http://localhost:4000/api

# Frontend (otra terminal)
cd frontend
npm install
npm run dev          # → http://localhost:5173
```

---

## 11. Bugs identificados y mejoras pendientes

### 🐛 Bugs críticos

| ID | Archivo | Descripción | Impacto |
|---|---|---|---|
| BUG-01 | `pages/Actividades.tsx` | La función `fmtCOP` está declarada con `throw new Error('Function not implemented.')`. Los precios de todas las actividades no se muestran y el componente lanza un error en tiempo de ejecución. | 🔴 Alto |
| BUG-02 | `frontend/.env` | La API Key de Gemini (`VITE_GEMINI_API_KEY`) está expuesta en el frontend. Al hacer `vite build`, queda embebida en el bundle JS que cualquier usuario puede inspeccionar en el navegador. | 🔴 Crítico |
| BUG-03 | `backend/.env` | La `DATABASE_URL` apunta al hostname `database` que solo existe dentro de la red Docker. En desarrollo local sin Docker falla la conexión a la base de datos. | 🟡 Medio |
| BUG-04 | `pages/Asistente.tsx` | Los imports de `lucide-react` (`Send`, `Bot`, `User`, `Loader2`, `Sparkles`, `MessageSquare`) y `motion/react` están importados pero no se usan en el JSX. Genera warnings en el build y aumenta el bundle innecesariamente. | 🟢 Bajo |

**Corrección de BUG-01** — reemplazar en `Actividades.tsx`:
```typescript
// ❌ Código actual (bugueado)
function fmtCOP(precio: number): import("react").ReactNode {
    throw new Error('Function not implemented.');
}

// ✅ Corrección
function fmtCOP(precio: number): string {
  return `$${precio.toLocaleString('es-CO')}`;
}
```

**Corrección de BUG-02** — mover la llamada a Gemini al backend:
```
frontend → POST /api/asistente { mensaje } → backend → Gemini API
```
Así la API Key nunca sale del servidor.

**Corrección de BUG-03** — usar variables distintas por entorno:
```env
# Desarrollo local
DATABASE_URL="postgresql://tatacoa:tatacoa123@localhost:5432/tatacoa"

# Docker (usar el hostname del servicio)
DATABASE_URL="postgresql://tatacoa:tatacoa123@database:5432/tatacoa"
```

### 💡 Mejoras recomendadas

- Implementar HTTPS en producción con certificado SSL (Let's Encrypt).
- Añadir paginación a la tabla de reservas para conjuntos grandes de datos.
- Mover la llamada a Gemini al backend (proxy) para no exponer la API Key en el cliente.
- Agregar roles diferenciados (`ADMIN` vs `RECEPCIONISTA`) con permisos distintos.
- Implementar envío de correo electrónico de confirmación al huésped.
- Añadir exportación de reservas a Excel o PDF.
- Implementar tests unitarios y de integración (Jest + Supertest).
- Agregar gestión de imágenes de alojamientos desde el panel (upload).
- Integrar pasarela de pagos (PSE, Wompi) para reservas en línea.
- Configurar CI/CD con GitHub Actions para despliegue automático.

---

## 12. Glosario

| Término | Definición |
|---|---|
| **JWT** | JSON Web Token — token de autenticación stateless firmado con clave secreta. |
| **ORM** | Object-Relational Mapping — abstracción para interactuar con la BD sin SQL directo. |
| **CUID** | Collision-resistant Unique ID — identificador seguro generado automáticamente por Prisma. |
| **SPA** | Single Page Application — aplicación que carga una sola página HTML y navega sin recargas completas. |
| **Seed** | Proceso de poblar la base de datos con datos iniciales para desarrollo o demo. |
| **HU** | Historia de Usuario — descripción funcional de una necesidad desde la perspectiva del usuario. |
| **KPI** | Key Performance Indicator — indicador clave de rendimiento (ej: total de reservas). |
| **CORS** | Cross-Origin Resource Sharing — política que controla qué orígenes pueden acceder a la API. |
| **Check-in** | Llegada del huésped y acceso a las instalaciones (2:00 pm por defecto). |
| **Check-out** | Salida del huésped y desalojo de las instalaciones (12:00 m por defecto). |
| **Glamping** | Camping de lujo que combina naturaleza con comodidades de hotel. |
| **Finca hotel** | Establecimiento turístico rural que ofrece hospedaje en ambiente de hacienda o finca. |
| **Bearer token** | Esquema de autenticación HTTP donde el token JWT se envía en el header `Authorization`. |
| **Guard** | Clase de NestJS que decide si una petición puede continuar según reglas de autenticación/autorización. |
| **Decorator** | Función de TypeScript que añade metadatos o comportamiento a clases, métodos o parámetros. |

---

## 13. Contacto

| Dato | Valor |
|---|---|
| **Nombre** | San José Tatacoa – Finca Hotel Turística |
| **Ubicación** | Vereda La Victoria, Villavieja, Huila, Colombia |
| **Teléfono / WhatsApp** | +57 320 849 1270 |
| **Correo** | contacto@sanjosetatacoa.com |
| **Instagram** | [@sanjose_tatacoa](https://www.instagram.com/sanjose_tatacoa/) |
| **Facebook** | [sanjosetatacoa](https://www.facebook.com/sanjosetatacoa) |
| **Sitio web** | [sanjosetatacoa.com](https://sanjosetatacoa.com) |

---

*Documentación generada para la versión 1.0 del proyecto · Mayo 2026*  
*Stack: NestJS · Prisma · PostgreSQL · React · Vite · Docker*
