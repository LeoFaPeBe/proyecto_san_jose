# 🌵 San José Tatacoa — Portal de Reservas

Portal web fullstack para la gestión de reservas, alojamientos y actividades de la **Finca Hotel Turística San José Tatacoa**, ubicada en Villavieja, Huila, Colombia.

---

## 🗂 Estructura del proyecto

```
sjt/
├── backend/                  ← API REST (NestJS + Prisma + SQLite)
│   ├── prisma/
│   │   ├── schema.prisma     ← Modelos de BD
│   │   └── seed.ts           ← Datos iniciales
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── common/
│   │   │   ├── decorators/   ← @Public(), @CurrentUser()
│   │   │   └── guards/       ← JwtAuthGuard (global)
│   │   ├── modules/
│   │   │   ├── auth/         ← Login, JWT strategy
│   │   │   ├── reservas/     ← CRUD reservas
│   │   │   ├── alojamientos/ ← Catálogo alojamientos
│   │   │   └── actividades/  ← Catálogo actividades
│   │   └── prisma/           ← PrismaService global
│   ├── Dockerfile            ← Producción (multistage)
│   ├── Dockerfile.dev        ← Desarrollo (hot reload)
│   └── .env                  ← Variables de entorno
│
├── frontend/                 ← SPA (React 19 + Vite + TypeScript)
│   ├── src/
│   │   ├── api/http.ts       ← Cliente HTTP con JWT Bearer
│   │   ├── auth/             ← AuthContext (login/logout/refresh)
│   │   ├── components/       ← Layout, sidebar
│   │   └── pages/
│   │       ├── Login.tsx
│   │       ├── Home.tsx      ← Dashboard con KPIs
│   │       ├── Reservas.tsx  ← Tabla con filtros y acciones
│   │       ├── NuevaReserva.tsx
│   │       ├── Alojamientos.tsx
│   │       ├── Actividades.tsx
│   │       ├── Galeria.tsx
│   │       └── Asistente.tsx ← Chat con Claude AI
│   ├── Dockerfile            ← Producción (Vite build + Nginx)
│   ├── Dockerfile.dev        ← Desarrollo (Vite dev server)
│   └── nginx.conf            ← SPA routing + proxy /api → backend
│
├── docker-compose.yml        ← Producción
├── docker-compose.dev.yml    ← Desarrollo
├── Makefile                  ← Atajos de comandos
├── .env.example              ← Plantilla de variables
└── README.md
```

---

## 🚀 Opción 1 — Docker (recomendado)

### Requisitos

| Herramienta | Versión mínima |
|---|---|
| Docker | 24+ |
| Docker Compose | v2.20+ |

### Producción en 3 pasos

```bash
# 1. Clonar y entrar al proyecto
git clone https://github.com/LeoFaPeBe/proyecto_san_jose.git

cd proyecto_san_jose

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env y cambiar JWT_SECRET por una cadena segura

# 3. Levantar todo
docker compose up -d
```

Servicios disponibles:

| Servicio | URL |
|---|---|
| 🌐 Frontend (React) | http://localhost |
| 🔌 API (NestJS) | http://localhost:4000/api |
| 📖 Swagger | http://localhost:4000/api/docs |

> La base de datos SQLite se crea automáticamente en el volumen `db_data` al primer arranque.

### Cargar datos de ejemplo (seed)

```bash
docker exec sjt-backend sh -c "npx prisma db seed"
```

### Comandos útiles con Docker

```bash
# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend
docker compose logs -f frontend

# Detener los contenedores
docker compose down

# Reconstruir imágenes (tras cambios en código)
docker compose build --no-cache

# Eliminar todo (contenedores + imágenes + volumen de BD)
docker compose down -v --rmi all
```

---

## 🛠 Opción 2 — Desarrollo local (sin Docker)

### Requisitos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 20+ |
| npm | 10+ |

### Backend

```bash
cd backend

# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# El archivo .env ya viene con valores para desarrollo

# 3. Crear la base de datos y aplicar el schema
npm run db:push

# 4. Cargar datos iniciales (usuarios, alojamientos, actividades, reservas de ejemplo)
npm run db:seed

# 5. Iniciar en modo desarrollo (hot reload)
npm run start:dev
```

API disponible en: `http://localhost:4000/api`  
Swagger UI: `http://localhost:4000/api/docs`

### Frontend

```bash
# En otra terminal
cd frontend

# 1. Instalar dependencias
npm install

# 2. Iniciar Vite dev server
npm run dev
```

Frontend disponible en: `http://localhost:5173`

---

## 🐳 Opción 3 — Docker en modo desarrollo (hot reload)

```bash
# Levanta ambos servicios con volúmenes montados
docker compose -f docker-compose.dev.yml up --build

# O con make:
make dev
```

| Servicio | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| Backend (NestJS) | http://localhost:4000/api |

Los cambios en el código se reflejan automáticamente sin reconstruir la imagen.

---

## 🔑 Credenciales de acceso

| Campo | Valor |
|---|---|
| **Email** | `admin@sanjosetatacoa.com` |
| **Contraseña** | `admin123` |

> Cambia la contraseña desde Prisma Studio o la API después de iniciar por primera vez.

