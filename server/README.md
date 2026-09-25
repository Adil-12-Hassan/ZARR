# ZARR Watch Store - Backend API

A full REST API for the ZARR premium watch e-commerce platform, built with **Node.js**, **Express**, and **MongoDB**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v18+ |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | bcryptjs |
| Environment Config | dotenv |
| Cross-Origin | cors |
| Dev Server | nodemon |

---

## Project Structure

```
server/
├── config/
│   └── db.js                  MongoDB connection
├── controllers/
│   ├── authController.js      Register, login, admin login
│   ├── productController.js   Product CRUD
│   ├── orderController.js     Place orders, manage orders
│   ├── userController.js      Profile, wishlist, addresses
│   └── messageController.js   Contact form messages
├── middleware/
│   ├── auth.js                JWT verification → req.user
│   └── adminOnly.js           Admin role guard
├── models/
│   ├── User.js                User schema (role, wishlist, addresses)
│   ├── Product.js             Product schema (auto status from stock)
│   ├── Order.js               Order schema (ZR-XXXX ID, item snapshots)
│   └── Message.js             Contact message schema
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── userRoutes.js
│   └── messageRoutes.js
├── utils/
│   └── generateToken.js       JWT token generator
├── .env                       Environment variables (never commit)
├── .gitignore
├── package.json
└── server.js                  Entry point
```

---

## Getting Started

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment

Create a `.env` file in the `server/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/zarr_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

> For production, replace `MONGO_URI` with your MongoDB Atlas connection string.

### 3. Run the server

```bash
# Development (auto-restarts on save)
npm run dev

# Production
npm start
```

You should see:
```
🚀 ZARR server running on http://localhost:5000
✅ MongoDB connected: localhost
```

---

## Features

### Authentication
- User registration with duplicate email/username check
- Secure login with JWT token response
- Separate admin login endpoint with role verification
- Passwords hashed with bcryptjs (never stored plain)
- JWT tokens expire in 7 days

### Products
- Public product listing with optional section and search filters
- Full CRUD for admin (create, read, update, delete)
- Stock-based status auto-computed (`Active` / `Out of stock`)
- Supports variants (e.g. "Gold / Black")

### Orders
- Authenticated users can place orders from checkout
- Item data (name, price, image) snapshotted at purchase time
- Human-readable order ID generated automatically (`ZR-XXXX`)
- Users can view their own order history
- Admin can view all orders and update status
- Order statuses: `Received` → `Processing` → `Delivered` / `Cancelled`

### Users
- Get and update own profile (username, phone)
- Secure password change (requires current password)
- Wishlist toggle — add or remove products with one call
- Save and delete shipping addresses
- Admin can view and delete all users

### Messages
- Public contact form submission
- Admin can view all messages (newest first)
- Mark messages as read / unread
- Delete messages

---

## API Reference

Base URL: `http://localhost:5000/api`

> **Protected routes** require this header:
> ```
> Authorization: Bearer YOUR_JWT_TOKEN
> ```

---

### Auth Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login, returns token |
| POST | `/auth/admin/login` | Public | Admin login (role checked) |

---

### Product Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/products` | Public | Get all products |
| GET | `/products?section=Men's Watches` | Public | Filter by section |
| GET | `/products?search=rolex` | Public | Search by name |
| GET | `/products/:id` | Public | Get single product |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |

---

### Order Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/orders` | Protected | Place a new order |
| GET | `/orders/my` | Protected | Get current user's orders |
| GET | `/orders` | Admin | Get all orders |
| GET | `/orders/:id` | Protected | Get single order |
| PATCH | `/orders/:id/status` | Admin | Update order status |

---

### User Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users/me` | Protected | Get own profile |
| PUT | `/users/me` | Protected | Update username/phone |
| PUT | `/users/me/password` | Protected | Change password |
| POST | `/users/me/wishlist/:productId` | Protected | Toggle wishlist item |
| POST | `/users/me/addresses` | Protected | Add shipping address |
| DELETE | `/users/me/addresses/:addressId` | Protected | Delete address |
| GET | `/users` | Admin | Get all users |
| DELETE | `/users/:id` | Admin | Delete a user |

---

### Message Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/messages` | Public | Submit contact message |
| GET | `/messages` | Admin | Get all messages |
| PATCH | `/messages/:id/read` | Admin | Mark message as read |
| DELETE | `/messages/:id` | Admin | Delete message |

---

## Thunder Client Tests

### Step 1 — Register
```
POST http://localhost:5000/api/auth/register
```
```json
{
  "username": "adilhassan",
  "email": "adil@gmail.com",
  "password": "123456"
}
```
**Expected:** `201` — returns `token` and `user` object.

---

### Step 2 — Login
```
POST http://localhost:5000/api/auth/login
```
```json
{
  "email": "adil@gmail.com",
  "password": "123456"
}
```
**Expected:** `200` — copy the `token` for all protected requests.

---

### Step 3 — Make yourself admin

Open **MongoDB Compass** → `zarr_db` → `users` collection → find your user → change `role` from `"user"` to `"admin"` → Save.

---

### Step 4 — Admin Login
```
POST http://localhost:5000/api/auth/admin/login
```
```json
{
  "email": "adil@gmail.com",
  "password": "123456"
}
```
**Expected:** `200` — copy this admin token separately.

