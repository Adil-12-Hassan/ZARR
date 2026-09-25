import React from "react";
import { Link } from "react-router-dom";
import watch1 from "../../assets/watch1.jpg";
import watch2 from "../../assets/watch2.jpg";

const savedWatches = [
    { name: "ZARR Heritage Automatic", detail: "Automatic · Gold", price: "PKR 89,500", image: watch1 },
    { name: "ZARR Chrono Elegance", detail: "Chronograph · Steel", price: "PKR 95,000", image: watch2 },
];

function Wishlist() {
    return (
        <div className="dashboard-page">
            <div className="page-heading">
                <div><span>ACCOUNT</span><h2>My Wishlist</h2><p>Your carefully selected ZARR timepieces.</p></div>
                <span className="page-count">02 SAVED</span>
            </div>
            <div className="wishlist-grid">
                {savedWatches.map((watch) => (
                    <article className="wishlist-item" key={watch.name}>
                        <img src={watch.image} alt={watch.name} />
                        <div className="wishlist-item-content">
                            <span>{watch.detail}</span>
                            <h3>{watch.name}</h3>
                            <strong>{watch.price}</strong>
                            <Link to="/collection">View in collection <span>→</span></Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default Wishlist;
