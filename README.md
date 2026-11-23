# Autos — TP 2 Full Stack (MDW 2026)

Aplicación web full stack de una **concesionaria de autos**: un catálogo público de autos 0 km y usados, y un panel de administración donde los usuarios con rol `admin` dan de alta, modifican y eliminan autos.

Trabajo Práctico 2 de **Metodologías y Desarrollos Web** (UAI, turno mañana) — Franco Rossetti.

## Links

| | URL |
| --- | --- |
| Frontend (Render Static Site) | `https://<completar>.onrender.com` |
| Backend (Render Web Service) | `https://<completar>.onrender.com` |

## Usuarios de prueba

| Rol | Email | Contraseña |
| --- | --- | --- |
| admin | `admin@autos.com` | `<completar>` |
| user | `user@autos.com` | `<completar>` |

## Entidad elegida: `Car` (auto)

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `brand` | texto | Marca (obligatorio) |
| `modelName` | texto | Modelo (obligatorio) |
| `year` | número | Año, entre 1950 y el año próximo |
| `price` | número | Precio en pesos, ≥ 0 |
| `mileage` | número | Kilometraje, ≥ 0 |
| `entryDate` | fecha | Fecha de ingreso a la concesionaria |
| `used` | booleano | `true` = usado, `false` = 0 km |
| `engine` | texto | Motor (ej: `2.0 16V Dual VVT-i`) |
| `horsepower` | número | Potencia en CV |
| `transmission` | texto (enum) | `manual` o `automatica` |
| `fuel` | texto (enum) | `nafta`, `diesel`, `hibrido`, `electrico` o `gnc` |
| `bodyType` | texto (enum) | `sedan`, `hatchback`, `suv`, `pickup`, `coupe` o `utilitario` |
| `traction` | texto (enum) | `4x2` o `4x4` |
| `doors` | número | Cantidad de puertas (2 a 5) |
| `color` | texto | Color |
| `features` | lista de textos | Equipamiento destacado (máx. 20 ítems) |
| `description` | texto | Descripción opcional (máx. 500) |
| `imageUrl` | texto | URL o ruta de la foto (opcional) |
| `active` | booleano | Baja lógica: `false` = dado de baja (no aparece en el catálogo) |

## Stack y arquitectura

- **Backend:** Node.js, Express 5, TypeScript, Mongoose, Zod, Better Auth (email/contraseña + GitHub, plugin `admin` para roles).
- **Base de datos:** MongoDB Atlas. Los autos se guardan con Mongoose en la colección `cars`; Better Auth guarda usuarios, sesiones y cuentas en `user`, `session` y `account`.
- **Frontend:** React 19, Vite, TypeScript, React Router, React Hook Form + Zod, Redux Toolkit + RTK Query, Tailwind CSS.
- **Deploy:** Render (backend como Web Service, frontend como Static Site).

```
backend/src
├── server.ts             # Express: monta Better Auth en /api/auth y la API en /api
├── config/db.ts          # Conexión a MongoDB con Mongoose
├── lib/auth.ts           # Configuración de Better Auth
├── middlewares/          # authMiddleware, requireRole, validateBody (Zod)
├── models/Car.ts         # Schema de Mongoose
├── schemas/car.schema.ts # Schemas de Zod (crear, editar, listar)
├── services/             # Lógica de negocio y acceso a Mongo
├── controllers/          # Capa HTTP: status codes y JSON
└── routes/               # Método + ruta -> middlewares -> controller

frontend/src
├── lib/                  # axios (/api), cliente de Better Auth
├── store/                # Redux store + RTK Query (carsApi)
├── router/               # Rutas públicas, privadas y por rol (ProtectedRoute)
├── pages/                # Home, CarDetail, Login, Register, Admin, Users, Profile...
└── components/           # CarCard, CarForm, ConfirmModal, Pagination
```

**Flujo de un alta:** formulario (`CarForm`, validado con React Hook Form + Zod) → `useCreateCarMutation` (RTK Query) → `POST /api/cars` → `authMiddleware` (401 sin sesión) → `requireRole("admin")` (403 si es `user`) → `validateBody(createCarSchema)` (400 si los datos no son válidos) → `createCar` (controller) → `cars.service` → MongoDB → `201 Created`. La mutation invalida el tag `Cars` y RTK Query vuelve a pedir el listado, así que el cambio se ve enseguida en el catálogo público.

## Endpoints de la API

