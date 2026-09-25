import React, { useState } from "react";
import ZARR from "../assets/ZARR.png";
import "../styles/components/navbar.css";
import "../../src/global.css";

import useCartStore from "../store/cartStore";
import CartSidebar from "./CartSidebar";
import { Link } from "react-router-dom";

function Navbar() {
    // Cart Sidebar State
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Get Cart Items from Zustand
    const items = useCartStore((state) => state.items); // Calculate Total Cart Items
    const cartCount = items.reduce(
        (total, item) => total + item.quantity,
        0
    ); return (
        <>
            {/* =========================
                NAVBAR
            ========================== */}
            <header className="navbar">             {/* Left Side Logo */}
                <div className="navbar-logo">
                    <a href="/">
                        <img
                            src={ZARR}
                            alt="ZARR LOGO"
                        />
                    </a>
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
                >
                    <ul>
                        <li>
                            <a href="/" onClick={() => setIsMenuOpen(false)}>Home</a>
                        </li>                     <li>
                            <a href="/collection" onClick={() => setIsMenuOpen(false)}>
                                Collection
                            </a>
                        </li>                     <li>
                            <a href="/about" onClick={() => setIsMenuOpen(false)}>
                                About Us
                            </a>
                        </li>                     <li>
                            <a href="/journals" onClick={() => setIsMenuOpen(false)}>
                                Journal
                            </a>
                        </li>                     <li>
                            <a href="/article" onClick={() => setIsMenuOpen(false)}>
                                Articles Here
                            </a>
                        </li>                     <li>
                            <a href="/contact" onClick={() => setIsMenuOpen(false)}>
                                Contact
                            </a>
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