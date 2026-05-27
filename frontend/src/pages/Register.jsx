import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Car, Coins, Building2, Eye, EyeOff } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parsing the search query parameter
  const queryParams = new URLSearchParams(location.search);
  const urlRole = queryParams.get("role");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "renter",
    companyName: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Handle redirect result when user comes back from Google sign-in
  useEffect(() => {
    if (!urlRole || !["renter", "owner", "company"].includes(urlRole)) {
      navigate("/select-role");
    } else {
      setFormData((prev) => ({ ...prev, role: urlRole }));
    }
  }, [urlRole, navigate]);

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otpCode.join("");
    if (enteredOtp.length < 6) {
      setError("Please enter all 6 digits of the OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        ...formData,
        otp: enteredOtp,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.company) {
        localStorage.setItem("company", JSON.stringify(res.data.company));
      }
      navigate(
        res.data.user.role === "company" ? "/company-dashboard" : "/home",
      );
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.msg || "OTP validation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match! Please check and try again.");
      return;
    }

    // Trigger Send OTP first
    setSendingOtp(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: formData.email,
      });
      setShowOtpModal(true);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send OTP code.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      setError("");
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
      console.error("Google sign-up error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google sign-up failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <polyline points="17 11 19 13 23 9"></polyline>
              </svg>
            </div>
            <span className="logo-text">
              CarRents<span>.lk</span>
            </span>
          </Link>{" "}
          <p>Sign up in seconds and start driving or earning</p>
        </div>

        {/* Selected Role Badge Display */}
        <div className="selected-role-display">
          <div className="role-meta-section">
            <span className="role-desc-label">REGISTERING AS</span>
            {formData.role === "renter" && (
              <div className="role-badge-pill role-renter">
                <Car size={14} />
                <span>Renter</span>
              </div>
            )}
            {formData.role === "owner" && (
              <div className="role-badge-pill role-owner">
                <Coins size={14} />
                <span>Vehicle Owner</span>
              </div>
            )}
            {formData.role === "company" && (
              <div className="role-badge-pill role-company">
                <Building2 size={14} />
                <span>Company Fleet Partner</span>
              </div>
            )}
          </div>
          <Link to="/select-role" className="change-role-link">
            Change Mode
          </Link>
        </div>

        {error && (
          <div className="form-error-alert animate-in">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Google Authentication Button */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
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

        <div className="auth-divider">
          <span>OR SIGN UP WITH EMAIL</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>FULL NAME</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Saman Kumara"
                required
              />
            </div>
          </div>

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
            <label>PASSWORD</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>CONFIRM PASSWORD</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {formData.role === "company" && (
            <div className="company-extra-fields">
              <div className="input-group">
                <label>COMPANY NAME</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Colombo Car Rentals (Pvt) Ltd"
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>PHONE NUMBER</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 77 XXX XXXX"
                  />
                </div>
              </div>
              <div className="input-group">
                <label>ADDRESS / CITY</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Colombo 03, Western Province"
                  />
                </div>
              </div>
            </div>
          )}

          <button className="btn-register" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Get Started"}
            {!loading && <span className="arrow">→</span>}
          </button>
        </form>

        {showOtpModal && (
          <div className="otp-overlay">
            <div className="otp-modal animate-in">
              <div className="otp-header">
                <div className="mail-icon-badge">📩</div>
                <h3>Verify Your Email</h3>
                <p>
                  We've sent a 6-digit verification code to{" "}
                  <strong>{formData.email}</strong>
                </p>
              </div>
              <form onSubmit={handleVerifyOtp}>
                <div className="otp-inputs">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (isNaN(val)) return;
                        const newOtp = [...otpCode];
                        newOtp[idx] = val.substring(val.length - 1);
                        setOtpCode(newOtp);
                        if (val && idx < 5) {
                          document.getElementById(`otp-${idx + 1}`).focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otpCode[idx] && idx > 0) {
                          document.getElementById(`otp-${idx - 1}`).focus();
                        }
                      }}
                    />
                  ))}
                </div>
                {error && <p className="otp-error-msg">⚠️ {error}</p>}
                <div className="otp-actions">
                  <button
                    type="submit"
                    className="btn-verify"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify & Register"}
                  </button>
                  <button
                    type="button"
                    className="btn-otp-cancel"
                    onClick={() => setShowOtpModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
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
          padding: 40px 20px;
          font-family: 'Inter', sans-serif;
        }

        .auth-card {
          width: 100%;
          max-width: 480px;
          background: #FFFFFF;
          border-radius: 2rem;
          padding: 3rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
          border: 1px solid #F1F5F9;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .brand-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          margin-bottom: 1.5rem;
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

        .logo-text { font-size: 1.4rem; font-weight: 800; color: #111827; letter-spacing: -0.5px; }
        .logo-text span { color: #7C3AED; }

        .hero-badge-mini {
          background: #F5F3FF;
          color: #7C3AED;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 1.25rem;
        }

        .auth-header h1 { font-size: 2rem; font-weight: 800; color: #111827; margin-bottom: 8px; }
        .auth-header p { color: #6B7280; font-size: 0.95rem; }

        .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }

        .input-group label { display: block; font-size: 11px; font-weight: 800; color: #9CA3AF; margin-bottom: 8px; letter-spacing: 0.05em; }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper input {
          width: 100%;
          padding: 12px 48px 12px 18px;
          border-radius: 12px;
          border: 1px solid #E5E7EB;
          background: #F9FAFB;
          font-size: 15px;
          transition: all 0.2s ease;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #7C3AED;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
        }

        .password-toggle-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9CA3AF;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          transition: color 0.2s, background-color 0.2s;
        }

        .password-toggle-btn:hover {
          color: #7C3AED;
          background-color: #F5F3FF;
        }

        .selected-role-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F9FAFB;
          border: 1.5px solid #F1F5F9;
          padding: 12px 18px;
          border-radius: 16px;
          margin-bottom: 1.5rem;
        }

        .role-meta-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .role-desc-label {
          font-size: 9px;
          font-weight: 800;
          color: #9CA3AF;
          letter-spacing: 0.05em;
        }

        .role-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .role-renter { background: #F5F3FF; color: #7C3AED; }
        .role-owner { background: #ECFDF5; color: #10B981; }
        .role-company { background: #ECFEFF; color: #06B6D4; }

        .change-role-link {
          font-size: 11px;
          color: #7C3AED;
          font-weight: 700;
          text-decoration: none;
        }

        .change-role-link:hover {
          text-decoration: underline;
        }

        .form-error-alert {
          background: #FEF2F2;
          border: 1.5px solid #FCA5A5;
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.25rem;
          color: #991B1B;
          font-size: 0.85rem;
          font-weight: 600;
          line-height: 1.4;
        }

        .form-error-alert p {
          color: #991B1B;
          margin: 0;
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

        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1.5rem 0;
          color: #9CA3AF;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #F1F5F9;
        }

        .auth-divider:not(:empty)::before { margin-right: .75em; }
        .auth-divider:not(:empty)::after { margin-left: .75em; }

        .company-extra-fields {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.25rem;
          background: #F5F3FF;
          border-radius: 1rem;
          border: 1.5px dashed #DDD6FE;
          animation: fadeIn 0.3s ease;
        }

        .btn-register {
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

        .btn-register:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(124, 58, 237, 0.3); background: #6D28D9; }
        .btn-register:disabled { opacity: 0.6; cursor: not-allowed; }

        .auth-footer { margin-top: 2rem; text-align: center; border-top: 1px solid #F1F5F9; padding-top: 1.5rem; }
        .auth-footer p { color: #6B7280; font-size: 0.9rem; }
        .auth-footer a { color: #7C3AED; font-weight: 700; text-decoration: none; margin-left: 4px; }
        .auth-footer a:hover { text-decoration: underline; }

        .fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 480px) {
          .auth-card { padding: 2rem 1.5rem; }
        }

        /* OTP Modal Styles */
        .otp-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .otp-modal {
          background: white;
          border-radius: 24px;
          padding: 40px;
          max-width: 440px;
          width: 90%;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid #F1F5F9;
        }
        .mail-icon-badge { font-size: 32px; background: #F5F3FF; width: 64px; height: 64px; border-radius: 50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; }
        .otp-modal h3 { font-size: 22px; font-weight: 800; color: #1E293B; margin-bottom: 8px; }
        .otp-modal p { color: #64748B; font-size: 14px; line-height: 1.5; margin-bottom: 30px; }
        .otp-inputs { display:flex; gap:12px; justify-content:center; margin-bottom:24px; }
        .otp-inputs input { width:48px; height:56px; border-radius:12px; border:2px solid #E2E8F0; font-size:24px; font-weight:800; text-align:center; color:#1E293B; background:#F8FAFC; outline:none; transition: all 0.2s ease; }
        .otp-inputs input:focus { border-color:#7C3AED; background:white; box-shadow:0 0 0 4px rgba(124,58,237,0.15); }
        .otp-error-msg { color:#DC2626; font-size:13px; font-weight:600; margin-bottom:20px; }
        .otp-actions { display:flex; flex-direction:column; gap:12px; }
        .btn-verify { width:100%; background:#7C3AED; color:white; font-weight:700; padding:14px; border-radius:100px; border:none; font-size:15px; cursor:pointer; box-shadow:0 4px 14px rgba(124,58,237,0.3); }
        .btn-verify:hover { background:#6D28D9; transform:translateY(-1px); }
        .btn-otp-cancel { background:none; border:none; color:#64748B; font-weight:700; font-size:14px; cursor:pointer; }
        .btn-otp-cancel:hover { color:#1E293B; text-decoration:underline; }
      `}</style>
    </div>
  );
};

export default Register;
