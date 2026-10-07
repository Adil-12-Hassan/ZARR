import React from "react";
import ZARR from "../assets/ZARR-optimized.png";
import "../styles/components/footer.css"

function Footer() {
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
                        <li><a href="/shop">All Watches</a></li>
                        <li><a href="/shop/men">Men's Watches</a></li>
                        <li><a href="/shop/women">Women's Watches</a></li>
                        <li><a href="/shop/limited">Limited Edition</a></li>
                        <li><a href="/shop/accessories">Accessories</a></li>
                    </ul>
                </div>
                {/* CUSTOMER CARE */}
                <div className="footer-customer-care">
                    <h3>CUSTOMER CARE</h3>
                    <ul>
                        <li><a href="/track-order">Track Your Order</a></li>
                        <li><a href="/warranty">Warranty</a></li>
                        <li><a href="/returns">Returns & Exchanges</a></li>
                        <li><a href="/faqs">FAQs</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                    </ul>
                </div>
                {/* COMPANY */}
                <div className="footer-company">
                    <h3>COMPANY</h3>
                    <ul>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/craftsmanship">Our Craftsmanship</a></li>
                        <li><a href="/sustainability">Sustainability</a></li>
                        <li><a href="/careers">Careers</a></li>
                        <li><a href="/press">Press</a></li>
                    </ul>
                </div>
                {/* EXTRA */}
                <div className="footer-extras">
                    <h3>EXTRA</h3>
                    <ul>
                        <li><a href="/gift-cards">Gift Cards</a></li>
                        <li><a href="/watch-guide">Watch Guide</a></li>
                        <li><a href="/size-guide">Size Guide</a></li>
                        <li><a href="/stores">Store Locator</a></li>
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
                    <li><a href="/privacy">Privacy Policy</a></li>
                    <li><a href="/terms">Terms of Service</a></li>
                    <li><a href="/cookies">Cookies Policy</a></li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
