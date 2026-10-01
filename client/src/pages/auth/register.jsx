import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/pages/auth.css";
import "../../global.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword"); if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    } const result = await register({
      username: formData.get("username"),
      email: formData.get("email"),
      password,
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
                  Crafted for
                  <br /> every moment.
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
          </div>       {/* Right Register Panel */}
          <div className="auth-form-panel">
            <div className="auth-form-wrapper">
              <div className="auth-heading">
                <p className="auth-eyebrow">WELCOME TO ZARR</p>
                <h2>Create Your Account</h2>
                <p className="auth-description">
                  Join the ZARR circle and experience timeless elegance.
                </p>
              </div>           {error && (
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
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    minLength={8}
                    maxLength={72}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  {loading ? "CREATING..." : "CREATE ACCOUNT"}
                  <span>→</span>
                </button>
              </form>           <div className="auth-switch">
                <span>Already have an account?</span>
                <Link to="/login">Login</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Register;
