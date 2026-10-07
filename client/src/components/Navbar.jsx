import React, { useEffect, useState } from "react";
import ZARR from "../assets/ZARR-optimized.png";
import "../styles/components/navbar.css";

import useCartStore from "../store/cartStore";
import CartSidebar from "./CartSidebar";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    // Cart Sidebar State
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Get Cart Items from Zustand
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();
    const items = useCartStore((state) => state.items); // Calculate Total Cart Items
    const cartCount = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    useEffect(() => {
        const openCart = () => setIsCartOpen(true);
        window.addEventListener("zarr:open-cart", openCart);
        return () => window.removeEventListener("zarr:open-cart", openCart);
    }, []);

    useEffect(() => {
        const closeDesktopMenu = () => {
            if (window.innerWidth > 1050) setIsMenuOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setIsMenuOpen(false);
        };
        window.addEventListener("resize", closeDesktopMenu);
        window.addEventListener("keydown", closeOnEscape);
        return () => {
            window.removeEventListener("resize", closeDesktopMenu);
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, []);

    return (
        <>
            {/* =========================
                NAVBAR
            ========================== */}
            <header className="navbar">             {/* Left Side Logo */}
                <div className="navbar-logo">
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>
                        <img
                            src={ZARR}
                            alt="ZARR LOGO"
                        />
                    </Link>
                </div>             <button
                    className="navbar-toggle"
                    type="button"
                    aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
                    aria-expanded={isMenuOpen}
                    aria-controls="primary-navigation"
                    onClick={() => setIsMenuOpen((open) => !open)}
                >
                    <i className={`fa-solid ${isMenuOpen ? "fa-xmark" : "fa-bars"}`} aria-hidden="true" />
                </button>             {/* =========================
                    Main Navbar
                ========================== */}
                <nav
                    id="primary-navigation"
                        className={`navbar-menu${isMenuOpen ? " is-open" : ""}`}
                        aria-label="Main navigation"
                >
                    <ul>
                        <li>
                            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        </li>                     <li>
                            <Link to="/collection" onClick={() => setIsMenuOpen(false)}>
                                Collection
                            </Link>
                        </li>                     <li>
                            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                                About Us
                            </Link>
                        </li>                     <li>
                            <Link to="/journals" onClick={() => setIsMenuOpen(false)}>
                                Journal
                            </Link>
                        </li>                     <li>
                            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>
             {/* =========================
                    Right Side Actions
                ========================== */}
                <div className="navbar-actions">                 {/* Search */}
                    <button
                        className="navbar-action"
                        aria-label="Search"
                        onClick={() => setSearchOpen((open) => !open)}
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                 {/* Account */}
                    <Link
                        to="/dashboard"
                        className="navbar-action"
                        aria-label="Account"
                    >
                        <i className="fa-regular fa-user"></i>
                    </Link>
                 {/* Shopping Cart */}
                    <button
                        className="navbar-action cart-button"
                        aria-label="Shopping Cart"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <i className="fa-solid fa-bag-shopping"></i>                     {/* Cart Count */}
                        {cartCount > 0 && (
                            <span className="cart-count">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
                {searchOpen && <form className="navbar-search" onSubmit={(event) => { event.preventDefault(); navigate(`/collection?search=${encodeURIComponent(searchText)}`); setSearchOpen(false); }}><input autoFocus aria-label="Search products" placeholder="Search watches" value={searchText} onChange={(event) => setSearchText(event.target.value)} /><button type="submit">Search</button></form>}
            </header>
            {/* =========================
                CART SIDEBAR
            ========================== */}
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </>
    );
}

export default Navbar;
