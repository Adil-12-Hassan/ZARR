import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/pages/adminLogin.css";
import securityImage from "../../assets/admin-login.png";

function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); const formData = new FormData(e.currentTarget);
    const result = await adminLogin({
      email: formData.get("email"),
      password: formData.get("password"),
    }); if (result.success) {
      navigate("/admin");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="admin-login-page">
      <Navbar />
      <main className="admin-login-section">
        {/* LEFT SECURITY PANEL */}
        <section className="admin-security-panel">
          <div className="security-image-wrapper">
            <img
              src={securityImage}
              alt="Secure admin access"
              className="security-image"
            />
            <div className="security-image-overlay"></div>
          </div>
          <div className="security-content">
            <div className="security-warning">
              <div className="warning-icon">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div className="warning-text">
                <p>
                  This area is restricted to authorized administrators only. If
                  you are not an admin, please visit the public website.
                </p>
                <a href="/" className="public-page-button">
                  <span>VISIT PUBLIC PAGE</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </a>
                <h3>ONLY FOR ADMINS</h3>
              </div>
            </div>
          </div>
        </section>     {/* LOGIN FORM PANEL */}
        <section className="admin-form-panel">
          <div className="admin-form-container">
            <div className="admin-lock-icon">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div className="admin-heading">
              <h1>ADMIN PANEL</h1>
              <h2>Secure Login</h2>
              <span className="heading-line"></span>
              <p>
                Please sign in with your admin credentials to access the secure
                dashboard.
              </p>
            </div>         {error && (
              <p
                style={{
                  color: "red",
                  marginBottom: "1rem",
                  fontSize: "0.9rem",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}         <form className="admin-login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="admin-email">ADMIN EMAIL</label>
                <div className="input-wrapper">
                  <i className="fa-regular fa-user"></i>
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    placeholder="Enter admin email"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="admin-password">PASSWORD</label>
                <div className="input-wrapper">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <i
                      className={
                        showPassword
                          ? "fa fa-eye-slash"
                          : "fa fa-eye"
                      }
                    ></i>
                  </button>
                </div>
              </div>
              <div className="login-options">
                <label className="remember-option">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password">Forgot password?</a>
              </div>
              <button
                type="submit"
                className="admin-login-button"
                disabled={loading}
              >
                <span>{loading ? "LOGGING IN..." : "LOGIN"}</span>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </form>       </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AdminLogin;
