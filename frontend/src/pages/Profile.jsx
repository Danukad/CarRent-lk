import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Car, Calendar, Star, Banknote, Bell, Plus, TrendingUp, Grid, Settings as SettingsIcon, PenLine, Sparkles, ChevronRight, LogOut
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const user = JSON.parse(localStorage.getItem('user') || 'null') || {
    name: 'Saman Kumara',
    email: 'saman@carrents.lk',
  };
  const initial = user?.name?.[0]?.toUpperCase() || 'S';
  const firstName = user?.name?.split(' ')[0] || 'User';

  const stats = [
    { icon: <Car size={20} />, label: 'My Listings', value: '3', colorClass: 'icon-purple' },
    { icon: <Calendar size={20} />, label: 'Total Rents', value: '12', colorClass: 'icon-blue' },
    { icon: <Star size={20} />, label: 'Rating', value: '4.9', colorClass: 'icon-orange' },
    { icon: <Banknote size={20} />, label: 'Earned', value: 'LKR 124K', colorClass: 'icon-green' },
  ];

  const listings = [
    { brand: 'Toyota', model: 'Aqua', year: 2021, price: 8500, status: 'Active' },
    { brand: 'Honda', model: 'Vezel', year: 2020, price: 12000, status: 'Rented' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Grid size={16} /> },
    { id: 'listings', label: 'My Cars', icon: <Car size={16} /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar size={16} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={16} /> },
  ];

  return (
    <div className="profile-page">
      <div className="container">
        
        {/* Profile Header */}
        <div className="profile-header-card">
          <div className="avatar-wrapper">
            <div className="avatar-lg">{initial}</div>
            <div className="online-indicator"></div>
          </div>
          
          <div className="profile-meta">
            <div className="verified-badge">
              <Sparkles size={12} className="verified-icon" /> Verified Host
            </div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
          
          <button className="edit-btn">
            <PenLine size={16} /> Edit Profile
          </button>
          
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          {stats.map((s, i) => (
            <div key={i} className="stat-box">
              <div className={`stat-icon-wrapper ${s.colorClass}`}>{s.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Nav */}
        <div className="tab-nav-container">
          <div className="tab-nav">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="animate-in">
              <div className="overview-masonry">
                
                <div className="masonry-row">
                  {/* Welcome Back Block */}
                  <div className="overview-card welcome-card">
                    <Bell size={20} className="welcome-bell" />
                    <h2>Welcome back, {firstName}!</h2>
                    <p>Your Toyota Aqua was viewed <strong>45 times</strong> this week — your best week yet.</p>
                    <button className="view-insights-btn">View insights <ChevronRight size={16} /></button>
                  </div>
                  
                  {/* Add New Vehicle Block */}
                  <div className="overview-card add-vehicle-card">
                    <div className="add-icon-wrapper"><Plus size={20} className="icon-purple" /></div>
                    <h3>Add New Vehicle</h3>
                    <p>List another car and earn more every month.</p>
                    <Link to="/list-my-car" className="cta-link">Get started <ChevronRight size={16} /></Link>
                  </div>
                </div>

                <div className="masonry-row">
                  {/* Annual Earnings Block */}
                  <div className="overview-card annual-earnings-card">
                    <div className="icon-wrapper icon-green"><TrendingUp size={20} /></div>
                    <h3>Annual Earnings</h3>
                    <p>You earned <strong>LKR 124,000</strong> this year.</p>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  {/* Active Offers Block */}
                  <div className="overview-card active-offers-card">
                    <div className="offers-left">
                      <div className="icon-wrapper icon-purple"><Star size={20} /></div>
                      <div className="offers-text">
                        <h3>Active Offers</h3>
                        <p>2 new offers waiting for your review.</p>
                      </div>
                    </div>
                    <Link to="#" className="cta-link review-link">Review <ChevronRight size={16} /></Link>
                  </div>
                </div>

               </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="animate-in">
              <div className="section-header">
                <h2>My Vehicles</h2>
                <Link to="/list-my-car" className="btn-sm">+ Add New</Link>
              </div>
              <div className="listings-list">
                {listings.map((item, i) => (
                  <div key={i} className="listing-row">
                    <div className="listing-thumb"><Car className="icon-purple" /></div>
                    <div className="listing-info">
                      <h4>{item.brand} {item.model} ({item.year})</h4>
                      <p>LKR {item.price.toLocaleString()} / day</p>
                    </div>
                    <div className={`status-pill ${item.status.toLowerCase()}`}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="animate-in empty-pane">
              <Calendar size={48} className="icon-blue" />
              <h3>No bookings yet</h3>
              <p>When you rent a vehicle, it will appear here.</p>
              <Link to="/vehicles" className="btn-sm">Browse Vehicles</Link>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-in settings-pane">
              <h2>Account Settings</h2>
              <div className="settings-form">
                <div className="field">
                  <label>Full Name</label>
                  <input type="text" defaultValue={user.name} />
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input type="email" defaultValue={user.email} />
                </div>
                <div className="field">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+94 77 123 4567" />
                </div>
                <button className="btn-primary save-btn">Save Changes</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .profile-page {
          padding: 2.5rem 0 6rem;
          /* Inherits the global premium background from parent */
        }
        
        .profile-header-card {
          background: #ffffff;
          border-radius: 1.5rem;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          flex-wrap: wrap;
        }
        
        .avatar-wrapper {
          position: relative;
          display: flex;
        }

        .avatar-lg {
          width: 88px;
          height: 88px;
          border-radius: 1.25rem;
          background: linear-gradient(135deg, #a855f7, #c084fc); /* Light purple gradient */
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          flex-shrink: 0;
        }

        .online-indicator {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 20px;
          height: 20px;
          background: white;
          border: 4px solid #ffffff;
          border-radius: 50%;
        }

        .profile-meta { 
          flex: 1; 
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: #f3e8ff;
          color: #7e22ce;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          width: fit-content;
          margin-bottom: 0.25rem;
        }

        .verified-icon {
          color: #9333ea;
        }

        .profile-meta h1 { 
          font-size: 2rem; 
          font-weight: 800;
          letter-spacing: -0.5px; 
          color: #111827; 
          margin: 0;
        }

        .profile-meta p { 
          color: #6b7280; 
          font-size: 0.95rem; 
          margin: 0; 
        }

        .edit-btn {
          background: #a855f7;
          color: white;
          border: none;
          border-radius: 100px;
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);
        }
        
        .edit-btn:hover { 
          background: #9333ea; 
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(168, 85, 247, 0.3);
        }

        .logout-btn {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #ef4444;
          border-radius: 100px;
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.2);
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .stat-box {
          background: #ffffff;
          border-radius: 1.25rem;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          transition: all 0.2s ease;
        }
        
        .stat-box:hover { 
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
        }

        .stat-icon-wrapper, .icon-wrapper, .add-icon-wrapper, .earnings-icon-wrapper, .offers-icon-wrapper { 
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .stat-info {
          display: flex;
          flex-direction: column;
        }

        /* Color classes for icons */
        .icon-purple, .stat-icon-wrapper.icon-purple { background: #f3e8ff; color: #a855f7; }
        .icon-blue, .stat-icon-wrapper.icon-blue { background: #e0f2fe; color: #38bdf8; }
        .icon-orange, .stat-icon-wrapper.icon-orange { background: #ffedd5; color: #fb923c; }
        .icon-green, .stat-icon-wrapper.icon-green { background: #dcfce7; color: #4ade80; }

        .stat-value { font-size: 1.25rem; font-weight: 800; color: #111827; line-height: 1.2; }
        .stat-label { font-size: 0.85rem; color: #6b7280; font-weight: 500; }

        /* Navigation Pills */
        .tab-nav-container {
          display: flex;
          margin-bottom: 2rem;
        }
        
        .tab-nav {
          display: inline-flex;
          background: #ffffff;
          border-radius: 100px;
          padding: 0.35rem;
          gap: 0.25rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .tab-btn {
          padding: 0.6rem 1.2rem;
          background: none;
          border: none;
          border-radius: 100px;
          color: #6b7280;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }
        
        .tab-btn:hover { color: #111827; background: #f9fafb; }
        .tab-btn.active { 
          background: #a855f7; 
          color: white; 
          box-shadow: 0 2px 8px rgba(168, 85, 247, 0.25);
        }

        .tab-content { min-height: 300px; }

        /* Overview Masonry specific to exactly match image */
        .overview-masonry {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .masonry-row {
          display: flex;
          gap: 1.25rem;
        }

        .overview-card {
          background: #ffffff;
          border-radius: 1.25rem;
          padding: 1.75rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
        }
        
        .overview-card h3 { 
          font-size: 1.1rem; 
          font-weight: 700;
          color: #111827;
          margin: 0.75rem 0 0.25rem 0; 
        }
        
        .overview-card p { 
          font-size: 0.9rem; 
          color: #6b7280; 
          line-height: 1.5;
          margin-bottom: 0;
        }
        
        .overview-card p strong { color: #111827; }

        .cta-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 1.25rem;
          color: #a855f7;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
        }

        /* Specific Cards */
        .welcome-card {
          flex: 1.7; /* Takes more space */
          background: linear-gradient(135deg, #a855f7 0%, #c084fc 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .welcome-bell {
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .welcome-card h2 {
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
        }
        
        .welcome-card p {
          color: rgba(255,255,255,0.9);
          font-size: 0.95rem;
          max-width: 80%;
          margin-bottom: 2rem;
        }
        
        .welcome-card p strong { color: white; }

        .view-insights-btn {
          background: white;
          color: #a855f7;
          border: none;
          padding: 0.6rem 1.25rem;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          width: fit-content;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        
        .view-insights-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .add-vehicle-card {
          flex: 1; /* Takes less space */
        }
        
        .add-vehicle-card .add-icon-wrapper {
          margin-bottom: 0.5rem;
        }

        .annual-earnings-card {
          flex: 1;
        }
        
        .progress-bar-container {
          height: 6px;
          background: #f3e8ff;
          border-radius: 100px;
          margin-top: 1.25rem;
          overflow: hidden;
        }
        
        .progress-bar-fill {
          height: 100%;
          background: #a855f7;
          border-radius: 100px;
        }

        .active-offers-card {
          flex: 1.7;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1.75rem;
        }
        
        .offers-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .offers-text h3 { margin: 0 0 0.2rem 0; }
        
        .review-link {
          margin-top: 0;
        }

        /* Listings & Other Tabs */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .section-header h2 { font-size: 1.5rem; font-weight: 800; color: #111827; }
        
        .btn-sm {
          background: #a855f7;
          color: white;
          padding: 0.6rem 1.25rem;
          border-radius: 100px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s;
        }

        .listings-list { display: flex; flex-direction: column; gap: 1rem; }
        
        .listing-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background: #ffffff;
          border-radius: 1.25rem;
          padding: 1.25rem 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
        
        .listing-thumb {
          width: 56px;
          height: 56px;
          background: #f8fafc;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .listing-info { flex: 1; }
        .listing-info h4 { font-size: 1.1rem; color: #111827; margin: 0 0 0.25rem 0; font-weight: 700; }
        .listing-info p { font-size: 0.9rem; color: #6b7280; margin: 0; }
        
        .status-pill {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-pill.active { background: #ecfdf5; color: #10b981; }
        .status-pill.rented { background: #fffbeb; color: #f59e0b; }

        .empty-pane {
          background: #ffffff;
          border-radius: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 5rem 2rem;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
        
        .empty-pane h3 { color: #111827; font-size: 1.25rem; font-weight: 700; margin: 0; }
        .empty-pane p { color: #6b7280; margin-bottom: 1rem; }

        .settings-pane {
          background: #ffffff;
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
        
        .settings-pane h2 { margin-bottom: 2rem; font-size: 1.5rem; font-weight: 800; color: #111827; }
        
        .settings-form { 
          display: flex; 
          flex-direction: column; 
          gap: 1.5rem; 
          max-width: 500px; 
        }
        
        .field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .field label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #4b5563;
        }
        
        .field input {
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          font-family: inherit;
          font-size: 1rem;
          color: #111827;
          background: #f9fafb;
          transition: all 0.2s;
        }
        
        .field input:focus {
          outline: none;
          border-color: #a855f7;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
        }
        
        .save-btn { 
          background: #a855f7;
          color: white;
          border: none;
          padding: 0.8rem;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 1rem;
          margin-top: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .save-btn:hover { background: #9333ea; }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .masonry-row { flex-direction: column; }
          .active-offers-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
        
        @media (max-width: 600px) {
          .profile-header-card { flex-direction: column; text-align: center; gap: 1rem; }
          .verified-badge { margin: 0 auto 0.5rem auto; }
          .stats-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Profile;