| Método | Ruta | Rol requerido | Descripción |
| --- | --- | --- | --- |
| GET | `/api/cars` | público | Lista autos activos. Query: `page`, `limit`, `search`, `used`, `fuel`, `transmission`, `bodyType`, `sortBy`, `sortOrder`. Un admin puede enviar `includeInactive=true` para ver también los dados de baja |
| GET | `/api/cars/:id` | público | Detalle de un auto (404 si no existe) |
| POST | `/api/cars` | admin | Crea un auto (201) |
| PUT / PATCH | `/api/cars/:id` | admin | Modifica un auto |
| DELETE | `/api/cars/:id` | admin | Baja lógica (`active = false`, responde 200) |
| DELETE | `/api/cars/:id?hard=true` | admin | Baja física: lo borra de la base (204) |
| * | `/api/auth/*` | — | Endpoints de Better Auth (registro, login, logout, sesión, GitHub, admin) |

Códigos de respuesta: `201` creado, `400` datos inválidos (con detalle por campo), `401` sin sesión, `403` sin permisos, `404` no encontrado.

## Funcionalidades

**Obligatorias**
- Registro, login con email/contraseña y con GitHub, logout. Todo usuario nuevo recibe el rol `user`.
- Catálogo público y detalle de cada auto.
- Panel `/admin` con el ABM, protegido por rol: sin sesión redirige a `/login`; un `user` ve "Sin permisos".
- Formularios con React Hook Form + Zod mostrando los errores de validación.
- La sesión se mantiene al recargar (`useSession()`).

**Opcionales implementados**
- Paginación, búsqueda y filtro (0 km / usados) resueltos en el backend (`?page=&limit=&search=&used=`).
- Página de admin para cambiar roles (`/admin/usuarios`, con `authClient.admin.setRole`).
- Modal de confirmación antes de eliminar, con baja lógica, baja física y reactivación.

## Cómo correrlo en local

Requisitos: **Node.js 20 o superior** y una base de **MongoDB Atlas** (o cualquier MongoDB con replica set).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # completar las variables (ver tabla de abajo)
npm run seed           # carga autos de ejemplo
npm run dev            # http://localhost:3000
```

### 2. Frontend (en otra terminal)

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173 (el proxy de Vite manda /api al backend)
```

### 3. Crear el primer admin

Registrarse desde la app (queda con rol `user`) y después ejecutar:

```bash
cd backend
npm run make-admin -- admin@autos.com
```

A partir de ahí, ese admin puede cambiar el rol de otros usuarios desde `/admin/usuarios`.

## Variables de entorno (`backend/.env`)

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del backend (local: `3000`; Render lo define solo) |
| `NODE_ENV` | `development` o `production` |
| `MONGODB_URI` | Cadena de conexión de MongoDB Atlas |
| `BETTER_AUTH_SECRET` | Secreto para firmar las sesiones. Generar con `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `BETTER_AUTH_URL` | URL pública del **frontend** (local: `http://localhost:5173`) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Credenciales de la OAuth App de GitHub. Callback: `<BETTER_AUTH_URL>/api/auth/callback/github` |

El frontend no necesita variables de entorno: llama siempre a `/api` en su mismo origen.

## Deploy en Render

**Backend — Web Service**
- Root directory: `backend`
- Build command: `npm install --include=dev && npm run build`
- Start command: `npm start`
- Variables: las de la tabla anterior, con `NODE_ENV=production` y `BETTER_AUTH_URL=https://<frontend>.onrender.com`.

**Frontend — Static Site**
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Redirects/Rewrites (en este orden):
  1. `/api/*` → `https://<backend>.onrender.com/api/*` — **Rewrite**
  2. `/*` → `/index.html` — **Rewrite** (para que F5 funcione en cualquier ruta)

## Créditos de las imágenes

Las fotos de los autos de ejemplo están en `frontend/public/cars/` y se usan solo con fines educativos:

- Toyota Corolla y Volkswagen Amarok — **Wikimedia Commons** (licencias CC BY / CC BY-SA): `Toyota_Corolla_Hybrid_(E210)_IMG_4338.jpg` y `VW_Amarok_3.0_TDI_4Motion_Style_(II)_–_f_05072025.jpg`.
- Resto de los modelos — fotos de publicaciones de concesionarias, usadas como ejemplo ilustrativo.

Si un auto no tiene imagen (o la URL falla), la app muestra un banner de color según la marca.

**GitHub OAuth App de producción:** Homepage URL `https://<frontend>.onrender.com` y callback `https://<frontend>.onrender.com/api/auth/callback/github`.
