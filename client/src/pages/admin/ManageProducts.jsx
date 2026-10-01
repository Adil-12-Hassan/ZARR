import { useEffect, useMemo, useState } from "react";
import Modal from "../../components/admin/Modal";
import { productAPI } from "../../api/api";
import "../../styles/components/admin-ui.css";

const EMPTY_FORM = {
  name: "",
  gender: "Unisex",
  category: "",
  movement: "",
  material: "",
  color: "",
  price: "",
  stock: "",
  description: "",
  image: "",
  displayPage: 1,
  isNewArrival: false,
};

const money = (n) => `PKR ${Number(n).toLocaleString()}`;

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [pageFilter, setPageFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesPage = pageFilter === "All" || String(p.displayPage || 1) === String(pageFilter);
      return matchesSearch && matchesPage;
    });
  }, [products, search, pageFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      gender: product.gender || "Unisex",
      category: product.category || "",
      movement: product.movement || "",
      material: product.material || "",
      color: product.color || "",
      price: product.price,
      stock: product.stock,
      description: product.description ?? "",
      image: product.image ?? "",
      displayPage: product.displayPage || 1,
      isNewArrival: Boolean(product.isNewArrival),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      displayPage: Number(form.displayPage),
      isNewArrival: Boolean(form.isNewArrival),
    };

    try {
      if (editingId) {
        await productAPI.update(editingId, payload);
      } else {
        await productAPI.create(payload);
      }
      setModalOpen(false);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to save product.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await productAPI.remove(id);
      setConfirmDeleteId(null);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to delete product.");
    }
  };

  return (
    <div>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <div>
            <h2>All products</h2>
            <p>{products.length} products live on the storefront</p>
          </div>
          <button className="btn btn-gold" onClick={openCreate}>+ Add product</button>
        </div>

        <div className="admin-toolbar">
          <div className="admin-search">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="admin-select" value={pageFilter} onChange={(e) => setPageFilter(e.target.value)}>
            <option value="All">All pages</option>
            {[1,2,3,4,5].map((n) => <option key={n} value={n}>Page {n}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Page</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="table-empty">Loading products…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="table-empty">No products match your search.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p._id}>
                  <td className="admin-table__primary">{p.name}</td>
                  <td>Page {p.displayPage || 1}</td>
                  <td>{money(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`badge ${Number(p.stock) > 0 ? "badge-active" : "badge-cancelled"}`}>
                      {Number(p.stock) > 0 ? "Active" : "Out of stock"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirmDeleteId(p._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editingId ? "Edit product" : "Add product"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field form-field--span-2">
                <label>Product name</label>
                <input className="admin-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ZARR Heritage Automatic" />
              </div>

              <div className="form-field">
                <label>Gender</label>
                <select className="admin-select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div className="form-field">
                <label>Page</label>
                <select className="admin-select" value={form.displayPage} onChange={(e) => setForm({ ...form, displayPage: Number(e.target.value) })}>
                  {[1,2,3,4,5].map((n) => <option key={n} value={n}>Page {n}</option>)}
                </select>
              </div>

              <div className="form-field">
                <label>Category</label>
                <input className="admin-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Classic" />
              </div>

              <div className="form-field">
                <label>Movement</label>
                <input className="admin-input" value={form.movement} onChange={(e) => setForm({ ...form, movement: e.target.value })} placeholder="Automatic" />
              </div>

              <div className="form-field">
                <label>Case material</label>
                <input className="admin-input" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} placeholder="Stainless Steel" />
              </div>

              <div className="form-field">
                <label>Color</label>
                <input className="admin-input" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="Black" />
              </div>

              <div className="form-field">
                <label>Price (PKR)</label>
                <input className="admin-input" type="number" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="89500" />
              </div>

              <div className="form-field">
                <label>Stock</label>
                <input className="admin-input" type="number" min="0" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="14" />
              </div>

              <div className="form-field form-field--span-2">
                <label>Image URL</label>
                <input className="admin-input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              </div>

              <div className="form-field form-field--span-2">
                <label>Description</label>
                <textarea className="admin-textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Automatic movement, premium finish..." />
              </div>

              <div className="form-field form-field--span-2">
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} />
                  Mark as new arrival
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-gold">{editingId ? "Save changes" : "Add product"}</button>
            </div>
          </form>
        </Modal>
      )}

      {confirmDeleteId && (
        <Modal title="Delete product?" onClose={() => setConfirmDeleteId(null)}>
          <p style={{ color: "var(--color-text-soft)", fontSize: 13.5, margin: "0 0 4px" }}>This removes the product from the live catalog.</p>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => handleDelete(confirmDeleteId)}>Delete product</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
