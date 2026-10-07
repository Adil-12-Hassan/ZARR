import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import PasswordInput from "../../components/PasswordInput";

function Settings() {
    const { user, updateProfile, logout } = useAuth();
    const navigate = useNavigate();
    const profile = user?.user ?? user ?? {};
    const [username, setUsername] = useState(profile.username || "");
    const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        setUsername(profile.username || "");
    }, [profile.username]);

    const handleProfileSubmit = async (event) => {
        event.preventDefault();
        setSavingProfile(true);
        setMessage("");
        setError("");
        try {
            await updateProfile({ username: username.trim() });
            setMessage("Profile updated successfully.");
        } catch (err) {
            setError(err.message || "Unable to update your profile.");
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        setSavingPassword(true);
        setMessage("");
        setError("");
        try {
            await userAPI.changePassword(passwords);
            logout();
            navigate("/login", { replace: true, state: { message: "Password updated. Please log in again." } });
        } catch (err) {
            setError(err.message || "Unable to update your password.");
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="page-heading">
                <div><span>ACCOUNT</span><h2>Settings</h2><p>Manage your profile details and sign-in password.</p></div>
            </div>
            {message && <p role="status">{message}</p>}
            {error && <p role="alert">{error}</p>}

            <section className="dashboard-panel profile-panel">
                <div className="profile-intro">
                    <div className="profile-large-avatar">{(profile.username || "ZA").slice(0, 2).toUpperCase()}</div>
                    <div><span>YOUR ZARR ACCOUNT</span><h3>{profile.username || "ZARR Customer"}</h3><p>{profile.email || ""}</p></div>
                </div>
                <form className="profile-form" onSubmit={handleProfileSubmit}>
                    <div className="form-group"><label htmlFor="settingsName">Name</label><input id="settingsName" autoComplete="name" required maxLength={80} value={username} onChange={(event) => setUsername(event.target.value)} /></div>
                    <div className="form-group"><label htmlFor="settingsEmail">Email address</label><input id="settingsEmail" type="email" autoComplete="email" value={profile.email || ""} readOnly /></div>
                    <button className="dashboard-primary-button" type="submit" disabled={savingProfile}>{savingProfile ? "Saving…" : "Save profile"}</button>
                </form>
            </section>

            <section className="dashboard-panel profile-panel">
                <div className="page-heading"><div><span>SECURITY</span><h2>Change password</h2><p>Use a strong password you do not use on other sites.</p></div></div>
                <form className="profile-form" onSubmit={handlePasswordSubmit}>
                    <div className="form-group"><label htmlFor="settingsCurrentPassword">Current password</label><PasswordInput id="settingsCurrentPassword" autoComplete="current-password" required value={passwords.currentPassword} onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))} /></div>
                    <div className="form-group"><label htmlFor="settingsNewPassword">New password</label><PasswordInput id="settingsNewPassword" autoComplete="new-password" minLength={8} maxLength={72} required value={passwords.newPassword} onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))} /></div>
                    <button className="dashboard-primary-button" type="submit" disabled={savingPassword}>{savingPassword ? "Updating…" : "Update password"}</button>
                </form>
            </section>
        </div>
    );
}

export default Settings;
