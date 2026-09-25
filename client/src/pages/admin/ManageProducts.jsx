import { useMemo, useState } from "react";
import Modal from "../../components/admin/Modal";
import "../../styles/components/admin-ui.css";

// TODO: replace with your real site's menu structure / categories endpoint
const MENU_SECTIONS = [
  "Men's Watches",
  "Women's Watches",
  "Limited Edition",
  "Accessories",
];

// TODO: replace with data fetched from your API (e.g. GET /api/products)
const SEED_PRODUCTS = [
  {
    id: "P-001",
    name: "ZARR Heritage Automatic",
    section: "Men's Watches",
    price: 89500,
    stock: 14,
    status: "Active",
  },
  {
    id: "P-002",
    name: "ZARR Chrono Elegance",
    section: "Men's Watches",
    price: 95000,
    stock: 9,
    status: "Active",
  },
  {
    id: "P-003",
    name: "ZARR Vanguard Black Edition",
    section: "Limited Edition",
    price: 99500,
    stock: 3,
    status: "Active",
  },
  {
    id: "P-004",
    name: "ZARR Classic Moonphase",
    section: "Women's Watches",
    price: 87000,
    stock: 0,
    status: "Out of stock",
  },
];

const EMPTY_FORM = {
  name: "",
  section: MENU_SECTIONS[0],
  price: "",
  stock: "",
  description: "",
  image: "",
};

const money = (n) => `PKR ${Number(n).toLocaleString()}`;

export default function ManageProducts() {
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesSection =
        sectionFilter === "All" || p.section === sectionFilter;
      return matchesSearch && matchesSection;
    });
  }, [products, search, sectionFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      section: product.section,
      price: product.price,
      stock: product.stock,
      description: product.description ?? "",
      image: product.image ?? "",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // TODO: api.put(`/api/products/${editingId}`, form)
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
                status: Number(form.stock) > 0 ? "Active" : "Out of stock",
              }
            : p,
        ),
      );
    } else {
      // TODO: api.post("/api/products", form)
      const newProduct = {
        id: `P-${String(products.length + 1).padStart(3, "0")}`,
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        status: Number(form.stock) > 0 ? "Active" : "Out of stock",
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    // TODO: api.delete(`/api/products/${id}`)
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <div>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <div>
            <h2>All products</h2>
            <p>
              {products.length} items across {MENU_SECTIONS.length} menu
              sections
            </p>
          </div>
          <button className="btn btn-gold" onClick={openCreate}>
            + Add product
          </button>
        </div>     <div className="admin-toolbar">
          <div className="admin-search">
            <svg viewBox="0 0 24 24" fill="none">
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="m20 20-3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="admin-select"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
          >
            <option>All</option>
            {MENU_SECTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>     <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Menu section</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="table-empty">
                    No products match your search.
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="admin-table__primary">{p.name}</td>
                  <td>{p.section}</td>
                  <td>{money(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span
                      className={`badge ${p.status === "Active" ? "badge-active" : "badge-cancelled"}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setConfirmDeleteId(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>   {modalOpen && (
        <Modal
          title={editingId ? "Edit product" : "Add product"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field form-field--span-2">
                <label>Product name</label>
                <input
                  className="admin-input"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ZARR Heritage Automatic"
                />
              </div>           <div className="form-field">
                <label>Menu section</label>
                <select
                  className="admin-select"
                  value={form.section}
                  onChange={(e) =>
                    setForm({ ...form, section: e.target.value })
                  }
                >
                  {MENU_SECTIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>           <div className="form-field">
                <label>Price (PKR)</label>
                <input
                  className="admin-input"
                  type="number"
                  min="0"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="89500"
                />
              </div>           <div className="form-field">
                <label>Stock quantity</label>
                <input
                  className="admin-input"
                  type="number"
                  min="0"
                  required
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="14"
                />
              </div>           <div className="form-field">
                <label>Image URL</label>
                <input
                  className="admin-input"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://…"
                />
              </div>           <div className="form-field form-field--span-2">
                <label>Description</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Automatic movement, sapphire crystal, leather strap…"
                />
              </div>
            </div>         <div className="form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                {editingId ? "Save changes" : "Add product"}
              </button>
            </div>
          </form>
        </Modal>
      )}   {confirmDeleteId && (
        <Modal title="Delete product?" onClose={() => setConfirmDeleteId(null)}>
          <p
            style={{
              color: "var(--color-text-soft)",
              fontSize: 13.5,
              margin: "0 0 4px",
            }}
          >
            This removes the product from the store and can't be undone.
          </p>
          <div className="form-actions">
            <button
              className="btn btn-ghost"
              onClick={() => setConfirmDeleteId(null)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(confirmDeleteId)}
            >
              Delete product
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
