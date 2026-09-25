import React from "react";
import { useAuth } from "../../context/AuthContext";

function Profile() {
    const { user } = useAuth();
    return (
        <div className="dashboard-page">
            <div className="page-heading">
                <div><span>ACCOUNT</span><h2>Personal Profile</h2><p>Keep your details current for a smoother ZARR experience.</p></div>
            </div>
            <section className="dashboard-panel profile-panel">
                <div className="profile-intro"><div className="profile-large-avatar">{(user?.name || "ZA").slice(0, 2).toUpperCase()}</div><div><span>MEMBER PROFILE</span><h3>{user?.name || "ZARR Customer"}</h3><p>{user?.email || "customer@zarr.com"}</p></div></div>
                <form className="profile-form" onSubmit={(event) => event.preventDefault()}>
                    <div className="form-group"><label htmlFor="profileName">Full name</label><input id="profileName" defaultValue={user?.name || "ZARR Customer"} /></div>
                    <div className="form-group"><label htmlFor="profileEmail">Email address</label><input id="profileEmail" type="email" defaultValue={user?.email || "customer@zarr.com"} /></div>
                    <div className="form-group"><label htmlFor="profilePhone">Phone number</label><input id="profilePhone" placeholder="+92 300 1234567" /></div>
                    <button className="dashboard-primary-button" type="submit">Save Changes <span>→</span></button>
                </form>
            </section>
        </div>
    );
}

export default Profile;
