import { useState } from "react";
import { userAPI } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const EMPTY_ADDRESS = {
    label: "Home", fullName: "", phone: "", address: "", apartment: "",
    city: "", province: "", postalCode: "", country: "Pakistan", isDefault: false,
};

function AccountPage() {
    const { user, refreshUser } = useAuth();
    const profile = user?.user ?? user ?? {};
    const addresses = profile.addresses || [];
    const [form, setForm] = useState({ ...EMPTY_ADDRESS, fullName: profile.username || "" });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleAddressSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");
        try {
            if (editingId) {
                await userAPI.updateMe({ addresses: addresses.map((address) => address._id === editingId ? { ...form, _id: editingId } : address) });
                setEditingId(null);
            } else {
                await userAPI.addAddress(form);
            }
            await refreshUser();
            setForm({ ...EMPTY_ADDRESS, fullName: profile.username || "" });
            setMessage("Address saved.");
        } catch (err) {
            setError(err.message || "Unable to save address.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        setError("");
        setMessage("");
        try {
            await userAPI.deleteAddress(id);
            await refreshUser();
            setMessage("Address removed.");
        } catch (err) {
            setError(err.message || "Unable to delete address.");
        }
    };

    return (
        <div className="dashboard-page">
            <div className="page-heading"><div><span>ACCOUNT</span><h2>Addresses</h2><p>Manage your saved delivery addresses.</p></div></div>
            {error && <p role="alert">{error}</p>}
            {message && <p role="status">{message}</p>}
            <section className="dashboard-panel">
                <h3>Saved addresses</h3>
                {addresses.length === 0 ? <p>No saved addresses yet.</p> : addresses.map((address) => (
                    <div key={address._id} className="address-row">
                        <div><strong>{address.label || "Address"}</strong>{address.isDefault && <span> · Default</span>}<p>{address.fullName} · {address.phone}<br />{address.address}{address.apartment ? `, ${address.apartment}` : ""}<br />{[address.city, address.province, address.postalCode, address.country].filter(Boolean).join(", ")}</p></div>
                        <button type="button" className="dashboard-secondary-button" onClick={() => { setEditingId(address._id); setForm({ ...EMPTY_ADDRESS, ...address }); }}>Edit</button>
                        <button type="button" className="dashboard-secondary-button" onClick={() => handleDeleteAddress(address._id)}>Delete</button>
                    </div>
                ))}
            </section>
            <section className="dashboard-panel">
                <h3>{editingId ? "Edit address" : "Add an address"}</h3>
                <form onSubmit={handleAddressSubmit} className="profile-form">
                    {[["label", "Label"], ["fullName", "Full name"], ["phone", "Phone"], ["address", "Street address"], ["apartment", "Apartment (optional)"], ["city", "City"], ["province", "Province"], ["postalCode", "Postal code"], ["country", "Country"]].map(([key, label]) => (
                        <div className="form-group" key={key}><label htmlFor={`address-${key}`}>{label}</label><input id={`address-${key}`} required={!['apartment', 'province', 'postalCode'].includes(key)} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} /></div>
                    ))}
                    <label><input type="checkbox" checked={form.isDefault} onChange={(event) => setForm((current) => ({ ...current, isDefault: event.target.checked }))} /> Set as default</label>
                    <div className="form-actions">
                        {editingId && <button type="button" className="dashboard-secondary-button" onClick={() => { setEditingId(null); setForm({ ...EMPTY_ADDRESS, fullName: profile.username || "" }); }}>Cancel edit</button>}
                        <button className="dashboard-primary-button" type="submit" disabled={saving}>{saving ? "Saving…" : editingId ? "Save address" : "Add address"}</button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default AccountPage;
