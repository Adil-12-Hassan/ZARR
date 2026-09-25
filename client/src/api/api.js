// All API calls go through this file.
// Base URL points to your Express server.

const BASE_URL = process.env.BACKEND_URL || "http://localhost:5000/api";

// - Helper: get the stored token
function getToken() {
    const raw = localStorage.getItem("zarr_auth_user");
    if (!raw) return null;
    try {
        return JSON.parse(raw).token || null;
    } catch {
        return null;
    }
}

// Core request function
async function request(path, options = {}) {
    const token = getToken(); const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    }; const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    }); const data = await res.json(); if (!res.ok) {
        // Throw the server's error message so components can show it
        throw new Error(data.message || "Something went wrong");
    } return data;
}

// Auth
export const authAPI = {
    register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    adminLogin: (body) => request("/auth/admin/login", { method: "POST", body: JSON.stringify(body) }),
};

// Products
export const productAPI = {
    getAll: (query = "") => request(`/products${query}`),
    getById: (id) => request(`/products/${id}`),
    create: (body) => request("/products", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    remove: (id) => request(`/products/${id}`, { method: "DELETE" }),
};

// Orders
export const orderAPI = {
    place: (body) => request("/orders", { method: "POST", body: JSON.stringify(body) }),
    getMine: () => request("/orders/my"),
    getAll: () => request("/orders"),
    getById: (id) => request(`/orders/${id}`),
    updateStatus: (id, status) =>
        request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};

// Users
export const userAPI = {
    getMe: () => request("/users/me"),
    updateMe: (body) => request("/users/me", { method: "PUT", body: JSON.stringify(body) }),
    changePassword: (body) => request("/users/me/password", { method: "PUT", body: JSON.stringify(body) }),
    toggleWishlist: (productId) => request(`/users/me/wishlist/${productId}`, { method: "POST" }),
    addAddress: (body) => request("/users/me/addresses", { method: "POST", body: JSON.stringify(body) }),
    deleteAddress: (addressId) => request(`/users/me/addresses/${addressId}`, { method: "DELETE" }),
    getAll: () => request("/users"),
    remove: (id) => request(`/users/${id}`, { method: "DELETE" }),
};

// - Messages
export const messageAPI = {
    send: (body) => request("/messages", { method: "POST", body: JSON.stringify(body) }),
    getAll: () => request("/messages"),
    markRead: (id) => request(`/messages/${id}/read`, { method: "PATCH" }),
    remove: (id) => request(`/messages/${id}`, { method: "DELETE" }),
};