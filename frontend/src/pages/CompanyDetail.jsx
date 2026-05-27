import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Building2, MapPin, Phone, Mail, Car, ArrowLeft } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';

const CompanyDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/companies/${id}`);
        setData(res.data);
      } catch (err) {
        setError('Company not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) return <div className="company-detail-loading"><div className="spinner"/></div>;
  if (error || !data) return <div className="company-detail-error"><p>{error || 'Something went wrong.'}</p><Link to="/companies">← Back to Companies</Link></div>;

  const { vehicles = [], ...company } = data;

  return (
    <div className="company-detail-page">
      {/* Back link */}
      <div className="company-detail-nav">
        <Link to="/companies" className="back-link"><ArrowLeft size={16}/> All Companies</Link>
      </div>

      {/* Header */}
      <div className="company-detail-header">
        <div className="company-detail-header-inner">
          <div className="company-detail-logo">
            {company.logo ? (
              <img src={company.logo} alt={company.companyName} />
            ) : (
              <div className="company-logo-placeholder-lg"><Building2 size={40} color="#8B5CF6"/></div>
            )}
          </div>
          <div className="company-detail-info">
            <div className="company-verified-pill">✓ Verified Partner</div>
            <h1>{company.companyName}</h1>
            <div className="company-metadata">
              {company.address && <span><MapPin size={14}/> {company.address}</span>}
              {company.phone && <span><Phone size={14}/> {company.phone}</span>}
              {company.contactEmail && <span><Mail size={14}/> {company.contactEmail}</span>}
            </div>
            {company.description && <p className="company-detail-desc">{company.description}</p>}
          </div>
        </div>
      </div>

      {/* Fleet */}
      <div className="company-detail-fleet">
        <div className="company-fleet-inner">
          <div className="fleet-heading">
            <h2><Car size={22}/> Fleet <span>({vehicles.length} vehicles)</span></h2>
          </div>
          {vehicles.length === 0 ? (
            <div className="fleet-empty">
              <Car size={40} color="#DDD6FE"/>
              <p>This company hasn't listed any vehicles yet.</p>
            </div>
          ) : (
            <div className="fleet-grid">
              {vehicles.map((v, i) => <VehicleCard key={v._id} vehicle={v} index={i} />)}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .company-detail-page { min-height: 100vh; font-family: 'Inter', sans-serif; }

        .company-detail-loading {
          min-height: 60vh; display: flex; align-items: center; justify-content: center;
        }
        .spinner {
          width: 40px; height: 40px; border: 3px solid #EDE9FE;
          border-top-color: #7C3AED; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .company-detail-error {
          min-height: 50vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 1rem;
        }
        .company-detail-error a { color: #7C3AED; font-weight: 600; text-decoration: none; }

        .company-detail-nav { max-width: 1280px; margin: 0 auto; padding: 1.5rem 2rem 0; }
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          color: #6B7280; font-weight: 600; font-size: 0.9rem;
          text-decoration: none; transition: color 0.2s;
        }
        .back-link:hover { color: #7C3AED; }

        .company-detail-header {
          background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%);
          padding: 2.5rem 2rem 3rem;
          border-bottom: 1px solid #DDD6FE;
        }
        .company-detail-header-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; gap: 2rem; align-items: flex-start;
          flex-wrap: wrap;
        }

        .company-detail-logo {
          width: 100px; height: 100px; border-radius: 20px;
          overflow: hidden; background: white;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1); flex-shrink: 0;
        }
        .company-detail-logo img { width: 100%; height: 100%; object-fit: cover; }
        .company-logo-placeholder-lg {
          width: 100px; height: 100px; border-radius: 20px;
          background: white; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .company-detail-info { flex: 1; min-width: 200px; }

        .company-verified-pill {
          display: inline-block; background: #DCFCE7; color: #16A34A;
          font-size: 0.75rem; font-weight: 700;
          padding: 4px 12px; border-radius: 100px; margin-bottom: 0.6rem;
        }

        .company-detail-info h1 {
          font-size: clamp(1.5rem, 4vw, 2.25rem); font-weight: 900;
          color: #1F2937; margin-bottom: 0.5rem; letter-spacing: -0.5px;
        }

        .company-metadata {
          display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.75rem;
        }
        .company-metadata span {
          display: inline-flex; align-items: center; gap: 5px;
          color: #6B7280; font-size: 0.875rem;
        }

        .company-detail-desc { color: #374151; font-size: 0.95rem; line-height: 1.6; max-width: 600px; }

        .company-detail-fleet { padding: 3rem 2rem 5rem; }
        .company-fleet-inner { max-width: 1280px; margin: 0 auto; }

        .fleet-heading { margin-bottom: 1.75rem; }
        .fleet-heading h2 {
          display: flex; align-items: center; gap: 10px;
          font-size: 1.5rem; font-weight: 800; color: #1F2937;
        }
        .fleet-heading h2 span { color: #9CA3AF; font-weight: 600; font-size: 1.1rem; }

        .fleet-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .fleet-empty {
          text-align: center; padding: 4rem;
          display: flex; flex-direction: column; align-items: center; gap: 1rem;
          color: #9CA3AF;
        }
      `}</style>
    </div>
  );
};

export default CompanyDetail;
