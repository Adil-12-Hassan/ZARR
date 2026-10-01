# ZARR

ZARR is a full-stack ecommerce application for a curated home and lifestyle storefront. It combines a responsive React shopping experience with a REST API and MongoDB-backed services for accounts, products, orders, and customer messages.

The repository contains two independently run applications:

- `client/` — React storefront, customer account area, and admin dashboard.
- `server/` — Express API, MongoDB models, JWT authentication, and Socket.IO server.

## Highlights

- Product collection browsing and product detail views.
- Cart and checkout flow with order creation.
- Customer registration and login, order history, profile settings, addresses, and wishlist.
- Separate admin login and protected dashboard for managing products, orders, users, and contact messages.
- Role-aware API authorization, password hashing, rate limits on sensitive endpoints, input sanitization, and security headers.
- Persistent customer sessions and tab-scoped admin sessions, with server-side token invalidation on logout.
- Contact form submissions available for administrators to review.

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | React 19, React Router, Zustand, Socket.IO Client |
| Backend | Node.js, Express, Socket.IO |
| Database | MongoDB with Mongoose |
| Authentication | JWT, bcryptjs |
| Security | Helmet, express-rate-limit, express-mongo-sanitize |

## Requirements

- Node.js and npm.
- MongoDB running locally or an accessible MongoDB Atlas database.
- A modern browser.

## Run Locally

Open two terminals from the repository root.

### 1. Configure the API

Create `server/.env` from the example file.

PowerShell:

```powershell
Copy-Item server/.env.example server/.env
```

macOS/Linux:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and set the MongoDB connection string, frontend origin, unique JWT secrets, and admin bootstrap credentials. See [Environment Configuration](#environment-configuration) before using this outside local development.

Install dependencies and start the API:

```bash
cd server
npm install
npm run dev
```

The API defaults to `http://localhost:5000`. Check that it is running at `http://localhost:5000/api/health`.

### 2. Create the first administrator

With the API environment configured, run the bootstrap script once from the `server/` directory:

```bash
node src/scripts/createAdmin.js
```

The script uses `ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD`. It creates an admin account when that email is new, or promotes the existing account with that email to the admin role. Choose a unique, private password before running it. Do not publish the credentials or commit `.env`.

### 3. Start the storefront

In a second terminal:

```bash
cd client
npm install
npm start
```

The development server is available at `http://localhost:3000`. The client defaults to the API URL `http://localhost:5000/api`; to use another API origin, define `REACT_APP_BACKEND_URL` in the client's environment, including the `/api` path.

## Environment Configuration

The backend loads configuration from `server/.env`.

| Variable | Purpose | Local default/example |
| --- | --- | --- |
| `PORT` | API port | `5000` |
| `NODE_ENV` | Runtime mode | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/zarr` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:3000` |
| `JWT_SECRET` | Signing key for customer tokens | Replace with a strong random secret |
| `JWT_ADMIN_SECRET` | Separate signing key for admin tokens | Replace with a different strong random secret |
| `JWT_USER_EXPIRES_IN` | Customer token lifetime | `7d` |
| `JWT_ADMIN_EXPIRES_IN` | Admin token lifetime | `2h` |
| `ADMIN_BOOTSTRAP_EMAIL` | Email used by the admin setup script | Set to your chosen admin email |
| `ADMIN_BOOTSTRAP_PASSWORD` | Password used by the admin setup script | Set a unique password (8+ characters in development, 12+ in production) |

Generate a random secret with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Generate two different values for the JWT secrets. In production, use HTTPS, strong unique secrets, a production MongoDB database, and a `CLIENT_URL` matching the deployed frontend origin. Never use the example secrets or bootstrap password in a deployed environment.

## Application Areas

### Storefront

The public experience includes the home page, collection, journals, about and contact pages, customer login and registration, and checkout. Product browsing is available without signing in; placing an order requires authentication.

### Customer account

Signed-in customers can view their dashboard and orders, maintain profile details and delivery addresses, and manage a wishlist. Customer sessions are stored in browser local storage and restored on page reload while the API token remains valid.

### Admin dashboard

Administrators sign in separately at `/admin/login`. Protected dashboard pages cover overview metrics, product management, order management, user management, messages, and settings. Admin tokens use a separate signing secret and expiry, are stored in session storage, and are cleared when the tab session ends. The client also applies a 30-minute inactivity timeout.

## API Overview

All HTTP endpoints are mounted below `/api`. Protected endpoints require a bearer token in the `Authorization` header. Admin-only endpoints additionally require an administrator account.

| Area | Routes | Access |
| --- | --- | --- |
| Health | `GET /health` | Public |
| Authentication | `POST /auth/register`, `POST /auth/login`, `POST /auth/admin/login`, `GET /auth/me`, `POST /auth/logout` | Public login/register; authenticated session routes |
| Products | `GET /products`, `GET /products/:id`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id` | Reads public; writes admin |
| Orders | `POST /orders`, `GET /orders/my`, `GET /orders/:id`, `PATCH /orders/:id/cancel`, `GET /orders`, `PATCH /orders/:id/status` | Customer or admin depending on route |
| Customer accounts | `GET /users/me`, `PUT /users/me`, `PUT /users/me/password`, wishlist and address routes | Authenticated customer |
| User administration | `GET /users`, `DELETE /users/:id` | Admin |
| Messages | `POST /messages`, `GET /messages`, `PATCH /messages/:id/read`, `DELETE /messages/:id` | Submission public; management admin |

## Project Structure

```text
client/
	public/                 Static public files
	src/
		api/                   HTTP and Socket.IO client helpers
		components/            Storefront and dashboard UI components
		context/               Authentication, cart, and order contexts
		pages/                 Store, customer, and admin pages
		routes/                Application routes and access guards
		store/                 Client-side state stores
		styles/                Page and component stylesheets
server/
	src/
		config/                Database connection setup
		controllers/           Request handlers
		middleware/            Authentication, rate limits, and errors
		models/                Mongoose data models
		routes/                REST endpoint definitions
		scripts/               Admin bootstrap utility
		sockets/               Socket.IO server setup
		utils/                 Shared server utilities
```

## Build and Test

Create a production client build:

```bash
cd client
npm run build
```

Run the client test runner:

```bash
cd client
npm test
```

Start the API without file watching:

```bash
cd server
npm start
```

## Current Scope and Notes

- Orders currently support Cash on Delivery; an online payment provider is not integrated.
- Product images are represented by image URLs; an upload and media-storage service is not included.
- The backend initializes Socket.IO and supports authenticated socket connections. Live events are not yet integrated throughout the admin dashboard UI.
- The client uses Create React App (`react-scripts`) for development and production builds.

## Security

- Keep `server/.env` and all production credentials private; commit only `.env.example` files with safe placeholders.
- Use different, high-entropy values for `JWT_SECRET` and `JWT_ADMIN_SECRET`.
- Never expose admin bootstrap credentials in source control, screenshots, or public documentation.
- If bootstrap credentials are no longer needed after creating the administrator, remove them from the deployed environment.
- Deploy the frontend and API over HTTPS and restrict database network access to trusted services.
