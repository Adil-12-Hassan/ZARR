# ZARR Storefront

The customer-facing React storefront for ZARR, including the watch collection, checkout, customer accounts, and admin interface.

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Router](https://img.shields.io/badge/Routing-React_Router-CA4245?logo=reactrouter&logoColor=white)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)

## ✨ What’s inside

- Responsive storefront and collection browsing.
- Cart, Cash on Delivery checkout, and customer account pages.
- Protected admin dashboard for catalog, order, user, and message management.
- Editorial Journal backed by MongoDB, with public article pages and admin draft/publish CRUD.
- Route-level page loading, optimized local imagery, and Vercel deep-link support.

## 🚀 Start locally

From this directory:

```bash
npm install
npm start
```

Open `http://localhost:3000`. The app defaults to `http://localhost:5000/api` for its backend; start the API from `../server/` as described in the [server guide](../server/README.md).

To use another backend, set `REACT_APP_BACKEND_URL` in the client environment, including `/api`, for example:

```env
REACT_APP_BACKEND_URL=https://api.example.com/api
```

Local Socket.IO product updates are enabled by default during development. For production, set `REACT_APP_ENABLE_REALTIME=true` only when the backend runs on a persistent Node.js host that starts the Socket.IO server.

## ☁️ Deploy to Vercel

Create a Vercel project with this directory as its **Root Directory**. The `vercel.json` file provides SPA rewrites for direct links and adds cache and security headers. Set `REACT_APP_BACKEND_URL` in the Vercel project’s environment variables before building.

The API is a separate deployment. See the [server README](../server/README.md) for its environment requirements.

## 🧰 Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the development server |
| `npm run build` | Create a production build in `build/` |
| `npm test` | Run the React test runner |

## 🗂️ Source map

| Path | Purpose |
| --- | --- |
| `src/api/` | HTTP and Socket.IO client helpers |
| `src/components/` | Storefront, account, and admin components |
| `src/context/` | Authentication and order contexts |
| `src/pages/` | Store, account, checkout, and admin pages |
| `src/routes/` | Client-side routing and protected routes |
| `src/store/` | Persistent cart state |
| `src/styles/` | Page and component styles |
| `public/` | App shell, manifest, favicon, and crawler rules |

## 🔒 Notes

- Do not commit `.env` files or expose API credentials in browser code.
- Values prefixed with `REACT_APP_` are included in the browser build; never put secrets in them.
- Customer sessions use browser storage; the admin interface uses tab-scoped storage.
