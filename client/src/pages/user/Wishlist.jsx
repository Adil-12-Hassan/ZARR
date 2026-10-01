import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { productAPI, userAPI } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

function Wishlist() {
    const { user, refreshUser } = useAuth();
    const profile = user?.user ?? user ?? {};
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState(null);
    const wishlistIds = useMemo(() => (profile.wishlist || []).map((entry) => String(entry?._id || entry)), [profile.wishlist]);
    const savedProducts = useMemo(() => wishlistIds
        .map((id) => products.find((product) => String(product._id) === id))
        .filter(Boolean), [products, wishlistIds]);

    useEffect(() => {
        let active = true;
        productAPI.getAll()
            .then((data) => { if (active) setProducts(data); })
            .catch((err) => { if (active) setError(err.message || "Unable to load your wishlist."); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const removeFromWishlist = async (productId) => {
        setRemovingId(productId);
        setError("");
        try {
            await userAPI.toggleWishlist(productId);
            await refreshUser();
        } catch (err) {
            setError(err.message || "Unable to update your wishlist.");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="page-heading">
                <div><span>ACCOUNT</span><h2>My Wishlist</h2><p>Your carefully selected ZARR timepieces.</p></div>
                <span className="page-count">{wishlistIds.length} SAVED</span>
            </div>
            {error && <p role="alert">{error}</p>}
            {loading ? <p role="status">Loading your wishlist…</p> : savedProducts.length === 0 ? (
                <section className="dashboard-panel"><h3>Your wishlist is empty</h3><p>Products you save will appear here.</p><Link to="/collection">Explore the collection</Link></section>
            ) : (
                <div className="wishlist-grid">
                {savedProducts.map((product) => (
                    <article className="wishlist-item" key={product._id}>
                        { (product.image || product.images?.[0]) && <img src={product.image || product.images[0]} alt={product.name} /> }
                        <div className="wishlist-item-content">
                            <span>{[product.movement, product.material].filter(Boolean).join(" · ") || product.category}</span>
                            <h3>{product.name}</h3>
                            <strong>PKR {Number(product.price || 0).toLocaleString()}</strong>
                            <Link to="/collection">View in collection <span>→</span></Link>
                            <button type="button" className="dashboard-secondary-button" disabled={removingId === product._id} onClick={() => removeFromWishlist(product._id)}>
                                {removingId === product._id ? "Removing…" : "Remove"}
                            </button>
                        </div>
                    </article>
                ))}
                </div>
            )}
        </div>
    );
}

export default Wishlist;
