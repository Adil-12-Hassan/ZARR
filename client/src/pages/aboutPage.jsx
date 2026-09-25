import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../global.css";
import "../styles/pages/aboutPage.css";

function AboutPage() {
    return (
        <>
            <Navbar />
            <main className="about-page">
                {/* ABOUT HERO*/}
                <section className="about-hero">
                    <div className="about-hero-content">
                        <span className="about-eyebrow">ABOUT ZARR</span>
                        <h1>BUILT ON PASSION.<br /><span>DRIVEN BY PURPOSE.</span></h1>
                        <div className="about-line"></div>
                        <p> ZARR was founded with a singular vision — to
                            timepieces that embody the perfect balance of imeless elegance and modern precision. Every watch we craft is a reflection of our dedication to quality, craftsmanship, and the pursuit of excellence.</p>
                    </div>
                </section>
                {/* BRAND PILLARS */}
                <section className="brand-pillars">
                    <div className="pillar-grid">
                        {/* OUR STORY */}
                        <article className="pillar-card">
                            <div className="pillar-icon">Z</div>
                            <h2>OUR STORY</h2>
                            <p>Born from a passion for horology and a commitment to excellence, ZARR is more than a watch brand — it is a legacy in the making.</p>
                        </article>
                        {/* OUR MISSION */}
                        <article className="pillar-card">
                            <div className="pillar-icon">◇</div>
                            <h2>OUR MISSION</h2>
                            <p>To craft exceptional timepieces that inspire confidence, celebrate individuality, and stand the test of time.</p>
                        </article>
                        {/* OUR VALUES */}
                        <article className="pillar-card">
                            <div className="pillar-icon">✦</div>
                            <h2>OUR VALUES</h2>
                            <p>Integrity, precision, and innovation guide everything we do. We never compromise on quality.</p>
                        </article>
                        {/* OUR VISION */}
                        <article className="pillar-card">
                            <div className="pillar-icon">◎</div>
                            <h2>OUR VISION</h2>
                            <p>To be a globally recognized symbol of timeless elegance and unmatched craftsmanship for generations to come.</p>
                        </article>
                    </div>
                </section>
                {/* ZARR LEGACY */}
                <section className="zarr-legacy">
                    <div className="section-heading">
                        <span>OUR HISTORY</span>
                        <h2>THE ZARR LEGACY</h2>
                        <p>From our earliest sketches to modern mechanical masterpieces.</p>
                    </div>
                    <div className="legacy-timeline">
                        {/* 1998 */}
                        <article className="legacy-item">
                            <div className="legacy-image">
                                <img src="https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=900&q=85" alt="ZARR early workshop sketches" />
                            </div>
                            <div className="legacy-content">
                                <span className="legacy-year">1998</span>
                                <h3>THE BEGINNING</h3>
                                <p>ZARR begins with sketches, passion, and a traditional watchmaking workshop.</p>
                            </div>
                        </article>
                        {/* 2003 */}
                        <article className="legacy-item">
                            <div className="legacy-image">
                                <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=85" alt="ZARR first watch prototype" />
                            </div>
                            <div className="legacy-content">
                                <span className="legacy-year">2003</span>
                                <h3>FIRST PROTOTYPE</h3>
                                <p>Our first chronograph emerges from years of experimentation and refinement.</p>
                            </div>
                        </article>
                        {/* 2012 */}
                        <article className="legacy-item">
                            <div className="legacy-image">
                                <img src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=85" alt="ZARR international expansion" />
                            </div>
                            <div className="legacy-content">
                                <span className="legacy-year">2012</span>
                                <h3>GLOBAL EXPANSION</h3>
                                <p>ZARR expands beyond its origins and earns recognition from watch enthusiasts around the world.</p>
                            </div>
                        </article>
                        {/* CURRENT DAY */}
                        <article className="legacy-item">
                            <div className="legacy-image">
                                <img src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=900&q=85" alt="Modern ZARR watch collection" />
                            </div>
                            <div className="legacy-content">
                                <span className="legacy-year">CURRENT DAY</span>
                                <h3>THE ZARR ERA</h3>
                                <p> ZARR combines traditional watchmaking with modern innovation while preserving the character of timeless design.</p>
                            </div>
                        </article>
                    </div>
                </section>
                {/* THE FACES BEHIND ZARR */}
                <section className="zarr-team">
                    <div className="section-heading">
                        <span>THE PEOPLE</span>
                        <h2>THE FACES BEHIND ZARR</h2>
                        <p>A collective of designers, watchmakers, and visionaries dedicated to the art of time.</p>
                    </div>
                    <div className="team-grid">
                        {/* FOUNDER */}
                        <article className="team-card">
                            <div className="team-image">
                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85" alt="ZARR Founder and CEO" />
                            </div>
                            <span className="team-role">FOUNDER & CEO</span>
                            <h3>Founder</h3>
                            <p>Creating a new horological vision and guiding ZARR toward a timeless future.</p>
                        </article>
                        {/* WATCHMAKER */}
                        <article className="team-card">
                            <div className="team-image">
                                <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=700&q=85" alt="ZARR Head Watchmaker" />
                            </div>
                            <span className="team-role">HEAD WATCHMAKER</span>
                            <h3>Master Watchmaker</h3>
                            <p>Protecting the traditional craftsmanship and precision behind every ZARR movement.</p>
                        </article>
                        {/* DESIGNER */}
                        <article className="team-card">
                            <div className="team-image">
                                <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=85" alt="ZARR Design Director" />
                            </div>
                            <span className="team-role">DESIGN DIRECTOR</span>
                            <h3>Design Director</h3>
                            <p>Defining the visual language and distinctive character of every ZARR creation.</p>
                        </article>
                        {/* CUSTOMER EXPERIENCE */}
                        <article className="team-card">
                            <div className="team-image">
                                <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=85" alt="ZARR Customer Experience Lead" />
                            </div>
                            <span className="team-role">CUSTOMER EXPERIENCE LEAD</span>
                            <h3>Experience Lead</h3>
                            <p>Ensuring every interaction with ZARR reflects the same standard as our timepieces.</p>
                        </article>
                    </div>
                </section>
                {/* CRAFTSMANSHIP */}
                <section className="craftsmanship">
                    <div className="section-heading">
                        <span>OUR CRAFT</span>
                        <h2>CRAFTSMANSHIP BEYOND COMPARE.</h2>
                        <p>Precision is not simply a standard at ZARR. It is our foundation.</p>
                    </div>
                    {/* HAND FINISHED COMPONENTS */}
                    <article className="craft-item">
                        <div className="craft-image">
                            <img src="https://images.unsplash.com/photo-1619134778706-c9e7b92d4a1a?auto=format&fit=crop&w=1100&q=85" alt="ZARR master watchmaker working on a timepiece" />
                            <span>A</span>
                        </div>
                        <div className="craft-content">
                            <span className="craft-number">01</span>
                            <h3>HAND-FINISHED COMPONENTS</h3>
                            <div className="gold-line"></div>
                            <p>Our master watchmakers work on specially selected components, meticulously finishing every detail by hand. Each movement receives the attention, patience, and precision expected from a true ZARR timepiece. </p>
                        </div>
                    </article>
                    {/* MATERIAL INNOVATION */}
                    <article className="craft-item">
                        <div className="craft-image">
                            <img src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1100&q=85" alt="ZARR watch material construction" />
                            <span>B</span>
                        </div>
                        <div className="craft-content">
                            <span className="craft-number">02</span>
                            <h3>MATERIAL INNOVATION</h3>
                            <div className="gold-line"></div>
                            <p>ZARR combines timeless watchmaking with advanced materials and modern engineering. Every
                                component is carefully selected, tested, and refined to deliver exceptional
                                durability,precision, and performance.</p>
                        </div>
                    </article>
                </section>
                {/* EVERY DETAIL MATTERS */}
                <section className="about-stats">
                    <div className="section-heading">
                        <span>THE ZARR STANDARD</span>
                        <h2>EVERY DETAIL MATTERS</h2>
                    </div>
                    <div className="stats-grid">
                        {/* PREMIUM MODELS */}
                        <div className="stat">
                            <div className="stat-icon">♕</div>
                            <strong>100+</strong>
                            <span>PREMIUM MODELS</span>
                        </div>
                        {/* CUSTOMERS */}
                        <div className="stat">
                            <div className="stat-icon">◇</div>
                            <strong>50K+</strong>
                            <span>HAPPY CUSTOMERS</span>
                        </div>
                        {/* WARRANTY */}
                        <div className="stat">
                            <div className="stat-icon">✦</div>
                            <strong>2</strong>
                            <span>YEARS WARRANTY</span>
                        </div>
                        {/* COUNTRIES */}
                        <div className="stat">
                            <div className="stat-icon">◎</div>
                            <strong>30+</strong>
                            <span>COUNTRIES</span>
                        </div>
                    </div>
                    {/* CTA */}
                    <div className="about-cta">
                        <div className="about-cta-content">
                            <span>DISCOVER ZARR</span>
                            <h3>TIMELESS BY DESIGN.</h3>
                            <p>Explore the collection and discover the craftsmanship behind every ZARR timepiece.</p>
                        </div>
                        <a href="/collection" className="about-cta-button">EXPLORE THE COLLECTIONS</a>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
export default AboutPage;