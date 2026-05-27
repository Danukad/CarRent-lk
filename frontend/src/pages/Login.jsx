import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
      window.location.reload();
    } catch (err) {
      alert(
        err.response?.data?.msg ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      console.log("Starting Firebase Google Auth Popup...");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Firebase authenticated user:", user);

      // Send to backend
      const res = await axios.post(
        "http://localhost:5000/api/auth/firebase-login",
        {
          name: user.displayName,
          email: user.email,
          firebaseId: user.uid,
        },
      );

      console.log("Backend response:", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
      window.location.reload();
    } catch (err) {
      console.error("Google login error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        alert("Google login failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        {/* Logo matching the homepage header */}
        <div className="auth-header">
          <Link to="/" className="brand-logo">
            <div className="logo-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <span className="logo-text">
              CarRents<span>.lk</span>
            </span>
          </Link>

          <div className="hero-badge-mini">
            <span className="sparkle">✦</span>
            <span>Welcome back to the marketplace</span>
          </div>

          <h1>Sign in</h1>
          <p>Enter your details to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>EMAIL ADDRESS</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="label-flex">
              <label>PASSWORD</label>
              <Link to="/forgot-password" id="forgot-link">
                Forgot?
              </Link>
            </div>
            <div className="input-wrapper">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button className="btn-login" type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
            {!loading && <span className="arrow">→</span>}
          </button>
        </form>

        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <p style={{ color: "#9CA3AF", fontSize: "14px" }}>OR</p>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="btn-google-auth"
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.56 2.69-3.86 2.69-6.6z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.95v2.3A9 9 0 0 0 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.96 10.69A5.4 5.4 0 0 1 3.6 9c0-.59.1-1.17.29-1.69V5.01H.95A8.99 8.99 0 0 0 0 9c0 1.45.35 2.82.95 4.02l3.01-2.33z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.22A8.99 8.99 0 0 0 9 0 9 9 0 0 0 .95 5.01l3.01 2.33C4.67 5.16 6.66 3.58 9 3.58z"
                />
              </svg>
              <span style={{ marginLeft: "10px" }}>Continue with Google</span>
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            New to CarRents.lk? <Link to="/select-role">Create an account</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          background: #FFFFFF;
          border-radius: 2rem;
          padding: 3rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
          border: 1px solid #F1F5F9;
        }

        .btn-google-auth {
          width: 100%;
          background: #FFFFFF;
          border: 1.5px solid #E5E7EB;
          color: #374151;
          padding: 12px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.01);
          margin-bottom: 0.5rem;
        }

        .btn-google-auth:hover:not(:disabled) {
          background: #F9FAFB;
          border-color: #DDD6FE;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.05);
          transform: translateY(-1px);
        }

        .btn-google-auth:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Logo and Header Styling */
        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .brand-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          margin-bottom: 2rem;
        }

        .logo-icon {
          background: #7C3AED;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-size: 1.4rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.5px;
        }

        .logo-text span {
          color: #7C3AED;
        }

        .hero-badge-mini {
          background: #F5F3FF;
          color: #7C3AED;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 1.5rem;
        }

        .auth-header h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 8px;
        }

        .auth-header p {
          color: #6B7280;
          font-size: 0.95rem;
        }

        /* Form Styling */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group label {
          display: block;
          font-size: 11px;
          font-weight: 800;
          color: #9CA3AF;
          margin-bottom: 8px;
          letter-spacing: 0.05em;
        }

        .label-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        #forgot-link {
          font-size: 11px;
          color: #7C3AED;
          font-weight: 700;
          text-decoration: none;
        }

        .input-wrapper input {
          width: 100%;
          padding: 14px 20px;
          border-radius: 14px;
          border: 1px solid #E5E7EB;
          background: #F9FAFB;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #7C3AED;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
        }

        /* Button Styling */
        .btn-login {
          background: #7C3AED;
          color: white;
          padding: 16px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(124, 58, 237, 0.2);
        }

        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(124, 58, 237, 0.3);
          background: #6D28D9;
        }

        .btn-login:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .arrow {
          font-size: 1.2rem;
          transition: transform 0.2s ease;
        }

        .btn-login:hover .arrow {
          transform: translateX(4px);
        }

        /* Footer Styling */
        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          border-top: 1px solid #F1F5F9;
          padding-top: 1.5rem;
        }

        .auth-footer p {
          color: #6B7280;
          font-size: 0.9rem;
        }

        .auth-footer a {
          color: #7C3AED;
          font-weight: 700;
          text-decoration: none;
          margin-left: 4px;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default Login;
