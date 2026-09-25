import React from "react";
import "../styles/components/hero.css";
import backgroundImage from "../assets/hero-image.jpg";
import "../../src/global.css";

function Hero() {
    return (
        <section className="hero">
            {/* Background Image */}
            <div className="hero-background"><img src={backgroundImage} alt="ZARR Luxury Watch"/></div>
            {/* Hero Content */}
            <div className="hero-content"><span className="hero-eyebrow">TIMELESS PRECISION</span>
                <h1 className="hero-heading">TIMELESS ELEGANCE.<br />CRAFTED TO<br />PERFECTION.</h1>
                <p className="hero-description">ZARR watches are more than instruments of time; they are symbols of legacy, precision and prestige.</p>
                <div className="hero-buttons">
                    <button src="/collection" type="button">EXPLORE COLLECTIONS<span>→</span></button>
                    <button type="button">DISCOVER OUR STORY<span>→</span></button>
                </div>
            </div>
        </section>
    );
}
export default Hero;