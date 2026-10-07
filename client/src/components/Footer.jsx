import React from "react";
import ZARR from "../assets/ZARR-optimized.png";
import "../styles/components/footer.css"
import { Link } from "react-router-dom";
import { useState } from "react";

function Footer() {
    const [toast, setToast] = useState(false);
    const comingSoon = (event) => { event.preventDefault(); setToast(true); window.setTimeout(() => setToast(false), 2200); };
    return (
        <footer className="footer">         {/* FOOTER MAIN */}
            <div className="footer-main">
                {/* Brand */}
                <div className="footer-brand">
                    <img src={ZARR} alt="ZARR" />
                    <p>TIMELESS ELEGANCE.<br />CRAFTED TO PERFECTION.</p>
                    {/* Social Links */}
                    <div className="footer-socials"><a href="https://www.instagram.com/" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                        <a href="https://www.facebook.com/" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="https://x.com/" aria-label="X"><i className="fa-brands fa-x-twitter"></i></a>
                        <a href="https://www.youtube.com/" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
                        <a href="https://www.linkedin.com/" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
                    </div>
                </div>
                {/* SHOP */}
                <div className="footer-links">
                    <h3>SHOP</h3>
                    <ul>
                        <li><Link to="/collection">All Watches</Link></li>
                        <li><a href="/shop/men" onClick={comingSoon}>Men's Watches</a></li>
                        <li><a href="/shop/women" onClick={comingSoon}>Women's Watches</a></li>
                        <li><a href="/shop/limited" onClick={comingSoon}>Limited Edition</a></li>
                        <li><a href="/shop/accessories" onClick={comingSoon}>Accessories</a></li>
                    </ul>
                </div>
                {/* CUSTOMER CARE */}
                <div className="footer-customer-care">
                    <h3>CUSTOMER CARE</h3>
                    <ul>
                        <li><a href="/track-order" onClick={comingSoon}>Track Your Order</a></li>
                        <li><a href="/warranty" onClick={comingSoon}>Warranty</a></li>
                        <li><a href="/returns" onClick={comingSoon}>Returns & Exchanges</a></li>
                        <li><a href="/faqs" onClick={comingSoon}>FAQs</a></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>
                {/* COMPANY */}
                <div className="footer-company">
                    <h3>COMPANY</h3>
                    <ul>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/craftsmanship" onClick={comingSoon}>Our Craftsmanship</a></li>
                        <li><a href="/sustainability" onClick={comingSoon}>Sustainability</a></li>
                        <li><a href="/careers" onClick={comingSoon}>Careers</a></li>
                        <li><a href="/press" onClick={comingSoon}>Press</a></li>
                    </ul>
                </div>
                {/* EXTRA */}
                <div className="footer-extras">
                    <h3>EXTRA</h3>
                    <ul>
                        <li><a href="/gift-cards" onClick={comingSoon}>Gift Cards</a></li>
                        <li><a href="/watch-guide" onClick={comingSoon}>Watch Guide</a></li>
                        <li><a href="/size-guide" onClick={comingSoon}>Size Guide</a></li>
                        <li><a href="/stores" onClick={comingSoon}>Store Locator</a></li>
                    </ul>
                </div>
                {/* CONTACT */}
                <div className="footer-contact">                 <h3>GET IN TOUCH</h3>
                    <p>Have a question about your ZARR watch?</p>
                    <a href="mailto:contact@zarr.com">contact@zarr.com</a>
                    <a href="tel:+923001234567">+92 300 1234567</a>
                </div>
            </div>
            {/* DIVIDER */}
            <div className="footer-divider"></div>
            {/* FOOTER BOTTOM */}
            <div className="footer-bottom">
                <p className="footer-left">&copy; 2026 ZARR. All Rights Reserved.</p>
                <ul>
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                    <li><Link to="/terms">Terms of Service</Link></li>
                    <li><Link to="/cookies">Cookies Policy</Link></li>
                </ul>
            </div>
            {toast && <div className="footer-toast" role="status">Coming Soon!</div>}
        </footer>
    );
}

export default Footer;
