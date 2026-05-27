import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, MapPin, Car, Search, ArrowRight } from 'lucide-react';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/companies${search ? `?search=${search}` : ''}`);
        setCompanies(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [search]);

  return (
    <div className="companies-page">
      {/* Hero */}
      <div className="companies-hero">
        <div className="companies-hero-inner">
          <div className="companies-badge"><Building2 size={14}/> Verified Partners</div>
          <h1>Rent from Sri Lanka's<br/><span>Trusted Companies</span></h1>
          <p>Browse our network of verified car rental companies offering premium fleets across the island.</p>
          <div className="companies-search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search companies by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="companies-grid-section">
        <div className="companies-grid-inner">
          {loading ? (
            <div className="loading-state">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="company-card-skeleton"/>)}
            </div>
          ) : companies.length === 0 ? (
            <div className="empty-state">
              <Building2 size={48} color="#DDD6FE"/>
              <h3>No companies found</h3>
              <p>Be the first to register your company on CarRents.lk</p>
              <Link to="/register?role=company" className="btn-register-company">Register Your Company →</Link>
            </div>
          ) : (
            <div className="company-cards-grid">
              {companies.map(company => (
                <div key={company._id} className="company-card" onClick={() => navigate(`/companies/${company._id}`)}>
                  <div className="company-card-top">
                    <div className="company-logo-wrap">
                      {company.logo ? (
                        <img src={company.logo} alt={company.companyName} />
                      ) : (
                        <div className="company-logo-placeholder">
                          <Building2 size={28} color="#8B5CF6"/>
                        </div>
                      )}
                    </div>
                    <div className="company-verified-badge">✓ Verified</div>
                  </div>
                  <div className="company-card-body">
                    <h3>{company.companyName}</h3>
                    {company.address && (
                      <p className="company-location"><MapPin size={13}/> {company.address}</p>
                    )}
                    <p className="company-desc">
                      {company.description ? company.description.slice(0, 90) + (company.description.length > 90 ? '...' : '') : 'A trusted car rental partner on CarRents.lk'}
                    </p>
                    <div className="company-fleet-count">
                      <Car size={14}/> {company.vehicleCount || 0} vehicles
                    </div>
                  </div>
                  <Link to={`/companies/${company._id}`} className="company-view-btn">
                    View Fleet <ArrowRight size={15}/>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .companies-page { min-height: 100vh; font-family: 'Inter', sans-serif; }

        .companies-hero {
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 60%, #e0f2fe 100%);
          padding: 80px 2rem 60px;
          text-align: center;
          border-bottom: 1px solid #ede9fe;
        }
        .companies-hero-inner { max-width: 700px; margin: 0 auto; }

        .companies-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #8B5CF6; color: white;
          padding: 6px 16px; border-radius: 100px;
          font-size: 0.78rem; font-weight: 700; margin-bottom: 1.5rem;
        }

        .companies-hero h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900; color: #1F2937; line-height: 1.1;
          margin-bottom: 1rem; letter-spacing: -1px;
        }
        .companies-hero h1 span { color: #7C3AED; }
        .companies-hero p { color: #6B7280; font-size: 1.05rem; margin-bottom: 2rem; }

        .companies-search-bar {
          position: relative; max-width: 480px; margin: 0 auto;
          display: flex; align-items: center;
        }
        .companies-search-bar .search-icon {
          position: absolute; left: 16px; color: #9CA3AF;
        }
        .companies-search-bar input {
          width: 100%; padding: 14px 16px 14px 46px;
          border: 2px solid #DDD6FE; border-radius: 100px;
          font-size: 0.95rem; background: white; outline: none;
          transition: border-color 0.2s;
        }
        .companies-search-bar input:focus { border-color: #7C3AED; }

        .companies-grid-section { padding: 3rem 2rem 5rem; }
        .companies-grid-inner { max-width: 1280px; margin: 0 auto; }

        .company-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .company-card {
          background: white; border-radius: 1.5rem;
          border: 1px solid #F1F5F9;
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
          overflow: hidden; display: flex; flex-direction: column;
          cursor: pointer; transition: transform 0.25s, box-shadow 0.25s;
        }
        .company-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(124,58,237,0.1); }

        .company-card-top {
          background: linear-gradient(135deg, #F5F3FF, #EDE9FE);
          padding: 1.5rem;
          display: flex; justify-content: space-between; align-items: flex-start;
        }

        .company-logo-wrap { width: 60px; height: 60px; border-radius: 14px; overflow: hidden; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .company-logo-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .company-logo-placeholder { width: 60px; height: 60px; border-radius: 14px; background: #F5F3FF; display: flex; align-items: center; justify-content: center; }

        .company-verified-badge {
          background: #DCFCE7; color: #16A34A;
          font-size: 0.72rem; font-weight: 700;
          padding: 4px 10px; border-radius: 100px;
        }

        .company-card-body { padding: 1.25rem 1.5rem; flex: 1; }
        .company-card-body h3 { font-size: 1.15rem; font-weight: 800; color: #111827; margin-bottom: 0.35rem; }

        .company-location {
          display: inline-flex; align-items: center; gap: 4px;
          color: #6B7280; font-size: 0.82rem; margin-bottom: 0.6rem;
        }
        .company-desc { color: #6B7280; font-size: 0.85rem; line-height: 1.5; margin-bottom: 0.75rem; }
        .company-fleet-count {
          display: inline-flex; align-items: center; gap: 5px;
          background: #EDE9FE; color: #6D28D9;
          font-size: 0.78rem; font-weight: 700;
          padding: 4px 10px; border-radius: 100px;
        }

        .company-view-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          background: #7C3AED; color: white;
          padding: 0.85rem; font-weight: 700; font-size: 0.9rem;
          text-decoration: none; transition: background 0.2s;
        }
        .company-view-btn:hover { background: #6D28D9; }

        .company-card-skeleton {
          height: 280px; border-radius: 1.5rem;
          background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .loading-state { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }

        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .empty-state {
          text-align: center; padding: 5rem 2rem;
          display: flex; flex-direction: column; align-items: center; gap: 1rem;
        }
        .empty-state h3 { font-size: 1.5rem; font-weight: 800; color: #1F2937; }
        .empty-state p { color: #6B7280; }

        .btn-register-company {
          background: #7C3AED; color: white;
          padding: 0.75rem 2rem; border-radius: 100px;
          font-weight: 700; text-decoration: none;
          transition: background 0.2s;
        }
        .btn-register-company:hover { background: #6D28D9; }
      `}</style>
    </div>
  );
};

export default Companies;