---

### Step 5 — Create a Product
```
POST http://localhost:5000/api/products
Authorization: Bearer ADMIN_TOKEN
```
```json
{
  "name": "ZARR Chronos Elite",
  "section": "Men's Watches",
  "price": 45000,
  "stock": 10,
  "description": "A premium timepiece with sapphire crystal glass.",
  "image": "https://via.placeholder.com/300",
  "variants": ["Silver / Black", "Gold / Brown"]
}
```
**Expected:** `201` — copy the `_id` as `PRODUCT_ID`.

---

### Step 6 — Get All Products
```
GET http://localhost:5000/api/products
```
**Expected:** `200` — array of products.

---

### Step 7 — Update Product
```
PUT http://localhost:5000/api/products/PRODUCT_ID
Authorization: Bearer ADMIN_TOKEN
```
```json
{
  "price": 48000,
  "stock": 0
}
```
**Expected:** `200` — status auto-changes to `"Out of stock"`.

---

### Step 8 — Place an Order
```
POST http://localhost:5000/api/orders
Authorization: Bearer USER_TOKEN
```
```json
{
  "items": [
    {
      "product": "PRODUCT_ID",
      "name": "ZARR Chronos Elite",
      "image": "https://via.placeholder.com/300",
      "variant": "Silver / Black",
      "price": 45000,
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "fullName": "Adil Hassan",
    "email": "adil@gmail.com",
    "phone": "03001234567",
    "address": "Street 5, Block A",
    "apartment": "",
    "city": "Lahore",
    "province": "Punjab",
    "postalCode": "54000",
    "country": "Pakistan"
  },
  "subtotal": 45000,
  "discount": 0,
  "shipping": 500,
  "tax": 0,
  "total": 45500,
  "paymentMethod": "Cash on Delivery"
}
```
**Expected:** `201` — returns order with `orderId: "ZR-XXXX"`. Copy `_id` as `ORDER_ID`.

---

### Step 9 — Get My Orders
```
GET http://localhost:5000/api/orders/my
Authorization: Bearer USER_TOKEN
```
**Expected:** `200` — array of your orders.

---

### Step 10 — Update Order Status
```
PATCH http://localhost:5000/api/orders/ORDER_ID/status
Authorization: Bearer ADMIN_TOKEN
```
```json
{
  "status": "Processing"
}
```
**Expected:** `200` — order status updated.

---

### Step 11 — Get My Profile
```
GET http://localhost:5000/api/users/me
Authorization: Bearer USER_TOKEN
```
**Expected:** `200` — full user profile.

---

### Step 12 — Update Profile
```
PUT http://localhost:5000/api/users/me
Authorization: Bearer USER_TOKEN
```
```json
{
  "username": "adil_updated",
  "phone": "03009876543"
}
```
**Expected:** `200` — updated user object.

---

### Step 13 — Change Password
```
PUT http://localhost:5000/api/users/me/password
Authorization: Bearer USER_TOKEN
```
```json
{
  "currentPassword": "123456",
  "newPassword": "newpass123"
}
```
**Expected:** `200` — success message.

---

### Step 14 — Toggle Wishlist
```
POST http://localhost:5000/api/users/me/wishlist/PRODUCT_ID
Authorization: Bearer USER_TOKEN
```
**Expected:** `200` — wishlist array (call again to remove).

---

### Step 15 — Send Contact Message
```
POST http://localhost:5000/api/messages
```
```json
{
  "name": "Adil Hassan",
  "email": "adil@gmail.com",
  "phone": "03001234567",
  "subject": "Order Inquiry",
  "message": "I wanted to ask about my recent order."
}
```
**Expected:** `201` — success message. Copy `_id` as `MESSAGE_ID`.

---

### Step 16 — Get All Messages (Admin)
```
GET http://localhost:5000/api/messages
Authorization: Bearer ADMIN_TOKEN
```
**Expected:** `200` — array of all messages.

---

### Step 17 — Mark Message as Read
```
PATCH http://localhost:5000/api/messages/MESSAGE_ID/read
Authorization: Bearer ADMIN_TOKEN
```
**Expected:** `200` — message with `isRead: true`.

---

### Step 18 — Delete Product
```
DELETE http://localhost:5000/api/products/PRODUCT_ID
Authorization: Bearer ADMIN_TOKEN
```
**Expected:** `200` — deletion confirmation.

---

## Error Reference

| Status | Meaning |
|--------|---------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request — missing or invalid fields |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — not an admin |
| `404` | Resource not found |
| `409` | Conflict — email or username already exists |
| `500` | Server error |

---

## Updates

### v1.0.0
- Initial backend release
- Auth system: register, login, admin login with JWT
- Product CRUD with auto stock-based status
- Order system with ZR-XXXX ID generation and item snapshots
- User profile, password change, wishlist toggle, address management
- Contact message system with read/unread tracking
- Role-based access control (user / admin)
- CommonJS module system compatible with Node.js v26

---

## Frontend

The frontend (React + Zustand) lives in the `/client` folder.
Next step is connecting each frontend context and page to these API endpoints.

---

## Author

**Adil Hassan** — SkyeVault  
Built as part of the ZARR premium watch e-commerce platform.