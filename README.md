# ⌚ ZARR | Premium Watch Buying Platform
> A premium e-commerce platform for luxury watches built with the MERN Stack.

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)

</div>

## 🚀 Overview
ZARR is a professional and premium watch store where you can discover and purchase
luxury timepieces for yourself or as a gift for someone special.

## ✨ Features
- [x] Landing / Hero Page
- [x] Product Collection Page (frontend)
- [x] About Page
- [x] Journals / Blog Page (frontend)
- [x] Contact Page with responsive three-section layout
- [x] Shared navigation, footer, dark-green visual theme, and Font Awesome icons
- [ ] Product Detail Page
- [ ] Newsletter subscription handling
- [ ] Cart & Wishlist
- [ ] User Authentication (JWT)
- [ ] Checkout & Orders

## 🛠️ Tech Stack
| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React, CSS3                   |
| Backend  | Node.js, Express, MongoDB     |
| Auth     | JWT                           |

## ⚙️ Getting Started
```bash
git clone https://github.com/Adil-12-Hassan/CodeAlpha-E-Commerce.git
cd CodeAlpha-E-Commerce
npm install
npm start
```

## 🗂️ Folder Structure
```
CodeAlpha-E-Commerce/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
│
├── client/
│   └── src/
│       ├── assets/          # Images, icons, logos
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route-level page components
│       ├── styles/          # CSS files for components and pages
│       ├── App.jsx
│       ├── global.css
│       └── index.jsx
│
├── .gitignore
├── package.json
└── README.md
```

## 🔌 Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🌐 API Endpoints
Backend integration remains to be implemented. API endpoints will be documented here once the Express and MongoDB services are connected.

## 📊 Project Status
### Completed
- [x] Project setup & folder structure
- [x] Hero / Landing page
- [x] Collection, About, Journals, and Contact frontend pages
- [x] Responsive page styling and shared dark-green theme
- [x] Production build verification

### Remaining
- [ ] Product detail route and product data
- [ ] Backend API (Express + MongoDB)
- [ ] Connect contact form and newsletter form to the backend
- [ ] Cart, wishlist, authentication, checkout, and order workflows
- [ ] Complete the Articles route
- [ ] Deployment configuration

## 📄 License
MIT © Adil Hassan