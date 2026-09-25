import React from "react";

function AccountPage({ type }) {
    const isAddress = type === "Addresses";
    return (
        <div className="dashboard-page">
            <div className="page-heading"><div><span>ACCOUNT</span><h2>{type}</h2><p>{isAddress ? "Manage the places where your ZARR pieces should arrive." : "Manage your account preferences and notifications."}</p></div></div>
            <section className="dashboard-panel empty-account-panel">
                <div className="empty-account-icon">{isAddress ? "⌖" : "⚙"}</div>
                <h3>{isAddress ? "Your delivery addresses" : "Account preferences"}</h3>
                <p>{isAddress ? "Your saved delivery address will appear here when you place your next order." : "Your communication and security preferences are ready to be configured."}</p>
                <button className="dashboard-secondary-button">{isAddress ? "Add an address" : "Update preferences"} <span>→</span></button>
            </section>
        </div>
    );
}

export default AccountPage;