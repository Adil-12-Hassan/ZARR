import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { articleAPI } from "../api/api";
import "../styles/pages/articles.css";

function formatDate(value) {
  if (!value) return "ZARR JOURNAL";
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

function ArticleCover({ article, featured = false }) {
  return article.coverImage ? (
    <img className="journal-card__image" src={article.coverImage} alt="" loading={featured ? "eager" : "lazy"} decoding="async" />
  ) : (
    <div className="journal-card__fallback" aria-hidden="true"><span>Z</span><small>TIME, CONSIDERED</small></div>
  );
}

function Journals() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    articleAPI.getPublished()
      .then((data) => { if (active) setArticles(data); })
      .catch((err) => { if (active) setError(err.message || "The journal is temporarily unavailable."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const [featured, ...stories] = articles;

  return (
    <>
      <Navbar />
      <main className="journal-page">
        <header className="journal-hero">
          <div className="journal-hero__inner">
            <span className="journal-eyebrow">THE ZARR JOURNAL</span>
            <h1>Time, <em>considered.</em></h1>
            <p>Stories on watchmaking, thoughtful design, and the details that make a timepiece worth keeping.</p>
            <div className="journal-hero__footer"><span>CRAFT · CULTURE · CARE</span><span>EST. BY ZARR</span></div>
          </div>
          <div className="journal-hero__orb" aria-hidden="true"><span>Z</span></div>
        </header>

        <section className="journal-content" aria-labelledby="journal-latest-heading">
          <div className="journal-section-head">
            <div><span className="journal-eyebrow">THE EDITORIAL</span><h2 id="journal-latest-heading">Latest stories</h2></div>
            <span className="journal-count">{articles.length.toString().padStart(2, "0")} STORIES</span>
          </div>

          {loading && <div className="journal-state" role="status">Loading the latest from ZARR…</div>}
          {!loading && error && <div className="journal-state journal-state--error" role="alert">{error}</div>}
          {!loading && !error && !featured && (
            <div className="journal-empty">
              <span className="journal-empty__mark">Z</span>
              <h3>New stories are on their way.</h3>
              <p>Our editorial team is preparing the next dispatch. Please check back soon.</p>
            </div>
          )}

          {!loading && !error && featured && (
            <>
              <article className="journal-featured">
                <Link className="journal-featured__visual" to={`/journals/${featured.slug}`} aria-label={`Read ${featured.title}`}>
                  <ArticleCover article={featured} featured />
                  <span className="journal-featured__index">01 / FEATURED</span>
                </Link>
                <div className="journal-featured__copy">
                  <div className="journal-meta"><span>{featured.category}</span><i />{formatDate(featured.publishedAt)}</div>
                  <h3><Link to={`/journals/${featured.slug}`}>{featured.title}</Link></h3>
                  <p>{featured.excerpt}</p>
                  <div className="journal-featured__byline">WORDS BY {featured.author || "ZARR EDITORIAL"}</div>
                  <Link className="journal-read-link" to={`/journals/${featured.slug}`}>READ THE STORY <span aria-hidden="true">↗</span></Link>
                </div>
              </article>

              {stories.length > 0 && <div className="journal-grid">
                {stories.map((article, index) => (
                  <article className="journal-card" key={article._id || article.slug}>
                    <Link className="journal-card__visual" to={`/journals/${article.slug}`} aria-label={`Read ${article.title}`}>
                      <ArticleCover article={article} />
                      <span className="journal-card__index">{String(index + 2).padStart(2, "0")}</span>
                    </Link>
                    <div className="journal-meta"><span>{article.category}</span><i />{formatDate(article.publishedAt)}</div>
                    <h3><Link to={`/journals/${article.slug}`}>{article.title}</Link></h3>
                    <p>{article.excerpt}</p>
                    <Link className="journal-read-link" to={`/journals/${article.slug}`}>READ STORY <span aria-hidden="true">↗</span></Link>
                  </article>
                ))}
              </div>}
            </>
          )}
        </section>
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}

export default Journals;
