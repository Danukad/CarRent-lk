import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#8B5CF6" />
              <path d="M8 20l2-6h12l2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="11" cy="21" r="2" fill="white" />
              <circle cx="21" cy="21" r="2" fill="white" />
            </svg>
          </div>
          <span className="logo-text">CarRents<span className="logo-domain">.lk</span></span>
        </Link>

        {/* Nav Links - Centered */}
        <div className="nav-links">
          <Link to="/vehicles" className="nav-item">Rent</Link>
          {user && user.role === 'company' ? (
            <Link to="/company-dashboard" className="nav-item">Dashboard</Link>
          ) : (
            <Link to="/list-my-car" className="nav-item">List Vehicle</Link>
          )}
          <Link to="/companies" className="nav-item">Companies</Link>
          <a href="#how-it-works" className="nav-item">How it works</a>
          <Link to="/why-us" className="nav-item">Why us</Link>
        </div>

        {/* Auth Buttons */}
        <div className="nav-auth">
          {token ? (
            <Link to="/profile" className="nav-item btn-primary" style={{ padding: '0.65rem 1.5rem', background: 'transparent', border: '2px solid #8b5cf6', color: '#8b5cf6' }}>Profile</Link>
          ) : (
            <>
              <Link to="/login" className="nav-item sign-in">Sign in</Link>
              <Link to="/select-role" className="btn-getstarted">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
        </button>
      </div>

      <style>{`
        .navbar {
          height: 80px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-inner {
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
        }

        .logo-domain {
          color: #8b5cf6;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .nav-item {
          color: #6b7280;
          font-weight: 500;
          font-size: 0.95rem;
          text-decoration: none;
          transition: color 0.2s;
        }

        .nav-item:hover {
          color: #111827;
        }

        .nav-auth {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .sign-in {
          color: #111827;
          font-weight: 600;
        }

        .btn-getstarted {
          background: #8b5cf6;
          color: white;
          padding: 0.65rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
          border: none;
        }

        .btn-getstarted:hover {
          background: #7c3aed;
          transform: translateY(-1px);
        }

        .burger {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .burger span {
          width: 24px;
          height: 2px;
          background: #374151;
          transition: 0.3s;
        }

        @media (max-width: 1024px) {
          .nav-links {
            display: none;
          }
          .burger {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;