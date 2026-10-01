# ZARR Backend (Express + MongoDB)

## 1. Install & configure

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — local Mongo (`mongodb://127.0.0.1:27017/zarr`) or an Atlas connection string.
- `JWT_SECRET` / `JWT_ADMIN_SECRET` — two **different** long random strings. Generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
- `CLIENT_URL` — your frontend's origin (`http://localhost:3000` in dev), used for CORS + sockets.
- `ADMIN_BOOTSTRAP_EMAIL` / `ADMIN_BOOTSTRAP_PASSWORD` — only used once, see below.

## 2. Create your first admin account

Public registration (`/api/auth/register`) can **only** ever create `role: "user"` accounts — it's hardcoded, not a bug. The only way to get an admin is this script:

```bash
node src/scripts/createAdmin.js
```

Run it again any time with a different `ADMIN_BOOTSTRAP_EMAIL` to promote another existing user to admin.

## 3. Run it

```bash
npm run dev     # nodemon, auto-restart
npm start       # plain node
```

`GET /api/health` should return `{ "status": "ok" }`.

## How the admin "session" behaves (per your GCUF-portal request)

Three layers, stacked:

1. **Server-side hard cap** — admin JWTs expire after `JWT_ADMIN_EXPIRES_IN` (default 2h), signed with a separate secret from user tokens. Even a copied/leaked token stops working after that.
2. **Browser-close = logout** — the frontend stores the admin token in `sessionStorage`, not `localStorage`. That's a browser behavior, not something we coded: sessionStorage is wiped the moment the tab/browser closes. Regular users still use `localStorage` (7-day persistence) since normal shoppers expect to stay logged in.
3. **Idle timeout** — if the admin tab stays open but nobody touches the mouse/keyboard for 30 minutes, the frontend logs the admin out on its own (`AuthContext.jsx`, `ADMIN_IDLE_TIMEOUT_MS`).

On top of all three: every issued token carries the user's `tokenVersion`. Changing password or calling `/api/auth/logout` bumps it, which invalidates *every* token already out there for that account immediately — not just the one the browser deletes.

## Live admin dashboard updates

Socket.IO is wired in (`src/sockets/index.js`). Connect from the frontend with the current token:

```js
import { io } from "socket.io-client";
const socket = io(process.env.REACT_APP_BACKEND_URL.replace("/api", ""), {
  auth: { token },
});
socket.on("order:new", (order) => { /* prepend to admin order list */ });
socket.on("order:updated", (order) => { /* patch status in place */ });
socket.on("message:new", (msg) => { /* prepend to admin inbox */ });
```

Admin sockets auto-join an `"admins"` room server-side based on their JWT; regular users join `user:<their id>` so they could also get pushed live status updates on their own orders later if you want that on the user dashboard too — not wired into any UI yet, just available.

## Routes implemented (all under `/api`)

- `auth`: register, login, admin/login, logout, me
- `products`: list/get (public), create/update/delete (admin)
- `orders`: place (user), my (user), list-all (admin), get one, cancel (user, only while Pending/Confirmed), status (admin)
- `users`: me (get/update/password), wishlist toggle, addresses, admin list/remove
- `messages`: send (public/guest OK), list/read/delete (admin)

## Not done yet — still your call

- Payment gateway integration (COD only, enforced server-side — `Order.paymentMethod` only accepts `"Cash on Delivery"` even if the frontend sent something else)
- Image upload/storage for products (currently expects a plain URL string)
- Socket.IO wired into the actual admin dashboard components (server side is ready; frontend components still poll via `orderAPI.getAll()`/`messageAPI.getAll()` — swap to the events above whenever you want true push updates)
