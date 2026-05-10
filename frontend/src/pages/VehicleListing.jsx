import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VehicleCard from '../components/VehicleCard';
import { MapPin, Car, Sliders, Sparkles, Navigation, Search, Star } from 'lucide-react';

const VehicleListing = () => {
  const [filter, setFilter] = useState({ location: '', brand: '', maxPrice: '' });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterShow, setFilterShow] = useState('nearest'); 
  const [filterFuel, setFilterFuel] = useState('any'); 

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/vehicles');
        setVehicles(res.data);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filtered = vehicles.filter(v => {
    const matchBrand = !filter.brand || v.brand?.toLowerCase().includes(filter.brand.toLowerCase());
    const matchLocation = !filter.location || v.location?.toLowerCase().includes(filter.location.toLowerCase());
    const matchPrice = !filter.maxPrice || v.pricePerDay <= parseInt(filter.maxPrice);
    const matchFuel = filterFuel === 'any' || v.fuelType?.toLowerCase() === filterFuel;
    return matchBrand && matchLocation && matchPrice && matchFuel;
  });

  return (
    <div className="listing-page">
      <div className="modern-header-section">
        <div className="top-badge">
          <Sparkles size={14} className="icon-purple-txt" />
          <span>Sri Lanka's modern car marketplace</span>
        </div>
        <h1 className="modern-title">Find the <span className="text-purple">nearest ride</span><br/> in seconds.</h1>
        <p className="modern-subtitle">Search verified vehicles around you. Filter by brand, budget and fuel — book in a tap.</p>
      </div>

      <div className="container">
        <div className="search-card-block">
          <div className="search-card-header">
            <h2>Search in <span className="text-purple">3 quick steps</span></h2>
            <button className="reset-btn" onClick={() => {
               setFilter({ location: '', brand: '', maxPrice: '' });
               setFilterShow('nearest');
               setFilterFuel('any');
            }}>Reset</button>
          </div>

          <div className="search-steps-row">
            <div className="search-step">
              <div className="step-label">
                <span className="step-num active-num">1</span> Where?
              </div>
              <div className="step-input-box">
                <MapPin size={18} className="icon-purple-txt" />
                <input 
                  type="text" 
                  placeholder="Type a city..." 
                  value={filter.location}
                  onChange={e => setFilter({...filter, location: e.target.value})}
                />
              </div>
            </div>

            <div className="search-step">
              <div className="step-label">
                <span className="step-num active-num">2</span> Which car?
              </div>
              <div className="step-input-box">
                <Car size={18} className="icon-blue-txt" />
                <input 
                  type="text" 
                  placeholder="Any brand" 
                  value={filter.brand}
                  onChange={e => setFilter({...filter, brand: e.target.value})}
                />
              </div>
            </div>

            <div className="search-step">
              <div className="step-label">
                <span className="step-num active-num">3</span> Budget / day
              </div>
              <div className="step-input-box">
                <span className="currency-label">LKR</span>
                <input 
                  type="number" 
                  placeholder="10,000" 
                  value={filter.maxPrice}
                  onChange={e => setFilter({...filter, maxPrice: e.target.value})}
                />
              </div>
            </div>

            <div className="search-action">
               <button className="big-search-btn">
                 <Search size={20} /> Search
               </button>
            </div>
          </div>

          <div className="filter-bottom-row">
            <div className="filter-group">
              <span className="filter-label">SHOW ME</span>
              <button 
                className={`filter-pill mode-pill ${filterShow === 'nearest' ? 'active-mode' : ''}`}
                onClick={() => setFilterShow('nearest')}
              >
                <Navigation size={14} className={filterShow==='nearest'?'':'icon-gray-txt'}/> Nearest
              </button>
              <button 
                className={`filter-pill mode-pill ${filterShow === 'top-rated' ? 'active-mode' : ''}`}
                onClick={() => setFilterShow('top-rated')}
              >
                <Star size={14} className={filterShow==='top-rated'?'':'icon-gray-txt'}/> Top rated
              </button>
            </div>

            <div className="filter-group hide-mobile">
              <span className="filter-label">FUEL</span>
              {['any', 'petrol', 'diesel', 'hybrid', 'electric'].map(f => (
                <button 
                  key={f}
                  className={`filter-pill fuel-pill ${filterFuel === f ? 'active-fuel' : ''}`}
                  onClick={() => setFilterFuel(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="match-count-pill">
               <Sliders size={14} className="icon-purple-txt"/> {filtered.length} cars match
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="results-header-modern">
          <div className="results-titles">
            <h2>Nearest cars to you</h2>
            <p>{filtered.length} verified vehicles · live availability</p>
          </div>
          <button className="view-all-btn">View all →</button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading vehicles...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span>🔍</span>
            <h3>No vehicles found</h3>
            <p>Try changing your filters</p>
          </div>
        ) : (
          <div className="vehicle-grid animate-up">
            {filtered.map((v, i) => <VehicleCard key={v._id} vehicle={v} index={i} />)}
          </div>
        )}
      </div>

      <style>{`
        .listing-page {
          min-height: calc(100vh - 68px);
          padding-bottom: 80px;
        }

        /* Modern Header */
        .modern-header-section {
          padding: 4rem 1rem 3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .top-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          padding: 0.4rem 1rem;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #111827;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          margin-bottom: 1.5rem;
        }

        .icon-purple-txt { color: #a855f7; }
        .icon-blue-txt { color: #38bdf8; }
        .icon-gray-txt { color: #9ca3af; }

        .modern-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          color: #111827;
          line-height: 1.1;
          letter-spacing: -1px;
          margin: 0 0 1rem 0;
        }

        .text-purple {
          color: #a855f7;
        }

        .modern-subtitle {
          font-size: 1.1rem;
          color: #6b7280;
          max-width: 600px;
          line-height: 1.6;
          margin: 0;
        }

        /* Massive 3 Step Search Block */
        .search-card-block {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 2rem;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.04);
          margin-bottom: 4rem;
        }

        .search-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .search-card-header h2 {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          color: #111827;
          letter-spacing: -0.5px;
        }

        .reset-btn {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.08);
          padding: 0.4rem 1rem;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          transition: 0.2s;
        }
        .reset-btn:hover { background: #f3f4f6; color: #111827; }

        .search-steps-row {
          display: flex;
          gap: 1.5rem;
          align-items: flex-end;
          margin-bottom: 1.5rem;
        }

        .search-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .step-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 1rem;
          color: #111827;
        }

        .step-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-size: 0.8rem;
          background: #a855f7;
          color: white;
          font-weight: 800;
        }

        .step-input-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f8fafc;
          border: 1px solid transparent;
          border-radius: 1.25rem;
          padding: 1rem 1.25rem;
          transition: 0.2s;
        }
        .step-input-box:focus-within {
          border-color: #a855f7;
          background: #ffffff;
          box-shadow: 0 4px 15px rgba(168,85,247,0.1);
        }

        .step-input-box input {
          border: none;
          background: none;
          font-size: 1rem;
          font-family: inherit;
          color: #111827;
          font-weight: 500;
          outline: none;
          width: 100%;
        }
        .step-input-box input::placeholder { color: #9ca3af; font-weight: 400; }

        .currency-label {
          font-weight: 800;
          color: #10b981;
          font-size: 0.9rem;
        }

        .search-action {
          flex-shrink: 0;
        }

        .big-search-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #a855f7;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 1.25rem;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.2s;
          box-shadow: 0 8px 20px rgba(168,85,247,0.3);
        }
        .big-search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(168,85,247,0.4);
        }

        .filter-bottom-row {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(0,0,0,0.05);
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .filter-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #6b7280;
          letter-spacing: 0.5px;
          margin-right: 0.5rem;
        }

        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          transition: 0.2s;
          font-family: inherit;
        }

        .filter-pill:hover { background: #f9fafb; color: #111827; }

        .active-mode {
          background: #a855f7;
          color: white;
          border-color: #a855f7;
        }
        .active-mode:hover { background: #9333ea; color: white; }

        .active-fuel {
          background: #f3e8ff;
          color: #a855f7;
          border-color: rgba(168,85,247,0.2);
        }

        .match-count-pill {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f3e8ff;
          color: #111827;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.5rem 1rem;
          border-radius: 100px;
        }

        /* Results Display */
        .results-header-modern {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }

        .results-titles h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #111827;
          margin: 0 0 0.25rem 0;
          letter-spacing: -0.5px;
        }
        .results-titles p {
          color: #6b7280;
          margin: 0;
          font-size: 1rem;
          font-weight: 500;
        }

        .view-all-btn {
          background: none;
          border: none;
          color: #a855f7;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .view-all-btn:hover { color: #9333ea; transform: translateX(2px); }

        .vehicle-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 8rem 0;
          color: #6b7280;
        }
        .empty-state span { font-size: 4rem; }
        .empty-state h3 { color: #111827; margin: 0; font-weight: 800; font-size: 1.75rem; }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.05);
          border-top-color: #a855f7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .search-steps-row { flex-direction: column; align-items: stretch; }
          .search-step { width: 100%; }
          .filter-bottom-row { gap: 1rem; }
          .hide-mobile { display: none; }
          .match-count-pill { margin-left: 0; width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default VehicleListing;
