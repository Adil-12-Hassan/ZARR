import { Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import About from "../components/About";
import CollectionSection from "../components/Collection";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AboutPage from "../pages/aboutPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminSettings from "../pages/admin/AdminSetting";
import ManageMessages from "../pages/admin/MangeMessages";
import ManageOrders from "../pages/admin/ManageOrders";
import ManageProducts from "../pages/admin/ManageProducts";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageArticles from "../pages/admin/ManageArticles";
import Checkout from "../pages/checkoutPage";
import Collection from "../pages/collectionPage";
import ContactPage from "../pages/contactPage";
import AdminLogin from "../pages/auth/AdminLogin";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Journals from "../pages/journalsPage";
import ArticlePage from "../pages/articlePage";
import AccountPage from "../pages/user/AccountPage";
import DashboardHome from "../pages/user/DashboardHome";
import Orders from "../pages/user/Orders";
import Settings from "../pages/user/Settings";
import UserDashboard from "../pages/user/UserDashboard";
import Wishlist from "../pages/user/Wishlist";
import LegalPage from "../pages/LegalPage";

const pageMetadata = {
    "/": [
        "ZARR | Timeless Watches, Crafted to Last",
        "Discover ZARR watches: precision-crafted timepieces with timeless design, premium materials, and dependable delivery across Pakistan.",
    ],
    "/collection": [
        "Shop Luxury Watches | ZARR Collection",
        "Explore the ZARR collection of precision-crafted watches. Find a timeless design for every moment.",
    ],
    "/about": [
        "Our Story | ZARR Watches",
        "Learn about ZARR and our approach to timeless design, precision, and craftsmanship.",
    ],
    "/journals": [
        "The ZARR Journal | Stories, Guides & Craftsmanship",
        "Explore original ZARR articles on watchmaking, craftsmanship, watch care, and timeless personal style.",
    ],
    "/contact": [
        "Contact ZARR | Customer Care",
        "Get in touch with ZARR for help with your watch, order, or customer service question.",
    ],
};

function RouteMetadata() {
    const { pathname } = useLocation();

    useEffect(() => {
        const isPrivate = pathname.startsWith("/admin")
            || pathname.startsWith("/dashboard")
            || ["/checkout", "/login", "/register"].includes(pathname);
        const [title, description] = pageMetadata[pathname] || (pathname.startsWith("/journals/")
            ? ["Article | The ZARR Journal", "Stories on watchmaking, craftsmanship, and timeless style from ZARR."]
            : [
                "ZARR | Timeless Watches, Crafted to Last",
                "Explore precision-crafted ZARR timepieces, designed for every moment.",
            ]);

        document.title = title;
        document.querySelector('meta[name="description"]')?.setAttribute("content", description);
        document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
        document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
        document.querySelector('meta[name="robots"]')?.setAttribute(
            "content",
            isPrivate ? "noindex, nofollow" : "index, follow",
        );

    }, [pathname]);

    return null;
}

function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <CollectionSection />
            <About />
            <Newsletter />
            <Footer />
        </>
    );
}

function AppRoutes() {
    return (
        <>
            <RouteMetadata />
            <Suspense fallback={<main className="route-loading" role="status">Loading ZARR…</main>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/collection" element={<Collection />} />
                    <Route path="/journals" element={<Journals />} />
                    <Route path="/journals/:slug" element={<ArticlePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/craftsmanship" element={<AboutPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy" element={<LegalPage type="privacy" />} />
                    <Route path="/terms" element={<LegalPage type="terms" />} />
                    <Route path="/cookies" element={<LegalPage type="cookies" />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<UserDashboard />}>
                            <Route index element={<DashboardHome />} />
                            <Route path="orders" element={<Orders />} />
                            <Route path="wishlist" element={<Wishlist />} />
                            <Route path="addresses" element={<AccountPage />} />
                            <Route path="profile" element={<Navigate to="/dashboard/settings" replace />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>
                    </Route>

                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route element={<ProtectedRoute requiredRole="admin" redirectTo="/admin/login" />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="products" element={<ManageProducts />} />
                            <Route path="articles" element={<ManageArticles />} />
                            <Route path="orders" element={<ManageOrders />} />
                            <Route path="messages" element={<ManageMessages />} />
                            <Route path="users" element={<ManageUsers />} />
                            <Route path="settings" element={<AdminSettings />} />
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
        </>
    );
}
export default AppRoutes;
