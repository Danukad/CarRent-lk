import React from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="splash-page">
      {/* Video Background */}
      <div className="video-background">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-highway-at-sunset-34538-large.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Content Wrapper */}
      <div className="content-wrapper">
        {/* Top Bar */}
        <header className="splash-header">
          <div className="splash-logo">
            <div className="logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="url(#logo-grad)" strokeWidth="2.5" opacity="0.3" />
                <path d="M20 4C11.163 4 4 11.163 4 20s7.163 16 16 16c4.418 0 8.418-1.791 11.314-4.686"
                  stroke="url(#logo-grad)" strokeWidth="3" strokeLinecap="round" fill="none" />
                <circle cx="20" cy="20" r="6" fill="url(#logo-grad)" />
                <defs>
                  <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40">
                    <stop stopColor="#8b5cf6" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="logo-text-container">
              <span className="logo-text">CarRents</span>
              <span className="logo-domain">.lk</span>
            </div>
          </div>
          <div className="splash-auth-buttons">
            <button className="splash-login-btn" onClick={() => navigate('/login')}>
              <span>Login</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="splash-register-btn" onClick={() => navigate('/register')}>
              <span>Sign Up</span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2l1.5 4.5L14 8l-4.5 1.5L8 14l-1.5-4.5L2 8l4.5-1.5L8 2z" fill="currentColor" />
            </svg>
            <span>Sri Lanka's Premier Car Rental Platform</span>
          </div>
          <h1 className="hero-title">
            Your Journey, <span className="gradient-text">Your Choice</span>
          </h1>
          <p className="hero-subtitle">Rent cars or hire drivers. List your vehicle and earn today.</p>
        </div>

        {/* Main Cards */}
        <div className="splash-cards">
          {/* Card 1: List */}
          <div className="splash-card card-purple">
            <div className="card-glow purple-glow"></div>
            <div className="card-content">
              <div className="card-icon-badge">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <path d="M3 21h22M6 21l3-9h10l3 9M8 12h12M10 21v3M18 21v3M8 16h3M17 16h3"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2>List Your Vehicle</h2>
              <p>Turn your car into income. Simple registration, verified bookings.</p>

              <div className="card-features">
                <div className="feature-item">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M15 5L7 13L3 9" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Quick Setup</span>
                </div>
                <div className="feature-item">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M15 5L7 13L3 9" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Secure Payments</span>
                </div>
              </div>

              <button className="card-btn btn-purple" onClick={() => navigate('/list-my-car')}>
                <span>List Now</span>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M7 14l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Card 2: Rent */}
          <div className="splash-card card-green">
            <div className="card-glow green-glow"></div>
            <div className="card-content">
              <div className="card-icon-badge">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <path d="M3 21h22M6 21l3-9h10l3 9M8 12h12M10 21v3M18 21v3M8 16h3M17 16h3"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2>Rent a Car</h2>
              <p>Choose from verified vehicles. Transparent pricing, easy booking.</p>

              <div className="card-features">
                <div className="feature-item">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M15 5L7 13L3 9" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Verified Fleet</span>
                </div>
                <div className="feature-item">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M15 5L7 13L3 9" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>24/7 Support</span>
                </div>
              </div>

              <button className="card-btn btn-green" onClick={() => navigate('/vehicles')}>
                <span>Rent Now</span>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M7 14l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Vehicles</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>

        {/* Bottom Bar */}
        <footer className="splash-footer">
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-lang">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 8h12M8 2c-1.5 2-1.5 4-1.5 6s0 4 1.5 6M8 2c1.5 2 1.5 4 1.5 6s0 4-1.5 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>ENG / SIN</span>
          </div>
        </footer>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .splash-page {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Video Background */
        .video-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .background-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.85) 0%, 
            rgba(109, 40, 217, 0.75) 25%, 
            rgba(6, 182, 212, 0.7) 50%, 
            rgba(16, 185, 129, 0.75) 75%, 
            rgba(5, 150, 105, 0.85) 100%
          );
          backdrop-filter: blur(2px);
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .splash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          animation: slideDown 0.6s ease-out;
          flex-shrink: 0;
        }

        .splash-auth-buttons {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .splash-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: transform 0.3s;
        }

        .splash-logo:hover {
          transform: scale(1.05);
        }

        .logo-icon {
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .logo-text-container {
          display: flex;
          align-items: baseline;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }

        .logo-domain {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .splash-login-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.625rem 1.5rem;
          border-radius: 3rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .splash-login-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        .splash-register-btn {
          background: white;
          border: 1.5px solid white;
          color: #1e1b4b;
          padding: 0.625rem 1.5rem;
          border-radius: 3rem;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .splash-register-btn:hover {
          background: #f8fafc;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        /* Hero Section */
        .hero-section {
          text-align: center;
          padding: 1.5rem 1rem;
          animation: fadeInUp 0.8s ease-out 0.2s both;
          flex-shrink: 0;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.4rem 1rem;
          border-radius: 2rem;
          color: white;
          font-size: 0.8rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 900;
          color: white;
          line-height: 1.1;
          margin-bottom: 0.75rem;
          letter-spacing: -2px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #fbbf24, #f59e0b, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          to { background-position: 200% center; }
        }

        .hero-subtitle {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.9);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
        }

        /* Cards */
        .splash-cards {
          display: flex;
          justify-content: center;
          align-items: stretch;
          gap: 1.5rem;
          padding: 1.5rem 1rem;
          flex-wrap: wrap;
          max-width: 100%;
          margin: 0 auto;
          flex: 1;
        }

        .splash-card {
          position: relative;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 1.25rem;
          padding: 0;
          width: 100%;
          max-width: 320px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: cardFloat 0.8s ease-out both;
          display: flex;
          flex-direction: column;
        }

        .splash-card:nth-child(1) {
          animation-delay: 0.4s;
        }

        .splash-card:nth-child(2) {
          animation-delay: 0.5s;
        }

        @keyframes cardFloat {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .splash-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .card-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }

        .purple-glow {
          background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
        }

        .green-glow {
          background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
        }

        .splash-card:hover .card-glow {
          opacity: 1;
        }

        .card-content {
          position: relative;
          z-index: 1;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-icon-badge {
          width: 56px;
          height: 56px;
          border-radius: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          transition: transform 0.3s;
        }

        .card-purple .card-icon-badge {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
        }

        .card-green .card-icon-badge {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .splash-card:hover .card-icon-badge {
          transform: scale(1.1) rotate(5deg);
        }

        .splash-card h2 {
          font-size: 1.25rem;
          color: #111827;
          margin-bottom: 0.75rem;
          line-height: 1.2;
          font-weight: 800;
        }

        .splash-card p {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1.25rem;
          flex-grow: 1;
        }

        .card-features {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 1.5rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #374151;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .card-btn {
          width: 100%;
          padding: 0.85rem;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 700;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
          margin-top: auto;
        }

        .card-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .card-btn:hover::before {
          left: 100%;
        }

        .btn-purple {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }

        .btn-purple:hover {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
        }

        .btn-green {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .btn-green:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
        }

        /* Stats Section */
        .stats-section {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          padding: 1.25rem;
          margin: 0 auto;
          max-width: 700px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: fadeInUp 1s ease-out 0.6s both;
          flex-wrap: wrap;
          flex-shrink: 0;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 900;
          color: white;
          line-height: 1;
          margin-bottom: 0.3rem;
        }

        .stat-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.3);
        }

        /* Footer */
        .splash-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          animation: slideUp 0.6s ease-out;
          flex-shrink: 0;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .footer-links {
          display: flex;
          gap: 1.5rem;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.85rem;
          transition: all 0.3s;
        }

        .footer-links a:hover {
          color: white;
          transform: translateY(-2px);
        }

        .footer-lang {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          font-size: 0.85rem;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .splash-header,
          .splash-footer {
            padding: 1rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 0.95rem;
          }

          .splash-cards {
            gap: 1rem;
            padding: 1rem;
          }

          .splash-card {
            max-width: 100%;
          }

          .stat-divider {
            width: 1px;
            height: 35px;
          }
        }

        @media (max-width: 480px) {
          .logo-text,
          .logo-domain {
            font-size: 1.2rem;
          }

          .hero-title {
            font-size: 1.75rem;
          }

          .hero-subtitle {
            font-size: 0.9rem;
          }

          .splash-cards {
            flex-direction: column;
            gap: 1rem;
          }

          .splash-card {
            max-width: 100%;
          }

          .stats-section {
            flex-direction: column;
            gap: 1rem;
          }

          .stat-divider {
            width: 40px;
            height: 1px;
          }

          .splash-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Splash;