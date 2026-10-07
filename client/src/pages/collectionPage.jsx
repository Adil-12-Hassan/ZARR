import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/collectionPage.css";
import useCartStore from "../store/cartStore";
import { productAPI, subscribeToProductUpdates } from "../api/api";
import { useAuth } from "../context/AuthContext";
import heroImage from "../assets/hero-image-optimized.jpg";

function FilterIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 6h16" />
            <path d="M7 12h10" />
            <path d="M10 18h4" />
        </svg>
    );
}

function ChevronDown() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
        >
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
        </svg>
    );
}

function BagIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 8h14l-1 12H6L5 8Z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
    );
}

function CollectionPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedPage, setSelectedPage] = useState(1);
    const [gender, setGender] = useState("All");
    const [sort, setSort] = useState("featured");
    const addToCart = useCartStore((state) => state.addToCart);
    const { isAuthenticated } = useAuth();
    const [filters, setFilters] = useState({
        category: "",
        movement: "",
        material: "",
        price: "",
        color: "",
    });

    useEffect(() => {
        let isMounted = true;
        const loadProducts = async () => {
            try {
                const data = await productAPI.getAll(`?page=${selectedPage}`);
                if (isMounted) setProducts(data);
                if (isMounted) setError("");
            } catch (err) {
                if (isMounted) setError(err.message || "Unable to load products.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        async function fetchProducts() {
            setLoading(true);
            setError("");
            await loadProducts();
        }

        fetchProducts();
        const unsubscribe = subscribeToProductUpdates(loadProducts);
        return () => { isMounted = false; unsubscribe(); };
    }, [selectedPage]);

    const updateFilter = (name, value) => {
        setFilters((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: "",
            movement: "",
            material: "",
            price: "",
            color: "",
        });
        setGender("All");
        setSort("featured");
    };

    const handleAddToCart = (product) => {
        if (!isAuthenticated) {
            window.alert("Please log in before adding items to your cart.");
            return;
        }
        addToCart({
            ...product,
            id: product._id || product.id,
            image: product.image || product.images?.[0],
        });
        window.dispatchEvent(new Event("zarr:open-cart"));
    };

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (gender !== "All") {
            result = result.filter((product) => product.gender === gender);
        }

        if (filters.category) {
            result = result.filter((product) => product.category === filters.category);
        }

        if (filters.movement) {
            result = result.filter((product) => product.movement === filters.movement);
        }

        if (filters.material) {
            result = result.filter((product) => product.material === filters.material);
        }

        if (filters.color) {
            result = result.filter((product) => product.color === filters.color);
        }

        if (filters.price) {
            result = result.filter((product) => {
                const price = Number(product.price || 0);
                if (filters.price === "under-80000") return price < 80000;
                if (filters.price === "80000-90000") return price >= 80000 && price <= 90000;
                if (filters.price === "above-90000") return price > 90000;
                return true;
            });
        }

        if (sort === "price-low") {
            result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        } else if (sort === "price-high") {
            result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        } else if (sort === "newest") {
            result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        } else if (sort === "name") {
            result.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
        }

        return result;
    }, [products, gender, filters, sort]);

    return (
        <>
            <Navbar />
            <main className="shop-page">
                {/* COLLECTION HEADER */}
                <section className="collection-header" style={{ "--collection-image": `url("${heroImage}")` }}>
                    <div className="collection-header-content">
                        <span className="collection-eyebrow">ZARR TIMEPIECES</span>
                        <h1>OUR <span>COLLECTION</span></h1>
                        <p>Discover timepieces that define sophistication.<br />Precision crafted for those who value every second.</p>
                    </div>
                </section>
                {/* COLLECTION CONTROLS */}
                <section className="collection-section">
                    <div className="collection-container">
                        {/* CATEGORY TABS */}
                        <div className="collection-topbar">
                            <div className="gender-tabs">
                                <button className={gender === "All" ? "active" : ""} onClick={() => setGender("All")}>ALL WATCHES</button>
                                <button className={gender === "Men" ? "active" : ""} onClick={() => setGender("Men")}>MEN</button>
                                <button className={gender === "Women" ? "active" : ""} onClick={() => setGender("Women")} >WOMEN</button>
                            </div>
                            <div className="sort-wrapper">
                                <label htmlFor="sort">SORT BY:</label>
                                <select id="sort" value={sort} onChange={(event) => setSort(event.target.value)}>
                                    <option value="featured">FEATURED</option>
                                    <option value="newest">NEWEST</option>
                                    <option value="price-low">PRICE: LOW TO HIGH</option>
                                    <option value="price-high">PRICE: HIGH TO LOW</option>
                                    <option value="name">NAME</option>
                                </select>
                                <ChevronDown />
                            </div>
                        </div>
                        {/* FILTER BAR */}
                        <div className="filter-bar">
                                <button className="filter-main-button" type="button" onClick={clearFilters} aria-label="Clear all active filters">
                                    <FilterIcon />
                                    <span>CLEAR FILTERS</span>
                                    <small>{Object.values(filters).filter(Boolean).length + Number(gender !== "All")}</small>
                            </button>
                            {/* Category */}
                            <div className="filter-select">
                                <span>CATEGORY</span>
                                <select value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
                                    <option value="">All Categories</option>
                                    <option value="Automatic">Automatic</option>
                                    <option value="Chronograph">Chronograph</option>
                                    <option value="Classic">Classic</option>
                                    <option value="Luxury">Luxury</option>
                                </select>
                                <ChevronDown />
                            </div>
                            {/* Movement */}
                            <div className="filter-select">
                                <span>MOVEMENT</span>
                                <select value={filters.movement} onChange={(event) => updateFilter("movement", event.target.value)}>
                                    <option value="">All Movements</option>
                                    <option value="Automatic">Automatic</option>
                                    <option value="Quartz">Quartz</option>
                                </select>
                                <ChevronDown />
                            </div>
                            {/* Material */}
                            <div className="filter-select">
                                <span>CASE MATERIAL</span>
                                <select value={filters.material} onChange={(event) => updateFilter("material", event.target.value)}>
                                    <option value="">All Material</option>
                                    <option value="Gold">Gold</option>
                                    <option value="Rose Gold">Rose Gold</option>
                                    <option value="Stainless Steel">Stainless Steel</option>
                                    <option value="Black Steel">Black Steel</option>
                                </select>
                                <ChevronDown />
                            </div>
                            {/* Price */}
                            <div className="filter-select">
                                <span>PRICE RANGE</span>
                                <select value={filters.price} onChange={(event) => updateFilter("price", event.target.value)}>
                                    <option value="">All Prices</option>
                                    <option value="under-80000">Under PKR 80,000</option>
                                    <option value="80000-90000">PKR 80,000 - 90,000</option>
                                    <option value="above-90000">Above PKR 90,000</option>
                                </select>
                                <ChevronDown />
                            </div>
                            {/* Color */}
                            <div className="filter-select">
                                <span>COLOR</span>
                                <select value={filters.color} onChange={(event) => updateFilter("color", event.target.value)}>
                                    <option value="">All Colors</option>
                                    <option value="Green">Green</option>
                                    <option value="Black">Black</option>
                                    <option value="White">White</option>
                                </select>
                                <ChevronDown />
                            </div>
                            <button className="clear-filters" onClick={clearFilters}><CloseIcon />CLEAR ALL</button>
                        </div>
                        {error && (
                            <div className="empty-products">
                                <h2>Unable to load products</h2>
                                <p>{error}</p>
                            </div>
                        )}

                        {loading && !error && (
                            <div className="empty-products">
                                <h2>Loading products...</h2>
                                <p>Please wait while the catalog refreshes.</p>
                            </div>
                        )}

                        {!loading && !error && (
                            <div className="products-grid">
                                {filteredProducts.map((product) => (
                                    <article className="product-card" key={product._id || product.id}>
                                        <div className="product-image-wrapper">
                                            {product.isNewArrival && (<span className="new-badge">NEW</span>)}
                                            <img src={product.image || product.images?.[0]} alt={product.name} loading="lazy" decoding="async" />
                                        </div>
                                        <div className="product-info">
                                            <h2>{product.name}</h2>
                                            <p className="product-price">PKR{" "}{Number(product.price || 0).toLocaleString()}</p>
                                        </div>
                                        <div className="product-actions">
                                            <button className="details-button">VIEW DETAILS</button>
                                            <button className="cart-button" aria-label={`Add ${product.name} to cart`} onClick={() => handleAddToCart(product)}><BagIcon /></button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                        {/* EMPTY STATE */}
                        {!loading && !error && filteredProducts.length === 0 && (
                            <div className="empty-products">
                                <h2>No watches found</h2>
                                <p>Try adjusting your filters to find another timepiece.</p>
                                <button onClick={clearFilters}>CLEAR FILTERS</button>
                            </div>
                        )}
                        {/* PAGINATION */}
                        {!loading && !error && filteredProducts.length > 0 && (
                            <div className="pagination">
                                <button className="pagination-arrow" onClick={() => setSelectedPage((page) => Math.max(1, page - 1))}>‹</button>
                                {[1,2,3,4,5].map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        className={`pagination-number ${selectedPage === pageNumber ? "active" : ""}`}
                                        onClick={() => setSelectedPage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                                <button className="pagination-arrow" onClick={() => setSelectedPage((page) => Math.min(5, page + 1))}>›</button>
                            </div>
                        )}
                    </div>
                </section>             {/* COLLECTION VALUES */}
                <section className="collection-values">
                    <div className="value-item">
                        <div className="value-icon">◇</div>
                        <div>
                            <h3>PREMIUM QUALITY</h3>
                            <p>Finest materials for uncompromised quality.</p>
                        </div>
                    </div>
                    <div className="value-item">
                        <div className="value-icon">⚙</div>
                        <div>
                            <h3>EXPERT CRAFTSMANSHIP</h3>
                            <p>Precision engineered by master watchmakers.</p>
                        </div>
                    </div>
                    <div className="value-item">
                        <div className="value-icon">♢</div>
                        <div>
                            <h3>BUILT TO LAST</h3>
                            <p>Durable, reliable and made to endure.</p>
                        </div>
                    </div>
                    <div className="value-item">
                        <div className="value-icon">◎</div>
                        <div>
                            <h3>WORLDWIDE DELIVERY</h3>
                            <p>Complimentary shipping and secure delivery.</p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default CollectionPage;
