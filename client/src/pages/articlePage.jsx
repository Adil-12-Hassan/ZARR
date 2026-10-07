import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { articleAPI } from "../api/api";
import "../styles/pages/articles.css";

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setArticle(null);
    setLoading(true);
    setError("");
    articleAPI.getBySlug(slug)
      .then((data) => { if (active) setArticle(data); })
      .catch((err) => { if (active) setError(err.message || "This story could not be found."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (!article) return undefined;
    const previousTitle = document.title;
    const description = article.excerpt.slice(0, 160);
    document.title = `${article.title} | The ZARR Journal`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[name="robots"]')?.setAttribute("content", "index, follow");

    const structuredData = document.createElement("script");
    structuredData.type = "application/ld+json";
    structuredData.dataset.articleSchema = "true";
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description,
      image: article.coverImage || undefined,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: { "@type": "Organization", name: article.author || "ZARR Editorial" },
      publisher: { "@type": "Organization", name: "ZARR" },
      mainEntityOfPage: window.location.href,
    }).replace(/</g, "\\u003c");
    document.head.append(structuredData);

    return () => {
      document.querySelector('script[data-article-schema="true"]')?.remove();
      document.title = previousTitle;
    };
  }, [article]);

  return (
    <>
      <Navbar />
      <main className="article-page">
        {loading ? <div className="article-state" role="status">Loading story…</div>
          : error || !article ? (
            <section className="article-state article-state--error" role="alert">
              <span className="journal-eyebrow">THE ZARR JOURNAL</span>
              <h1>Story unavailable</h1>
              <p>{error || "This story could not be found."}</p>
              <Link className="journal-read-link" to="/journals">BACK TO THE JOURNAL <span aria-hidden="true">↗</span></Link>
            </section>
          ) : (
            <>
              <header className="article-header">
                <Link className="article-back" to="/journals">← THE JOURNAL</Link>
                <div className="journal-meta"><span>{article.category}</span><i />{formatDate(article.publishedAt)}</div>
                <h1>{article.title}</h1>
                <p className="article-header__excerpt">{article.excerpt}</p>
                <div className="article-header__byline">WORDS BY {article.author || "ZARR EDITORIAL"}</div>
              </header>
              {article.coverImage && <figure className="article-cover"><img src={article.coverImage} alt="" fetchPriority="high" /></figure>}
              <article className="article-body">
                {article.content.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                {article.sourceUrl && <aside className="article-source">
                  <span>CONTINUE READING</span>
                  <a href={article.sourceUrl} target="_blank" rel="noreferrer">Read the original on our main blog <span aria-hidden="true">↗</span></a>
                </aside>}
                <Link className="article-end-link" to="/journals">← ALL STORIES</Link>
              </article>
            </>
          )}
      </main>
      <Footer />
    </>
  );
}
