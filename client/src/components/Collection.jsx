import React from "react";
import "../global.css";
import "../styles/components/collection.css";
import watch1 from "../assets/watch1.jpg"
import watch2 from "../assets/watch2.jpg"
import watch3 from "../assets/watch3.jpg"
import watch4 from "../assets/watch4.jpg"

function Collection() {
    return (
        <section className="collection">         {/* Collection Header */}
            <div className="collection-header">
                <span className="collection-label">OUR COLLECTION</span>
                <h2 className="collection-heading">CRAFTED FOR EVERY MOMENT</h2>
                <div className="collection-divider"></div>
            </div>
            {/* Collection Products */}
            <div className="collection-grid">
                {/* Product 01 */}
                <div className="product-card">
                    <div className="product-image-wrapper">
                        <span className="product-badge">NEW</span>
                        <img src={watch1} alt="ZARR Heritage Automatic" className="product-image"/>
                    </div>
                    <div className="product-info">
                        <h3 className="product-name">ZARR HERITAGE<br />AUTOMATIC</h3>
                        <p className="product-price">PKR 89,500</p>
                        <a href="/collection" className="product-link">VIEW DETAILS<span>→</span></a>
                    </div>
                </div>
                {/* Product 02 */}
                <div className="product-card">
                    <div className="product-image-wrapper">
                        <img src={watch2} alt="ZARR Chrono Elegance" className="product-image"/>
                    </div>
                    <div className="product-info">
                        <h3 className="product-name">ZARR CHRONO<br />ELEGANCE</h3>
                        <p className="product-price">PKR 95,000</p>
                        <a href="/collection" className="product-link">VIEW DETAILS<span>→</span></a>
                    </div>
                </div>
                {/* Product 03 */}
                <div className="product-card">
                    <div className="product-image-wrapper">
                        <img src={watch3} alt="ZARR Vanguard Black Edition" className="product-image"/>
                    </div>
                    <div className="product-info">
                        <h3 className="product-name">ZARR VANGUARD<br />BLACK EDITION</h3>
                        <p className="product-price">PKR 99,500</p>
                        <a href="/collection" className="product-link">VIEW DETAILS<span>→</span></a>
                    </div>
                </div>
                {/* Product 04 */}
                <div className="product-card">
                    <div className="product-image-wrapper">
                        <img src={watch4} alt="ZARR Classic Moonphase" className="product-image"/>
                    </div>
                    <div className="product-info">
                        <h3 className="product-name">ZARR CLASSIC<br />MOONPHASE</h3>
                        <p className="product-price">PKR 87,000</p>
                        <a href="/collection" className="product-link">VIEW DETAILS <span>→</span></a>
                    </div>
                </div>
            </div>
            {/* Browse All Watches */}
            <div className="collection-footer">
                <a href="/collection" className="browse-button">
                    BROWSE ALL WATCHES<span>→</span></a>
            </div>
        </section>
    );
}
export default Collection;