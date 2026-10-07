import React from "react";
import aboutImage from "../assets/about-watch-optimized.jpg";
import crownIcon from "../assets/crown.jpg";
import diamondIcon from "../assets/diamond-optimized.png";
import securityIcon from "../assets/security-optimized.png";
import "../styles/components/about.css";

function About() {
    return (
        <section className="about">
            {/* Background Image */}
            <div className="about-background">
                <img src={aboutImage} alt="ZARR luxury watch" loading="lazy" decoding="async" />
            </div>
            {/* About Content */}
            <div className="about-content">
                {/* Left Side */}
                <div className="about-story">
                    <span className="about-label">ABOUT ZARR</span>
                    <h2 className="about-heading">LEGACY. PASSION.<br />PERFECTION.</h2>
                    <div className="about-divider"></div>
                    <p className="about-description">At ZARR, we believe a watch is a reflection of your journey. Every detail is thoughtfully designed to combine timeless design with modern innovation.</p>
                    <a href="/about" className="about-button">LEARN MORE ABOUT US<span>→</span></a>
                </div>             {/* Right Side */}
                <div className="about-stats">
                    {/* Stat 01 */}
                    <div className="about-stat">
                        <img src={crownIcon} alt="Premium models" className="about-stat-icon"/>
                        <div className="about-stat-content">
                            <span className="about-stat-number">100+</span>
                            <span className="about-stat-label">PREMIUM MODELS</span>
                        </div>
                    </div>
                    {/* Stat 02 */}
                    <div className="about-stat">
                        <img src={diamondIcon} alt="Happy customers" className="about-stat-icon"/>
                        <div className="about-stat-content">
                            <span className="about-stat-number">50K+</span>
                            <span className="about-stat-label">HAPPY CUSTOMERS</span>
                        </div>
                    </div>
                    {/* Stat 03 */}
                    <div className="about-stat">
                        <img src={securityIcon} alt="Warranty" className="about-stat-icon"/>
                        <div className="about-stat-content">
                            <span className="about-stat-number">2</span>
                            <span className="about-stat-label">
                                YEARS WARRANTY
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default About;
