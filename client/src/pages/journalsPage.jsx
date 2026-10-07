import React from "react";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import "../styles/pages/journalPage.css";

const journalImageUrls = [
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1800&q=85",
    "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1611651338412-8403fa6e3599?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1800&q=85",
];

const categories = [
    {
        icon: "▤",
        title: "WATCH GUIDES",
        count: "12 Articles",
    },
    {
        icon: "⚙",
        title: "CRAFTSMANSHIP",
        count: "8 Articles",
    },
    {
        icon: "♢",
        title: "WATCH CARE",
        count: "10 Articles",
    },
    {
        icon: "⌁",
        title: "ZARR STORIES",
        count: "7 Articles",
    },
    {
        icon: "♜",
        title: "STYLE",
        count: "9 Articles",
    },
    {
        icon: "▣",
        title: "NEWS & EVENTS",
        count: "6 Articles",
    },
];

const articles = [
    {
        image: journalImageUrls[2],
        date: "MAY 18, 2024",
        category: "WATCH GUIDE",
        title: "Automatic vs Quartz Watches",
        description:
            "Understanding the key differences between automatic and quartz movements.",
    },
    {
        image: journalImageUrls[3],
        date: "MAY 12, 2024",
        category: "CRAFTSMANSHIP",
        title: "Inside the ZARR Workshop",
        description:
            "Take a behind-the-scenes look at how every ZARR watch comes to life.",
    },
    {
        image: journalImageUrls[4],
        date: "MAY 06, 2024",
        category: "WATCH CARE",
        title: "How to Care for Your Luxury Watch",
        description:
            "Essential tips to keep your watch in perfect condition for generations.",
    },
    {
        image: journalImageUrls[5],
        date: "APR 28, 2024",
        category: "STYLE",
        title: "The Perfect Watch for Every Occasion",
        description:
            "From business meetings to black tie events -choose the right timepiece.",
    },
];

function Arrow() {
    return <span className="arrow">→</span>;
}

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function Journals() {
    return (
        <>
            <Navbar />
            <main className="journal-page">
                {/* HERO */}
                <section className="journal-hero" style={{ backgroundImage: `url(${journalImageUrls[0]})`, }}>
                    <div className="hero-overlay" />
                    <div className="hero-content">
                        <h1>ZARR <span>JOURNAL</span></h1>
                        <div className="hero-subtitle">STORIES <i>•</i> CRAFTSMANSHIP <i>•</i> TIME</div>
                        <p>Explore the world of ZARR through stories,<br />guides, craftsmanship and timeless style.</p>
                        <div className="gold-line" />
                    </div>
                </section>
                {/* FEATURED STORY */}
                <section className="section featured-section">
                    <div className="section-heading"><span>FEATURED STORY</span></div>
                    <div className="featured-grid">
                        <div className="featured-image">
                            <img src={journalImageUrls[1]} alt="Mechanical watch movement" />
                        </div>
                        <div className="featured-content">
                            <div className="article-category">WATCH GUIDE</div>
                            <h2>THE ART OF<br />TIMEKEEPING</h2>
                            <h3>Understanding Mechanical Watches</h3>
                            <p>A closer look at the craftsmanship, engineering and heritage behind mechanical timepieces.</p>
                            <button className="outline-button">READ ARTICLE<Arrow /></button>
                        </div>
                        <div className="featured-numbers">
                            <span className="number active">01</span>
                            <span className="number">02</span>
                            <span className="number">03</span>
                            <span className="number">04</span>
                        </div>
                    </div>
                </section>
                {/* CATEGORIES */}
                <section className="section categories-section">
                    <div className="section-heading"><span>EXPLORE BY CATEGORY</span></div>
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <a href={`/journals?category=${slugify(category.title)}`} className="category-card" key={category.title}>
                                <div className="category-icon">{category.icon}</div>
                                <h3>{category.title}</h3>
                                <p>{category.count}</p>
                            </a>
                        ))}
                    </div>
                </section>
                {/* LATEST STORIES */}
                <section className="section latest-section">
                    <div className="latest-header">
                        <div className="section-heading no-border"><span>LATEST STORIES</span></div>
                        <a href="/journals" className="view-all">VIEW ALL ARTICLES<Arrow /></a>
                    </div>
                    <div className="articles-grid">
                        {articles.map((article) => (
                            <article className="article-card" key={article.title}>
                                <div className="article-image">
                                    <img src={article.image} alt={article.title} />
                                </div>
                                <div className="article-body">
                                    <div className="article-meta">
                                        <span>{article.date}</span>
                                        <i>•</i>
                                        <span>{article.category}</span>
                                    </div>
                                    <h2>{article.title}</h2>
                                    <p>{article.description}</p>
                                    <a href={`/journals/${slugify(article.title)}`} className="read-more">READ MORE
                                        <Arrow />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
                {/* QUOTE BANNER */}
                <section
                    className="quote-banner"
                    style={{
                        backgroundImage: `url(${journalImageUrls[6]})`,
                    }}
                >
                    <div className="quote-overlay" />
                    <div className="quote-content">
                        <div className="quote-logo">
                            Z
                        </div>
                        <h2>
                            TIME IS MORE THAN
                            <br />
                            SOMETHING WE MEASURE.
                        </h2>
                        <p>IT'S SOMETHING WE RESPECT.</p>
                    </div>
                </section>
            </main>
            <Newsletter />
            <Footer />
        </>
    )
}

export default Journals;
