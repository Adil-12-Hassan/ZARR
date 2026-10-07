import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import PasswordInput from "../../components/PasswordInput";

function AccountPage({ type }) {
    const isAddress = type === "Addresses";
    const { user, refreshUser, logout } = useAuth();
    const navigate = useNavigate();
    const profile = user?.user ?? user ?? {};
    const addresses = profile.addresses || [];
    const [form, setForm] = useState({ label: "Home", fullName: profile.username || "", phone: "", address: "", apartment: "", city: "", province: "", postalCode: "", country: "Pakistan", isDefault: false });
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [saving, setSaving] = useState(false);

    const handleAddressSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");
        try {
            await userAPI.addAddress(form);
            await refreshUser();
            setForm({ label: "Home", fullName: profile.username || "", phone: "", address: "", apartment: "", city: "", province: "", postalCode: "", country: "Pakistan", isDefault: false });
            setMessage("Address saved.");
        } catch (err) {
            setError(err.message || "Unable to save address.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        setError("");
        try {
            await userAPI.deleteAddress(id);
            await refreshUser();
        } catch (err) {
            setError(err.message || "Unable to delete address.");
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            await userAPI.changePassword({ currentPassword, newPassword });
            logout();
            navigate("/login", { replace: true, state: { message: "Password updated. Please log in again." } });
        } catch (err) {
            setError(err.message || "Unable to update password.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="page-heading"><div><span>ACCOUNT</span><h2>{type}</h2><p>{isAddress ? "Manage your saved delivery addresses." : "Update your account password."}</p></div></div>
            {error && <p role="alert">{error}</p>}
            {message && <p role="status">{message}</p>}
            {isAddress ? (
                <>
                    <section className="dashboard-panel">
                        <h3>Saved addresses</h3>
                        {addresses.length === 0 ? <p>No saved addresses yet.</p> : addresses.map((address) => (
                            <div key={address._id} className="address-row">
                                <div><strong>{address.label || "Address"}</strong>{address.isDefault && <span> · Default</span>}<p>{address.fullName} · {address.phone}<br />{address.address}{address.apartment ? `, ${address.apartment}` : ""}<br />{[address.city, address.province, address.postalCode, address.country].filter(Boolean).join(", ")}</p></div>
                                <button type="button" className="dashboard-secondary-button" onClick={() => handleDeleteAddress(address._id)}>Delete</button>
                            </div>
                        ))}
                    </section>
                    <section className="dashboard-panel">
                        <h3>Add an address</h3>
                        <form onSubmit={handleAddressSubmit} className="profile-form">
                            {[ ["label", "Label"], ["fullName", "Full name"], ["phone", "Phone"], ["address", "Street address"], ["apartment", "Apartment (optional)"], ["city", "City"], ["province", "Province"], ["postalCode", "Postal code"], ["country", "Country"] ].map(([key, label]) => (
                                <div className="form-group" key={key}><label htmlFor={`address-${key}`}>{label}</label><input id={`address-${key}`} required={!['apartment', 'province', 'postalCode'].includes(key)} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /></div>
                            ))}
                            <label><input type="checkbox" checked={form.isDefault} onChange={(event) => setForm({ ...form, isDefault: event.target.checked })} /> Set as default</label>
                            <button className="dashboard-primary-button" type="submit" disabled={saving}>{saving ? "Saving…" : "Save address"}</button>
                        </form>
                    </section>
                </>
            ) : (
                <section className="dashboard-panel">
                    <h3>Change password</h3>
                    <form onSubmit={handlePasswordSubmit} className="profile-form">
                        <div className="form-group"><label htmlFor="currentPassword">Current password</label><PasswordInput id="currentPassword" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></div>
                        <div className="form-group"><label htmlFor="newPassword">New password</label><PasswordInput id="newPassword" autoComplete="new-password" minLength={8} maxLength={72} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></div>
                        <button className="dashboard-primary-button" type="submit" disabled={saving}>{saving ? "Updating…" : "Update password"}</button>
                    </form>
                </section>
            )}
        </div>
    );
}

export default AccountPage;
