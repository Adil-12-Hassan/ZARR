import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/hero.css";
import backgroundImage from "../assets/hero-image-optimized.jpg";

function Hero() {
    return (
        <section className="hero" aria-labelledby="hero-heading">
            <div className="hero-background" aria-hidden="true">
                <img src={backgroundImage} alt="" fetchPriority="high" decoding="async" />
            </div>
            <div className="hero-content">
                <span className="hero-eyebrow">Timeless precision</span>
                <h1 id="hero-heading" className="hero-heading">TIMELESS ELEGANCE.<br />CRAFTED TO<br />PERFECTION.</h1>
                <p className="hero-description">ZARR watches are more than instruments of time; they are symbols of legacy, precision and prestige.</p>
                <div className="hero-buttons">
                    <Link to="/collection">Explore collections <span aria-hidden="true">→</span></Link>
                    <Link to="/about">Discover our story <span aria-hidden="true">→</span></Link>
                </div>
            </div>
        </section>
    );
}

export default Hero;