---

## 📡 API — Endpoints principales

Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer <access_token>
```

### Auth
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Login, retorna JWT | ❌ Público |
| GET | `/api/auth/me` | Perfil del usuario actual | ✅ |

### Reservas
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/reservas` | Listar (filtros: `?q=nombre&estado=Confirmada`) | ✅ |
| GET | `/api/reservas/stats` | Contadores por estado | ✅ |
| GET | `/api/reservas/:id` | Detalle de una reserva | ✅ |
| POST | `/api/reservas` | Crear nueva reserva | ✅ |
| PATCH | `/api/reservas/:id/estado` | Cambiar estado | ✅ |
| DELETE | `/api/reservas/:id` | Eliminar reserva | ✅ |

### Catálogo
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/alojamientos` | Listar todos los alojamientos | ❌ Público |
| GET | `/api/actividades` | Listar todas las actividades | ❌ Público |
| GET | `/api/health` | Health check | ❌ Público |

---

## 🧱 Arquitectura técnica

### Backend (NestJS)
- **Guard JWT global** — todas las rutas requieren token salvo las marcadas con `@Public()`
- **Prisma ORM** — SQLite en desarrollo, fácil de cambiar a PostgreSQL en producción
- **Swagger** — documentación automática en `/api/docs`
- **Helmet + CORS** — seguridad HTTP configurada

### Frontend (React + Vite)
- **AuthContext** — gestión de sesión con rehydratación automática desde localStorage
- **React Router v7** — navegación con guard `RequireAuth`
- **Cliente HTTP** — `api()` con inyección automática del token Bearer y manejo de errores
- **Design System** — paleta, tipografía, componentes y espaciado consistentes (basado en jikkopuntos)
- **Asistente IA** — integración directa con la API de Claude de Anthropic

### Docker
- **Multistage builds** — imágenes slim de producción
- **Nginx** — sirve el SPA y hace proxy de `/api/` al backend
- **Volumen persistente** — la base de datos SQLite sobrevive reinicios del contenedor

---

## ⚙️ Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `DATABASE_URL` | URL de conexión a SQLite | `file:./dev.db` |
| `JWT_SECRET` | Secreto para firmar tokens | ⚠️ Cambiar en producción |
| `JWT_EXPIRES_IN` | Duración del token | `1d` |
| `PORT` | Puerto del servidor | `4000` |
| `FRONTEND_ORIGIN` | URL del frontend (CORS) | `http://localhost:5173` |
| `NODE_ENV` | Entorno | `development` |

### Frontend (`frontend/.env`)

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:4000/api` |

> En producción con Docker, el frontend usa `/api` (ruta relativa) y nginx hace el proxy.

---

## 📦 Scripts disponibles

### Backend
```bash
npm run start:dev    # Desarrollo con hot reload
npm run build        # Compilar TypeScript
npm run start:prod   # Iniciar compilado
npm run db:push      # Aplicar schema a la BD
npm run db:seed      # Cargar datos iniciales
npm run db:studio    # Abrir Prisma Studio (GUI de BD)
```

### Frontend
```bash
npm run dev          # Vite dev server
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # ESLint
```

### Makefile (raíz del proyecto)
```bash
make dev             # Docker desarrollo
make prod            # Docker producción
make build           # Construir imágenes
make down            # Detener contenedores
make logs            # Ver logs
make seed            # Seed en contenedor dev
make clean           # Limpiar todo
make install         # npm install en backend y frontend
make local-backend   # Backend sin Docker
make local-frontend  # Frontend sin Docker
```

---

## 🗄 Modelos de base de datos

### User
```
id · email (único) · passwordHash · nombre · rol · isActive · createdAt
```

### Reserva
```
id · codigo (único, ej: R-001) · huesped · email · telefono
alojamiento · llegada · salida · personas · actividades (JSON)
notas · estado · total · creadoEn · creadoPor (→ User)
```

### Alojamiento
```
id · nombre · icon · capacidad · precio · descripcion · disponible
```

### Actividad
```
id · nombre · icon · duracion · precio · descripcion
```

---

## 🔄 Migrar de SQLite a PostgreSQL (producción)

1. Actualizar `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Cambiar `DATABASE_URL` en `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/sjt_db"
```

3. Aplicar el schema:
```bash
npx prisma migrate dev --name init
npm run db:seed
```

4. Agregar el servicio `db` en `docker-compose.yml`:
```yaml
db:
  image: postgres:16-alpine
  environment:
    POSTGRES_USER: sjt
    POSTGRES_PASSWORD: sjt_pass
    POSTGRES_DB: sjt_db
  volumes:
    - pg_data:/var/lib/postgresql/data
```

---

## 📞 Contacto

**San José Tatacoa — Finca Hotel Turística**  
📍 Vereda La Victoria, Villavieja, Huila, Colombia  
📞 +57 320 849 1270  
✉️ contacto@sanjosetatacoa.com  
📱 [@sanjose_tatacoa](https://instagram.com/sanjose_tatacoa)  
🌐 [sanjosetatacoa.com](https://sanjosetatacoa.com)

---

*Portal desarrollado con NestJS · Prisma · React · Vite · Docker*