import { Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import CollectionSection from "../components/Collection";
import About from "../components/About";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import Collection from "../pages/collectionPage";
import AdminLogin from "../pages/auth/AdminLogin";
import Journals from "../pages/journalsPage";
import ContactPage from "../pages/contactPage";
import AboutPage from "../pages/aboutPage";
import Checkout from "../pages/checkoutPage";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import UserDashboard from "../pages/user/UserDashboard";
import DashboardHome from "../pages/user/DashboardHome";
import Orders from "../pages/user/Orders";
import Wishlist from "../pages/user/Wishlist";
import Profile from "../pages/user/Profile";
import ProtectedRoute from "./ProtectedRoute";
import AccountPage from "../pages/user/AccountPage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageProducts from "../pages/admin/ManageProducts";
import ManageOrders from "../pages/admin/ManageOrders";
import ManageMessages from "../pages/admin/MangeMessages";
import ManageUsers from "../pages/admin/ManageUsers";
import AdminSettings from "../pages/admin/AdminSetting";

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

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/journals" element={<Journals />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />         <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<UserDashboard />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="addresses" element={<AccountPage type="Addresses" />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<AccountPage type="Settings" />} />
                </Route>
            </Route>         <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute requiredRole="admin" redirectTo="/admin/login" />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<ManageProducts />} />
                    <Route path="orders" element={<ManageOrders />} />
                    <Route path="messages" element={<ManageMessages />} />
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes;
