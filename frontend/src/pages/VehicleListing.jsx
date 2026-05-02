import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VehicleCard from '../components/VehicleCard';

const VehicleListing = () => {
  const [filter, setFilter] = useState({ brand: '', minPrice: '', maxPrice: '' });
  
  // 1. We create a "state" bucket to hold the real data from the database
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. We use useEffect to automatically fetch the data the moment the page opens
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/vehicles');
        setVehicles(res.data); // Dump the database cars into our bucket
        setLoading(false);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []); // The empty array [] means "only run this exactly once right as the page starts"

  return (
    <div className="container listing-page">
      <aside className="filters glass-card">
        <h3>Filter Vehicles</h3>
        <div className="filter-group">
          <label>Brand</label>
          <input type="text" placeholder="e.g. Toyota" value={filter.brand} onChange={(e) => setFilter({...filter, brand: e.target.value})} />
        </div>
        <div className="filter-group">
          <label>Max Price (LKR)</label>
          <input type="number" placeholder="10000" value={filter.maxPrice} onChange={(e) => setFilter({...filter, maxPrice: e.target.value})} />
        </div>
      </aside>

      <div className="results">
        {loading ? (
           <p style={{ color: 'white' }}>Loading amazing vehicles...</p>
        ) : (
          <div className="vehicle-grid">
            {vehicles.map(v => <VehicleCard key={v._id} vehicle={v} />)}
          </div>
        )}
      </div>

      <style>{`
        .listing-page {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          padding: 60px 2rem;
        }
        .filters {
          height: fit-content;
          position: sticky;
          top: 100px;
        }
        .filter-group {
          margin-bottom: 1.5rem;
        }
        .filter-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .filter-group input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          padding: 0.75rem;
          border-radius: 0.5rem;
          color: white;
          outline: none;
        }
        .results {
            flex: 1;
        }
        .vehicle-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        @media (max-width: 768px) {
            .listing-page {
                grid-template-columns: 1fr;
            }
        }
      `}</style>
    </div>
  );
};

export default VehicleListing;
