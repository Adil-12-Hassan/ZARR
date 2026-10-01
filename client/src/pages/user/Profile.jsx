import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function Profile() {
    const { user, updateProfile } = useAuth();
    const profile = user?.user ?? user ?? {};
    const [username, setUsername] = useState(profile.username || "");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setUsername(profile.username || "");
    }, [profile.username]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");
        try {
            await updateProfile({ username: username.trim() });
            setMessage("Profile updated.");
        } catch (err) {
            setError(err.message || "Unable to update profile.");
        } finally {
            setSaving(false);
        }
    };
    return (
        <div className="dashboard-page">
            <div className="page-heading">
                <div><span>ACCOUNT</span><h2>Personal Profile</h2><p>Keep your details current for a smoother ZARR experience.</p></div>
            </div>
            <section className="dashboard-panel profile-panel">
                <div className="profile-intro"><div className="profile-large-avatar">{(profile.username || "ZA").slice(0, 2).toUpperCase()}</div><div><span>MEMBER PROFILE</span><h3>{profile.username || "ZARR Customer"}</h3><p>{profile.email || ""}</p></div></div>
                <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="form-group"><label htmlFor="profileName">Name</label><input id="profileName" required value={username} onChange={(event) => setUsername(event.target.value)} /></div>
                    <div className="form-group"><label htmlFor="profileEmail">Email address</label><input id="profileEmail" type="email" value={profile.email || ""} readOnly /></div>
                    {message && <p role="status">{message}</p>}
                    {error && <p role="alert">{error}</p>}
                    <button className="dashboard-primary-button" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"} <span>→</span></button>
                </form>
            </section>
        </div>
    );
}

export default Profile;
