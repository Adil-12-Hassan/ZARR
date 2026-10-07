# ZARR - Precision, Worn Daily

**A premium watch storefront built for a considered shopping experience.** ZARR pairs a React storefront and customer dashboard with an Express API, MongoDB, and a separate admin workspace.

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel&logoColor=white)

## ✨ The experience

- Browse the watch collection, filter and sort products, and manage a cart.
- Create an account, check out with Cash on Delivery, and manage orders, addresses, and a wishlist.
- Use the protected admin workspace to manage products, orders, users, and customer messages.
- Publish ZARR Journal articles from the admin workspace, with title-based slugs and optional links to original posts.
- Authenticate with JWTs, hashed passwords, role checks, rate limits, input sanitization, and security headers.

## 🧭 Project map

| Folder | What lives there |
| --- | --- |
| [`client/`](client/README.md) | React storefront, account pages, admin interface, and Vercel SPA config |
| [`server/`](server/README.md) | Express API, MongoDB models, authentication, and Socket.IO setup |

## 🚀 Run locally

**You’ll need:** Node.js with npm, MongoDB, and a modern browser.

### 1. Configure and start the API

From the repository root, copy the example configuration:

```powershell
Copy-Item server/.env.example server/.env
```

```bash
cd server
npm install
npm run dev
```

Set `MONGO_URI`, `CLIENT_URL`, and two distinct JWT secrets in `server/.env`. Use a persistent MongoDB database: restarting the API should not delete database records. The API starts at `http://localhost:5000`; its health endpoint is `http://localhost:5000/api/health`.

### 2. Create the first administrator

Set `ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD` in `server/.env`, then run this once from `server/`:

```bash
node src/scripts/createAdmin.js
```

Keep the bootstrap credentials private. Public registration creates customer accounts only.

### 3. Start the storefront

In another terminal:

```bash
cd client
npm install
npm start
```

The storefront runs at `http://localhost:3000` and defaults to `http://localhost:5000/api`. Set `REACT_APP_BACKEND_URL` in the client environment to use a different API URL; include the `/api` path.

## ☁️ Deploy

- **Frontend:** deploy `client/` as its own Vercel project. The included [`client/vercel.json`](client/vercel.json) supports client-side routes and sets asset caching and security headers.
- **API:** deploy `server/` as a separate Vercel project with `server/` as the project root, or run it on a persistent Node.js host. Configure `MONGO_URI`, `CLIENT_URL`, `JWT_SECRET`, and `JWT_ADMIN_SECRET` in the host’s environment. `CLIENT_URL` can contain comma-separated HTTPS origins.
- **Realtime:** Socket.IO is enabled for local development and a persistent Node.js API host. The current Vercel serverless export serves REST routes only; leave `REACT_APP_ENABLE_REALTIME` unset for that deployment.

## 🔐 Environment variables

The API reads these values from `server/.env` locally and from the deployment environment in production.

| Variable | Purpose | Local example |
| --- | --- | --- |
| `PORT` | API listen port | `5000` |
| `NODE_ENV` | Runtime mode | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/zarr` |
| `CLIENT_URL` | Allowed frontend origin(s) | `http://localhost:3000` |
| `JWT_SECRET` | Customer token signing secret | Generate a unique random value |
| `JWT_ADMIN_SECRET` | Admin token signing secret | Generate a different random value |
| `JWT_USER_EXPIRES_IN` | Customer token lifetime | `7d` |
| `JWT_ADMIN_EXPIRES_IN` | Admin token lifetime | `2h` |
| `ADMIN_BOOTSTRAP_EMAIL` | First admin account email | Your admin email |
| `ADMIN_BOOTSTRAP_PASSWORD` | First admin account password | A private, strong password |

Generate each JWT secret with:

```bash
node --input-type=module -e "import { randomBytes } from 'node:crypto'; console.log(randomBytes(48).toString('hex'))"
```

Never commit `.env` files or use example credentials in production.

## 🛠️ Useful commands

```bash
# Storefront production build
cd client && npm run build

# Storefront test runner
cd client && npm test

# API without file watching
cd server && npm start
```

## 📡 API at a glance

All endpoints are under `/api`. Protected routes require a bearer token in the `Authorization` header.

| Area | Routes |
| --- | --- |
| Health | `GET /api/health` |
| Authentication | `/api/auth/register`, `/api/auth/login`, `/api/auth/admin/login`, `/api/auth/me`, `/api/auth/logout` |
| Products | `GET /api/products`, `GET /api/products/:id`; admin create, update, and delete routes |
| Orders | Create, list, view, cancel, and update order status under `/api/orders` |
| Accounts | Profile, password, wishlist, and address routes under `/api/users` |
| Messages | Public `POST /api/messages`; admin list, read, and delete routes |

## 📌 Current scope

- Checkout currently supports Cash on Delivery; no payment gateway is connected.
- Product photos use image URLs; image upload and media hosting are not included.
- The API has Socket.IO events, but the admin interface does not yet consume all of them.
- The client uses Create React App and React Router. Public page metadata updates in the browser after the app loads.

## 🛡️ Security notes

- Keep production secrets and database credentials private.
- Use separate, high-entropy customer and admin JWT secrets.
- Restrict database network access to trusted services and serve both apps over HTTPS.
- Remove admin bootstrap credentials from the deployment environment after creating the initial admin if they are no longer needed.
