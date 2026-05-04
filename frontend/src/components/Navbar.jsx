import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/home" className="logo">
          CarRents<span className="logo-domain">.lk</span>
        </Link>
        <div className="nav-links">
          <Link to="/vehicles">Find a Car</Link>
          <Link to="/list-my-car">List Your Car</Link>
          {token ? (
            <div className="user-nav">
              <span className="user-name">Hi, {user?.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-auth btn-logout">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn-auth btn-login">Login</Link>
          )}
        </div>
      </div>
      <style>{`
        .navbar {
          height: 72px;
          display: flex;
          align-items: center;
          background: rgba(26, 5, 51, 0.75);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(139, 92, 246, 0.25);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }
        .logo-domain {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .nav-links a {
          font-weight: 600;
          color: var(--text-muted);
          transition: all 0.3s;
          font-size: 0.95rem;
        }
        .nav-links a:hover {
          color: white;
          transform: translateY(-1px);
        }
        .user-nav {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .user-name {
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
        }
        .btn-auth {
          padding: 0.6rem 1.5rem;
          border-radius: 3rem;
          font-size: 0.95rem;
          font-weight: 700;
          transition: all 0.3s;
          cursor: pointer;
        }
        .btn-login {
          background: var(--grad-primary);
          color: white !important;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }
        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }
        .btn-logout {
          background: rgba(255, 255, 255, 0.1);
          border: 1.5px solid var(--border);
          color: white;
        }
        .btn-logout:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
