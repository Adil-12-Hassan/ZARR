import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/admin/Modal";
import { articleAPI } from "../../api/api";
import "../../styles/components/admin-ui.css";
import "../../styles/pages/manageArticles.css";

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "Watch Guides",
  author: "ZARR Editorial",
  sourceUrl: "",
  status: "draft",
};

function slugPreview(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150)
    .replace(/-+$/g, "") || "your-article-title";
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

export default function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setArticles(await articleAPI.getAllAdmin());
    } catch (err) {
      setError(err.message || "Could not load articles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesQuery = !query || `${article.title} ${article.slug} ${article.category}`.toLowerCase().includes(query);
      return matchesQuery && (statusFilter === "all" || article.status === statusFilter);
    });
  }, [articles, search, statusFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (article) => {
    setEditingId(article._id);
    setForm({
      title: article.title || "",
      excerpt: article.excerpt || "",
      content: article.content || "",
      coverImage: article.coverImage || "",
      category: article.category || "",
      author: article.author || "ZARR Editorial",
      sourceUrl: article.sourceUrl || "",
      status: article.status || "draft",
    });
    setError("");
    setModalOpen(true);
  };

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) await articleAPI.update(editingId, form);
      else await articleAPI.create(form);
      setModalOpen(false);
      await fetchArticles();
    } catch (err) {
      setError(err.message || "Could not save article.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    setError("");
    try {
      await articleAPI.remove(deleteTarget._id);
      setDeleteTarget(null);
      await fetchArticles();
    } catch (err) {
      setError(err.message || "Could not delete article.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="manage-articles">
      <div className="admin-panel">
        <div className="admin-panel__head">
          <div>
            <h2>Editorial library</h2>
            <p>{articles.length} article{articles.length === 1 ? "" : "s"} · {articles.filter((article) => article.status === "published").length} published</p>
          </div>
          <button className="btn btn-gold" type="button" onClick={openCreate}>+ Write an article</button>
        </div>

        {error && !modalOpen && <p className="manage-articles__notice" role="alert">{error}</p>}

        <div className="admin-toolbar">
          <label className="admin-search">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" /><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            <input aria-label="Search articles" placeholder="Search title, slug or category" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <select className="admin-select" aria-label="Filter articles by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Article</th><th>Category</th><th>Status</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5} className="table-empty">Loading articles…</td></tr>
                : filteredArticles.length === 0 ? <tr><td colSpan={5} className="table-empty">{articles.length ? "No articles match these filters." : "No articles yet. Write your first ZARR story."}</td></tr>
                  : filteredArticles.map((article) => (
                    <tr key={article._id}>
                      <td className="manage-articles__title-cell">
                        <strong>{article.title}</strong>
                        <span>/{article.slug}</span>
                      </td>
                      <td>{article.category}</td>
                      <td><span className={`badge ${article.status === "published" ? "badge-active" : "badge-read"}`}>{article.status}</span></td>
                      <td>{formatDate(article.updatedAt)}</td>
                      <td><div className="admin-table__actions">
                        {article.status === "published" && <Link className="btn btn-ghost btn-sm" to={`/journals/${article.slug}`} target="_blank" rel="noreferrer">View</Link>}
                        <button className="btn btn-ghost btn-sm" type="button" onClick={() => openEdit(article)}>Edit</button>
                        <button className="btn btn-danger btn-sm" type="button" onClick={() => { setError(""); setDeleteTarget(article); }}>Delete</button>
                      </div></td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal wide title={editingId ? "Edit article" : "Write an article"} onClose={() => setModalOpen(false)}>
          <form className="manage-articles__form" onSubmit={handleSubmit}>
            {error && <p className="manage-articles__notice" role="alert">{error}</p>}
            <div className="form-grid">
              <div className="form-field form-field--span-2">
                <label htmlFor="article-title">Title</label>
                <input id="article-title" className="admin-input" name="title" value={form.title} onChange={updateField} maxLength={180} placeholder="The quiet engineering of an automatic movement" required />
                <small className="manage-articles__slug">URL slug: <code>{slugPreview(form.title)}</code>{editingId && form.title && <span> · saved with the article</span>}</small>
              </div>
              <div className="form-field">
                <label htmlFor="article-category">Category</label>
                <input id="article-category" className="admin-input" name="category" value={form.category} onChange={updateField} maxLength={60} placeholder="Watch Guides" />
              </div>
              <div className="form-field">
                <label htmlFor="article-author">Author</label>
                <input id="article-author" className="admin-input" name="author" value={form.author} onChange={updateField} maxLength={100} placeholder="ZARR Editorial" />
              </div>
              <div className="form-field form-field--span-2">
                <label htmlFor="article-excerpt">Short introduction</label>
                <textarea id="article-excerpt" className="admin-textarea" name="excerpt" value={form.excerpt} onChange={updateField} maxLength={420} rows={3} placeholder="A concise summary shown on the Journal page." required />
              </div>
              <div className="form-field form-field--span-2">
                <label htmlFor="article-content">Article body</label>
                <textarea id="article-content" className="admin-textarea manage-articles__body" name="content" value={form.content} onChange={updateField} maxLength={100000} rows={14} placeholder="Write your article. Separate paragraphs with a blank line." required />
                <small className="manage-articles__hint">Plain text is supported; blank lines become paragraph breaks.</small>
              </div>
              <div className="form-field form-field--span-2">
                <label htmlFor="article-cover">Cover image URL</label>
                <input id="article-cover" className="admin-input" type="url" name="coverImage" value={form.coverImage} onChange={updateField} maxLength={2048} placeholder="https://…" />
              </div>
              <div className="form-field form-field--span-2">
                <label htmlFor="article-source">Original article link <span>(optional)</span></label>
                <input id="article-source" className="admin-input" type="url" name="sourceUrl" value={form.sourceUrl} onChange={updateField} maxLength={2048} placeholder="Link to the full post on your main blog" />
              </div>
              <div className="form-field">
                <label htmlFor="article-status">Publishing status</label>
                <select id="article-status" className="admin-select" name="status" value={form.status} onChange={updateField}>
                  <option value="draft">Save as draft</option>
                  <option value="published">Publish now</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-gold" disabled={saving}>{saving ? "Saving…" : editingId ? "Save changes" : form.status === "published" ? "Publish article" : "Save draft"}</button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete this article?" onClose={() => setDeleteTarget(null)}>
          {error && <p className="manage-articles__notice" role="alert">{error}</p>}
          <p className="manage-articles__delete-copy">“{deleteTarget.title}” will be permanently removed from the ZARR Journal.</p>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button type="button" className="btn btn-danger" disabled={saving} onClick={handleDelete}>{saving ? "Deleting…" : "Delete article"}</button>
          </div>
        </Modal>
      )}
    </section>
  );
}
