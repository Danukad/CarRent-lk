import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import VehicleCard from '../components/VehicleCard';
import { ShieldCheck, HeartHandshake, Clock } from 'lucide-react';

const LandingPage = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vehicles');
        // Just take the first 4 for the preview
        setFeaturedCars(response.data.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="landing-page">
      <Hero />
      
      {/* Popular Car Rentals Section */}
      <section className="section featured-preview container">
        <div className="section-header">
          <span className="section-badge">Popular Rentals</span>
          <h2 className="section-title">Rent verified vehicles from <br/>trusted hosts</h2>
          <p className="section-subtitle">Whether you need a luxury sedan for a wedding or a rugged SUV for a road trip, we've got you covered.</p>
        </div>
        
        <div className="vehicle-grid">
          {loading ? (
            <div className="loading-spinner">Loading cars...</div>
          ) : featuredCars.length > 0 ? (
            featuredCars.map(car => (
              <VehicleCard key={car._id} vehicle={car} />
            ))
          ) : (
            <div className="no-cars">No vehicles found. Start by listing your car!</div>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="section how-it-works bg-light">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Simple Process</span>
            <h2 className="section-title">Rent in 4 simple steps</h2>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">1</div>
              <h3>Browse & Select</h3>
              <p>Explore our wide range of verified vehicles across the island.</p>
            </div>
            <div className="step-card">
              <div className="step-icon">2</div>
              <h3>Book Instantly</h3>
              <p>Choose your dates and confirm your booking in seconds.</p>
            </div>
            <div className="step-card">
              <div className="step-icon">3</div>
              <h3>Pick Up & Drive</h3>
              <p>Meet your host at the agreed location and grab the keys.</p>
            </div>
            <div className="step-card">
              <div className="step-icon">4</div>
              <h3>Return & Rate</h3>
              <p>Return the car and share your experience with the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="section why-us container">
        <div className="why-us-content">
          <div className="why-us-text">
            <span className="section-badge text-left">Why CarRents.lk?</span>
            <h2 className="section-title text-left">The most trusted car <br/>sharing marketplace</h2>
            <ul className="benefits-list">
              <li>
                <div className="benefit-icon">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4>Fully Insured</h4>
                  <p>Every trip is covered by our comprehensive insurance policy.</p>
                </div>
              </li>
              <li>
                <div className="benefit-icon">
                  <HeartHandshake size={24} />
                </div>
                <div>
                  <h4>Verified Hosts</h4>
                  <p>We verify every host and vehicle to ensure your safety.</p>
                </div>
              </li>
              <li>
                <div className="benefit-icon">
                  <Clock size={24} />
                </div>
                <div>
                  <h4>24/7 Support</h4>
                  <p>Our dedicated support team is always here to help you.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="why-us-image">
            <div className="glass-card trust-card">
              <div className="trust-stat">
                <span className="stat-number">5,000+</span>
                <span className="stat-label">Happy Renters</span>
              </div>
              <div className="trust-stat">
                <span className="stat-number">4.9/5</span>
                <span className="stat-label">Avg. Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .landing-page {
          color: #111827;
          position: relative;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .section {
          padding: 6rem 0;
        }

        .bg-light {
          background: transparent;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          background: #F5F3FF;
          color: #8B5CF6;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .text-left {
          text-align: left;
        }

        .section-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .section-subtitle {
          font-size: 1.25rem;
          color: #6B7280;
          max-width: 700px;
          margin: 0 auto;
        }

        .vehicle-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 3rem;
        }

        .step-card {
          text-align: center;
        }

        .step-icon {
          width: 60px;
          height: 60px;
          background: white;
          border: 2px solid #E5E7EB;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 800;
          color: #8B5CF6;
          margin: 0 auto 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .step-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .step-card p {
          color: #6B7280;
          line-height: 1.6;
        }

        .why-us-content {
          display: flex;
          align-items: center;
          gap: 4rem;
        }

        .why-us-text {
          flex: 1;
        }

        .why-us-image {
          flex: 1;
          height: 400px;
          background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
          border-radius: 2rem;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          margin-top: 3rem;
        }

        .benefit-icon {
          width: 48px;
          height: 48px;
          background: #F5F3FF;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #E5E7EB;
        }

        .benefit-icon svg {
          color: #8B5CF6;
          transition: transform 0.3s ease;
        }

        .benefits-list li {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          cursor: pointer;
        }

        .benefits-list li:hover .benefit-icon {
          transform: scale(1.1) rotate(8deg);
          background: #EDE9FE;
          border-color: #8B5CF6;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
        }

        .benefits-list li:hover .benefit-icon svg {
          transform: scale(1.1);
          color: #7C3AED;
        }

        .benefits-list h4 {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .benefits-list p {
          color: #6B7280;
          font-size: 0.95rem;
        }

        .trust-card {
          padding: 2rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 1.5rem;
          display: flex;
          gap: 2.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .trust-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #8B5CF6;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #4B5563;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .why-us-content {
            flex-direction: column;
          }
          .section-title {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
