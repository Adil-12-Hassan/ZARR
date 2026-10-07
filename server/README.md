# ZARR API

The Express and MongoDB service behind the ZARR storefront. It handles customer accounts, the watch catalog, orders, and customer messages.

![Node.js](https://img.shields.io/badge/Runtime-Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/API-Express-111111?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Data-MongoDB-47A248?logo=mongodb&logoColor=white)

## ✨ Included

- JWT authentication with separate customer and admin signing secrets.
- MongoDB models for users, products, orders, and messages.
- Role-protected admin routes, rate limits, input sanitization, and Helmet security headers.
- Stock checks and server-calculated totals when creating orders.
- Socket.IO events for local development on a persistent Node.js server.

## 🚀 Run locally

From the repository root, copy the example environment file:

```powershell
Copy-Item server/.env.example server/.env
```

Then start the API:

```bash
cd server
npm install
npm run dev
```

The server listens on port `5000` by default. Confirm it is running at `http://localhost:5000/api/health`.

## 🔐 Configure the environment

Set these in `server/.env` for local development or in the hosting provider’s environment for deployment.

| Variable | Purpose |
| --- | --- |
| `PORT` | API port; defaults to `5000` |
| `NODE_ENV` | Runtime mode; use `production` when deployed |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_URL` | Allowed frontend origin(s); comma-separated in production. Development also allows localhost on port `3000`. |
| `JWT_SECRET` | Customer token signing secret |
| `JWT_ADMIN_SECRET` | Different signing secret for admin tokens |
| `JWT_USER_EXPIRES_IN` | Customer token lifetime; defaults to `7d` |
| `JWT_ADMIN_EXPIRES_IN` | Admin token lifetime; defaults to `2h` |
| `ADMIN_BOOTSTRAP_EMAIL` | Email for the initial admin account |
| `ADMIN_BOOTSTRAP_PASSWORD` | Password for the initial admin account |

MongoDB stores application data independently from the API process. Restarting or redeploying the backend should not erase users, products, orders, or messages. Use a persistent MongoDB service (such as MongoDB Atlas) and keep `MONGO_URI` pointed at the same database and database name across deployments. Do not use an in-process or temporary database for production data.

Generate separate JWT secrets with:

```bash
node --input-type=module -e "import { randomBytes } from 'node:crypto'; console.log(randomBytes(48).toString('hex'))"
```

Production startup requires HTTPS frontend origins and distinct JWT secrets of at least 32 characters. Never commit `.env` or use example credentials in production.

## 👑 Create the first admin

Set the two `ADMIN_BOOTSTRAP_*` values, then run once from the `server/` directory:

```bash
node src/scripts/createAdmin.js
```

The script creates an admin account or promotes the matching existing account. Public registration always creates a regular customer account.

## ☁️ Deploy

For a Vercel API deployment, create a separate project with `server/` as its **Root Directory**. Add `MONGO_URI`, `CLIENT_URL`, `JWT_SECRET`, and `JWT_ADMIN_SECRET` to the project environment. The Express app is exported for Vercel, and database connections are opened lazily for API requests; `/api/health` remains a lightweight liveness check.

The local startup command also attaches Socket.IO to the HTTP server. The Vercel app export currently serves the REST API without that Socket.IO server, so leave `REACT_APP_ENABLE_REALTIME` unset in the client for this deployment. For Socket.IO updates, run the API on a persistent Node.js host.

## 📡 Routes

All routes are prefixed with `/api`. Protected routes require a bearer token in the `Authorization` header.

| Area | Endpoints |
| --- | --- |
| Health | `GET /api/health` |
| Auth | `POST /api/auth/register`, `/login`, `/admin/login`; `GET /api/auth/me`; `POST /api/auth/logout` |
| Products | `GET /api/products`, `GET /api/products/:id`; admin `POST`, `PUT`, and `DELETE` routes |
| Orders | `POST /api/orders`, `GET /api/orders/my`, admin list and status routes, customer order and cancellation routes |
| Accounts | Profile, password, wishlist, and address routes under `/api/users` |
| Messages | Public `POST /api/messages`; admin list, read, and delete routes |

## 🛡️ Session behavior

- Customer tokens use `JWT_SECRET` and persist in browser storage.
- Admin tokens use `JWT_ADMIN_SECRET`, expire sooner, and are stored in session storage.
- Logout and password changes increment `tokenVersion`, which invalidates previously issued tokens for that account.
- The admin interface also applies a 30-minute inactivity timeout.

## 📌 Current scope

- Orders support Cash on Delivery only; no payment provider is connected.
- Product image fields accept URLs; image upload and storage are not included.
- Socket.IO events are emitted by local server processes but are not fully consumed by the admin interface.
