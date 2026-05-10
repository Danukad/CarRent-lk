import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Users, Fuel, Settings2, Star, Car as CarIcon } from 'lucide-react';

const VehicleCard = ({ vehicle, index }) => {
  // Gradients matching the beautiful colors in screenshot 2
  const coverImage = vehicle.images && vehicle.images.length > 0 && vehicle.images[0]
    ? vehicle.images[0]
    : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600';
  
  // Decide pill tag appropriately
  let tag = 'Nearest';
  if (vehicle.brand === 'BMW' || vehicle.pricePerDay > 15000) tag = 'Luxury';
  else if (vehicle.fuelType === 'Hybrid' || vehicle.fuelType === 'Electric') tag = 'Eco';
  else if (index === 1 || index === 4 || vehicle.rating > 4.8) tag = 'Top rated';

  // Mock distance
  const distance = (2.4 + ((index || 0) * 0.7)).toFixed(1);

  return (
    <div className="v-card-modern">
      <div className="v-card-header-gradient" style={{ 
        backgroundImage: `url(${coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="v-card-tags">
          <span className="v-tag-left"><Sparkles size={12}/> {tag}</span>
          <span className="v-tag-right"><MapPin size={12}/> {distance} km</span>
        </div>
      </div>
      
      <div className="v-card-content">
        <div className="v-card-title-row">
          <h3>{vehicle.brand} {vehicle.model}</h3>
          <div className="v-rating"><Star size={14} fill="#f59e0b" color="#f59e0b"/> 4.95</div>
        </div>
        <p className="v-location">{vehicle.location}</p>
        
        <div className="v-features">
          <span><Users size={14}/> {vehicle.seats || 5}</span>
          <span><Fuel size={14}/> {vehicle.fuelType || 'Petrol'}</span>
          <span><Settings2 size={14}/> {vehicle.transmission || 'Auto'}</span>
        </div>

        <div className="v-footer">
          <div className="v-price-block">
            <span className="v-price-label">From</span>
            <div className="v-price-value">LKR {vehicle.pricePerDay?.toLocaleString()}<span>/day</span></div>
          </div>
          <Link to={`/vehicle/${vehicle._id}`} className="v-book-btn">Book →</Link>
        </div>
      </div>

      <style>{`
        .v-card-modern {
          background: #ffffff;
          border-radius: 1.5rem;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .v-card-modern:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .v-card-header-gradient {
          height: 180px;
          position: relative;
          padding: 1.25rem;
          display: flex;
          justify-content: space-between;
          overflow: hidden;
        }

        .v-card-tags {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          z-index: 2;
        }

        .v-tag-left, .v-tag-right {
          background: #ffffff;
          color: #111827;
          border-radius: 100px;
          padding: 0.35rem 0.8rem;
          font-size: 0.75rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .v-watermark-icon {
          position: absolute;
          bottom: -20px;
          right: -20px;
          z-index: 1;
        }

        .v-card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .v-card-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }

        .v-card-title-row h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #111827;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .v-rating {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: #111827;
        }

        .v-location {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0 0 1.25rem 0;
        }

        .v-features {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .v-features span {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 500;
        }

        .v-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
        }

        .v-price-label {
          display: block;
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 0.2rem;
        }

        .v-price-value {
          font-size: 1.35rem;
          font-weight: 800;
          color: #a855f7;
          line-height: 1;
        }
        
        .v-price-value span {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 500;
        }

        .v-book-btn {
          background: #a855f7;
          color: white;
          padding: 0.65rem 1.25rem;
          border-radius: 100px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: 0.2s;
        }

        .v-book-btn:hover {
          background: #9333ea;
          transform: translateX(2px);
        }
      `}</style>
    </div>
  );
};

export default VehicleCard;
