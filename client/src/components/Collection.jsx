import React, { useEffect, useState } from "react";
import "../global.css";
import "../styles/components/collection.css";
import { productAPI, subscribeToProductUpdates } from "../api/api";

function Collection() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        let isMounted = true;
        async function load() {
            try {
                const data = await productAPI.getAll("?page=1");
                if (isMounted) setProducts(data.slice(0, 4));
            } catch {
                if (isMounted) setProducts([]);
            }
        }
        load();
        const unsubscribe = subscribeToProductUpdates(load);
        return () => { isMounted = false; unsubscribe(); };
    }, []);

    return (
        <section className="collection">
            <div className="collection-header">
                <span className="collection-label">OUR COLLECTION</span>
                <h2 className="collection-heading">CRAFTED FOR EVERY MOMENT</h2>
                <div className="collection-divider"></div>
            </div>

            <div className="collection-grid">
                {products.length === 0 ? (
                    <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>No featured products available yet.</p>
                ) : products.map((product) => (
                    <div className="product-card" key={product._id || product.id}>
                        <div className="product-image-wrapper">
                            {product.isNewArrival && <span className="product-badge">NEW</span>}
                            <img src={product.image || product.images?.[0]} alt={product.name} className="product-image" />
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">PKR {Number(product.price || 0).toLocaleString()}</p>
                            <a href="/collection" className="product-link">VIEW DETAILS<span>→</span></a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="collection-footer">
                <a href="/collection" className="browse-button">
                    BROWSE ALL WATCHES<span>→</span>
                </a>
            </div>
        </section>
    );
}
export default Collection;