import React from 'react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  // Use the first image in the array, or a cool default car silhouette if none exists
  const coverImage = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images[0] 
    : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=300';

  return (
    <div className="vehicle-card glass-card">
      <div className="card-image" style={{ backgroundImage: `url(${coverImage})` }}>
        <div className="price-tag">LKR {vehicle.pricePerDay}/day</div>
      </div>
      <div className="card-body">
        <h3>{vehicle.brand} {vehicle.model}</h3>
        <p className="year">{vehicle.year} • {vehicle.location}</p>
        <Link to={`/vehicle/${vehicle._id}`} className="btn-secondary">View Details</Link>
      </div>
      <style>{`
        .vehicle-card {
          padding: 0;
          overflow: hidden;
          transition: transform 0.3s;
        }
        .vehicle-card:hover {
          transform: translateY(-5px);
        }
        .card-image {
          height: 200px;
          background-size: cover;
          background-position: center;
          position: relative;
        }
        .price-tag {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background: var(--bg-dark);
          padding: 0.4rem 0.8rem;
          border-radius: 0.4rem;
          font-weight: 600;
          font-size: 0.9rem;
          border: 1px solid var(--border);
        }
        .card-body {
          padding: 1.5rem;
        }
        .card-body h3 {
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }
        .year {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        .btn-secondary {
          display: block;
          text-align: center;
          background: var(--glass);
          border: 1px solid var(--border);
          padding: 0.6rem;
          border-radius: 0.4rem;
          color: white;
          font-weight: 600;
          transition: background 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default VehicleCard;
