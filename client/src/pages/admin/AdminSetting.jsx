import { useState } from "react";
import "../../styles/components/admin-ui.css";
import "../../styles/pages/adminSetting.css";

const INITIAL_STORE = {
  storeName: "ZARR",
  supportEmail: "support@zarr.com",
  phone: "+92 300 1234567",
  address: "Gulberg III, Lahore, Pakistan",
  currency: "PKR",
  warranty: "2 years international warranty",
};

const INITIAL_SHIPPING = {
  freeShippingThreshold: "50000",
  standardFee: "0",
  processingDays: "2",
  codEnabled: true,
  cardsEnabled: true,
};

const INITIAL_NOTIFICATIONS = {
  newOrderEmail: true,
  newMessageEmail: true,
  lowStockAlert: true,
  weeklySummary: false,
};

function Toggle({ checked, onChange, label }) {
  return (
    <label className="settings-toggle">
      <span>{label}</span>
      <button
        type="button"
        className={`settings-switch ${checked ? "is-on" : ""}`}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      >
        <span className="settings-switch__knob" />
      </button>
    </label>
  );
}

export default function AdminSettings() {
  const [store, setStore] = useState(INITIAL_STORE);
  const [shipping, setShipping] = useState(INITIAL_SHIPPING);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [savedBanner, setSavedBanner] = useState("");

  const flashSaved = (section) => {
    setSavedBanner(section);
    setTimeout(() => setSavedBanner(""), 2200);
  };

  const handleStoreSubmit = (e) => {
    e.preventDefault();
    // TODO: api.put("/api/settings/store", store)
    flashSaved("Store details saved");
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    // TODO: api.put("/api/settings/shipping", shipping)
    flashSaved("Shipping & payment settings saved");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      alert("New password and confirmation don't match.");
      return;
    }
    // TODO: api.post("/api/settings/change-password", passwords)
    setPasswords({ current: "", next: "", confirm: "" });
    flashSaved("Password updated");
  };

  return (
    <div>
      {savedBanner && <div className="settings-banner">{savedBanner}</div>}   <div className="admin-grid admin-grid--2">
        <div className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2>Store details</h2>
              <p>Shown on invoices, the site footer and order emails</p>
            </div>
          </div>
          <form onSubmit={handleStoreSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label>Store name</label>
                <input
                  className="admin-input"
                  value={store.storeName}
                  onChange={(e) =>
                    setStore({ ...store, storeName: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <label>Support email</label>
                <input
                  className="admin-input"
                  type="email"
                  value={store.supportEmail}
                  onChange={(e) =>
                    setStore({ ...store, supportEmail: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input
                  className="admin-input"
                  value={store.phone}
                  onChange={(e) =>
                    setStore({ ...store, phone: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <label>Currency</label>
                <select
                  className="admin-select"
                  value={store.currency}
                  onChange={(e) =>
                    setStore({ ...store, currency: e.target.value })
                  }
                >
                  <option>PKR</option>
                  <option>USD</option>
                  <option>AED</option>
                </select>
              </div>
              <div className="form-field form-field--span-2">
                <label>Store address</label>
                <input
                  className="admin-input"
                  value={store.address}
                  onChange={(e) =>
                    setStore({ ...store, address: e.target.value })
                  }
                />
              </div>
              <div className="form-field form-field--span-2">
                <label>Warranty text</label>
                <input
                  className="admin-input"
                  value={store.warranty}
                  onChange={(e) =>
                    setStore({ ...store, warranty: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-gold">
                Save store details
              </button>
            </div>
          </form>
        </div>     <div className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2>Shipping &amp; payment</h2>
              <p>Controls checkout behaviour storewide</p>
            </div>
          </div>
          <form onSubmit={handleShippingSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label>Free shipping over (PKR)</label>
                <input
                  className="admin-input"
                  type="number"
                  value={shipping.freeShippingThreshold}
                  onChange={(e) =>
                    setShipping({
                      ...shipping,
                      freeShippingThreshold: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-field">
                <label>Standard shipping fee (PKR)</label>
                <input
                  className="admin-input"
                  type="number"
                  value={shipping.standardFee}
                  onChange={(e) =>
                    setShipping({ ...shipping, standardFee: e.target.value })
                  }
                />
              </div>
              <div className="form-field form-field--span-2">
                <label>Order processing time (days)</label>
                <input
                  className="admin-input"
                  type="number"
                  value={shipping.processingDays}
                  onChange={(e) =>
                    setShipping({ ...shipping, processingDays: e.target.value })
                  }
                />
              </div>
            </div>         <div
              style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Toggle
                label="Cash on delivery"
                checked={shipping.codEnabled}
                onChange={(v) => setShipping({ ...shipping, codEnabled: v })}
              />
              <Toggle
                label="Card payments"
                checked={shipping.cardsEnabled}
                onChange={(v) => setShipping({ ...shipping, cardsEnabled: v })}
              />
            </div>         <div className="form-actions">
              <button type="submit" className="btn btn-gold">
                Save shipping &amp; payment
              </button>
            </div>
          </form>
        </div>
      </div>   <div className="admin-grid admin-grid--2" style={{ marginTop: 20 }}>
        <div className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2>Notifications</h2>
              <p>What the admin inbox and email get notified about</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Toggle
              label="Email me on new orders"
              checked={notifications.newOrderEmail}
              onChange={(v) =>
                setNotifications({ ...notifications, newOrderEmail: v })
              }
            />
            <Toggle
              label="Email me on new contact messages"
              checked={notifications.newMessageEmail}
              onChange={(v) =>
                setNotifications({ ...notifications, newMessageEmail: v })
              }
            />
            <Toggle
              label="Low stock alerts"
              checked={notifications.lowStockAlert}
              onChange={(v) =>
                setNotifications({ ...notifications, lowStockAlert: v })
              }
            />
            <Toggle
              label="Weekly performance summary"
              checked={notifications.weeklySummary}
              onChange={(v) =>
                setNotifications({ ...notifications, weeklySummary: v })
              }
            />
          </div>
        </div>     <div className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2>Admin account</h2>
              <p>Change the password used to sign in to this panel</p>
            </div>
          </div>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-grid form-grid--1">
              <div className="form-field">
                <label>Current password</label>
                <input
                  className="admin-input"
                  type="password"
                  required
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <label>New password</label>
                <input
                  className="admin-input"
                  type="password"
                  required
                  value={passwords.next}
                  onChange={(e) =>
                    setPasswords({ ...passwords, next: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <label>Confirm new password</label>
                <input
                  className="admin-input"
                  type="password"
                  required
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-outline">
                Update password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
