import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Coins, Building2, ArrowRight } from 'lucide-react';

const SelectRole = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'renter',
      title: 'Rent a Car',
      desc: 'Browse and book premium, verified vehicles from trusted hosts across Sri Lanka in just a few clicks.',
      icon: <Car size={32} />,
      badge: 'Fast & Easy',
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#DDD6FE',
    },
    {
      id: 'owner',
      title: 'List my Car',
      desc: 'Turn your private vehicle into a reliable stream of passive income. Your vehicle is safe with our comprehensive coverage.',
      icon: <Coins size={32} />,
      badge: 'Earn Passive Income',
      color: '#10B981',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
    },
    {
      id: 'company',
      title: 'Register Company',
      desc: 'Manage your full fleet of vehicles, view bookings, list multiple cars, and scale your car rental company professionally.',
      icon: <Building2 size={32} />,
      badge: 'For Fleet Partners',
      color: '#06B6D4',
      bgColor: '#ECFEFF',
      borderColor: '#CFFAFE',
    }
  ];

  return (
    <div className="role-page">
      <div className="role-card-container fade-in">
        <div className="role-header">
          <Link to="/" className="brand-logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
              </svg>
            </div>
            <span className="logo-text">CarRents<span>.lk</span></span>
          </Link>

          <div className="hero-badge-mini">
            <span className="sparkle">✦</span>
            <span>Join Sri Lanka's premium marketplace</span>
          </div>

          <h1>Select Your Journey</h1>
          <p>Choose how you want to experience CarRents.lk today</p>
        </div>

        <div className="roles-grid">
          {roles.map((role) => (
            <div 
              key={role.id}
              className="role-card-wrapper"
              onClick={() => navigate(`/register?role=${role.id}`)}
              style={{
                '--hover-color': role.color,
                '--hover-bg': role.bgColor,
                '--hover-border': role.borderColor
              }}
            >
              <div className="role-badge" style={{ backgroundColor: role.bgColor, color: role.color }}>
                {role.badge}
              </div>
              <div className="role-icon-box" style={{ color: role.color, backgroundColor: role.bgColor }}>
                {role.icon}
              </div>
              <h3>{role.title}</h3>
              <p>{role.desc}</p>
              <button className="role-card-btn" style={{ '--btn-color': role.color }}>
                <span>Select & Continue</span>
                <ArrowRight size={16} className="arrow-icon" />
              </button>
            </div>
          ))}
        </div>

        <div className="role-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>

      <style>{`
        .role-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          padding: 40px 20px;
          font-family: 'Inter', sans-serif;
        }

        .role-card-container {
          width: 100%;
          max-width: 1050px;
          background: #FFFFFF;
          border-radius: 2rem;
          padding: 4rem 3rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.04);
          border: 1px solid #F1F5F9;
        }

        .role-header {
          text-align: center;
          margin-bottom: 3.5rem;
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
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 1.5rem;
        }

        .role-header h1 { 
          font-size: 2.25rem; 
          font-weight: 900; 
          color: #111827; 
          margin-bottom: 10px;
          letter-spacing: -0.5px;
        }
        
        .role-header p { 
          color: #6B7280; 
          font-size: 1rem; 
        }

        .roles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .role-card-wrapper {
          border: 2px solid #F1F5F9;
          background: #FCFDFE;
          border-radius: 1.5rem;
          padding: 2.5rem 2rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }

        .role-card-wrapper:hover {
          border-color: var(--hover-border);
          background: #FFFFFF;
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
        }

        .role-badge {
          position: absolute;
          top: 1rem;
          right: 1.25rem;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 100px;
          letter-spacing: 0.02em;
        }

        .role-icon-box {
          width: 64px;
          height: 64px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          transition: transform 0.3s ease;
        }

        .role-card-wrapper:hover .role-icon-box {
          transform: scale(1.1) rotate(5deg);
        }

        .role-card-wrapper h3 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 0.75rem;
        }

        .role-card-wrapper p {
          font-size: 0.9rem;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 2rem;
          flex-grow: 1;
        }

        .role-card-btn {
          width: 100%;
          background: #F9FAFB;
          color: #4B5563;
          border: 1.5px solid #E5E7EB;
          padding: 12px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .role-card-wrapper:hover .role-card-btn {
          background: var(--hover-color);
          color: #FFFFFF;
          border-color: var(--hover-color);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .arrow-icon {
          transition: transform 0.2s ease;
        }

        .role-card-btn:hover .arrow-icon,
        .role-card-wrapper:hover .arrow-icon {
          transform: translateX(4px);
        }

        .role-footer {
          text-align: center;
          border-top: 1px solid #F1F5F9;
          padding-top: 2rem;
        }

        .role-footer p {
          color: #6B7280;
          font-size: 0.95rem;
        }

        .role-footer a {
          color: #7C3AED;
          font-weight: 700;
          text-decoration: none;
          margin-left: 4px;
        }

        .role-footer a:hover {
          text-decoration: underline;
        }

        .fade-in { 
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); 
        }

        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }

        @media (max-width: 900px) {
          .roles-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .role-card-container {
            padding: 3rem 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SelectRole;
