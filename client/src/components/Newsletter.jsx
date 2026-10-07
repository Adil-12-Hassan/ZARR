import React from "react";
import "../styles/components/newsletter.css"

function Newsletter() {
    return (
        <section className="newsletter">
            <div className="newsletter-content">
                <h3>STAY TIMELESS</h3>
                <h2>Join the ZARR Circle</h2>
                <p>Exclusive offers, new arrivals and stories delivered to your inbox.</p>
            </div>         <div className="newsletter-form-wrapper">
                <div className="subscribe">
                    <input type="email" 
                    name="email" 
                    aria-label="Email Address" placeholder="Enter your email address"/>
                    <button type="submit">SUBSCRIBE</button>
                </div>
            </div>
        </section>
    )
}

export default Newsletter;
