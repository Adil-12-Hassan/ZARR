import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import PasswordInput from "../../components/PasswordInput";
import "../../styles/pages/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget); const result = await login({
      email: formData.get("loginIdentifier"),
      password: formData.get("password"),
    }); if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <section className="auth-container">
          {/* Left Visual Panel */}
          <div className="auth-visual">
            <div className="auth-visual-overlay">
              <div className="auth-brand">
                <span className="auth-brand-mark">Z</span>
                <span className="auth-brand-name">ZARR.</span>
              </div>
              <div className="auth-visual-content">
                <p className="auth-eyebrow">TIMELESS ELEGANCE</p>
                <h1>
                  Crafted for <br /> every moment.
                </h1>
                <p>
                  Precision, passion and prestige.
                  <br />
                  Discover the art of timeless watchmaking.
                </p>
              </div>
              <div className="auth-visual-footer">
                <span>PRECISION</span>
                <span>|</span>
                <span>PRESTIGE</span>
                <span>|</span>
                <span>LEGACY</span>
              </div>
            </div>
          </div>       {/* Right Login Panel */}
          <div className="auth-form-panel">
            <div className="auth-form-wrapper">
              <div className="auth-heading">
                <p className="auth-eyebrow">WELCOME BACK</p>
                <h2>Sign In</h2>
                <p className="auth-description">
                  Enter your credentials to access your ZARR account.
                </p>
              </div>           {/* Error message */}
              {error && (
                <p
                  style={{
                    color: "red",
                    marginBottom: "1rem",
                    fontSize: "0.9rem",
                  }}
                >
                  {error}
                </p>
              )}           <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="loginIdentifier">Email</label>
                  <input
                    type="email"
                    id="loginIdentifier"
                    name="loginIdentifier"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="loginPassword">Password</label>
                  <PasswordInput
                    id="loginPassword"
                    name="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className="auth-options">
                  <label className="remember-me">
                    <input type="checkbox" name="remember" />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  {loading ? "SIGNING IN..." : "SIGN IN"}
                  <span>→</span>
                </button>
              </form>           <div className="auth-switch">
                <span>Don't have an account?</span>
                <Link to="/register">Create one</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Login;
