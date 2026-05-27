import React, { useState } from 'react';
import axios from 'axios';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '1.5rem',
  border: '1px solid #E2E8F0'
};

const ListVehicle = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    brand: '', model: '', year: '', pricePerDay: '', fuelType: '', transmission: '', location: '', description: '',
    availableFrom: new Date().toISOString().split('T')[0], availableTo: new Date(Date.now() + 31536000000).toISOString().split('T')[0], images: ['', '', '', '', ''],
    lat: 6.9271, lng: 79.8612
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const nextStep = (e) => { e.preventDefault(); setStep(step + 1); };
  const prevStep = (e) => { e.preventDefault(); setStep(step - 1); };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newImages = [...formData.images];
      newImages[index] = res.data.url;
      setFormData({ ...formData, images: newImages });
    } catch (err) {
      alert("Failed to upload image.");
    }
  };

  const onMapClick = (e) => {
    setFormData({ ...formData, lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert("Please login first.");

      const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
      const res = await axios.post('http://localhost:5000/api/vehicles', formData, config);
      alert("Vehicle listed successfully!");
      setStep(1);
    } catch (err) {
      alert("Error: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="list-page">
      <div className="container">

        {/* Header Section mimicking Home Page */}
        <div className="list-header">
          <div className="hero-badge">
            <span className="sparkle">✦</span>
            <span>Sri Lankaaaa's modern car marketplace</span>
          </div>
          <h1 className="list-title">Turn your car into <span className="text-purple">earnings.</span></h1>
          <p className="list-subtitle">Complete the 3 steps below to get your vehicle verified and live.</p>
        </div>

        {/* Custom Stepper */}
        <div className="stepper-container">
          <div className={`step-pill ${step >= 1 ? 'active' : ''}`}>1. Details</div>
          <div className="step-line"></div>
          <div className={`step-pill ${step >= 2 ? 'active' : ''}`}>2. Photos</div>
          <div className="step-line"></div>
          <div className={`step-pill ${step >= 3 ? 'active' : ''}`}>3. Location</div>
        </div>

        <div className="main-listing-layout">
          <div className="form-content-card">
            <form onSubmit={handleSubmit}>

              {/* STEP 1 */}
              {step === 1 && (
                <div className="fade-in">
                  <h3 className="section-title">Vehicle Specifications</h3>
                  <div className="form-grid">
                    <div className="input-field">
                      <label>BRAND</label>
                      <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Toyota" required />
                    </div>
                    <div className="input-field">
                      <label>MODEL</label>
                      <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="e.g. Aqua" required />
                    </div>
                    <div className="input-field">
                      <label>YEAR</label>
                      <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="2022" required />
                    </div>
                    <div className="input-field">
                      <label>DAILY PRICE (LKR)</label>
                      <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} placeholder="8500" required />
                    </div>
                    <div className="input-field">
                      <label>FUEL TYPE</label>
                      <select name="fuelType" value={formData.fuelType} onChange={handleChange} required>
                        <option value="" disabled>Select Fuel</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                      </select>
                    </div>
                    <div className="input-field">
                      <label>TRANSMISSION</label>
                      <select name="transmission" value={formData.transmission} onChange={handleChange} required>
                        <option value="" disabled>Select</option>
                        <option value="Auto">Auto</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                    <div className="input-field">
                      <label>AVAILABLE FROM</label>
                      <input type="date" name="availableFrom" value={formData.availableFrom} onChange={handleChange} required />
                    </div>
                    <div className="input-field">
                      <label>AVAILABLE TO</label>
                      <input type="date" name="availableTo" value={formData.availableTo} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="input-field full-width" style={{ marginTop: '1.5rem' }}>
                    <label>DESCRIPTION</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Tell us about the features, fuel type, and condition..." required></textarea>
                  </div>
                  <button className="btn-primary-lg" onClick={nextStep}>Continue to Photos</button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="fade-in">
                  <h3 className="section-title">Upload High-Quality Photos</h3>
                  <p className="step-note">Exactly 5 photos are required for a "Verified" badge.</p>
                  <div className="upload-grid">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className={`upload-box ${formData.images[i] ? 'has-image' : ''}`}>
                        {formData.images[i] ? (
                          <img src={formData.images[i]} alt="Preview" />
                        ) : (
                          <label className="upload-label">
                            <input type="file" hidden onChange={(e) => handlePhotoUpload(e, i)} />
                            <span className="plus">+</span>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="button-group">
                    <button className="btn-outline" onClick={prevStep}>Back</button>
                    <button className="btn-primary-lg" onClick={(e) => formData.images.filter(img => img).length === 5 ? nextStep(e) : alert("All 5 photos required")}>Set Location</button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="fade-in">
                  <h3 className="section-title">Pickup Location</h3>
                  <input className="mb-4" type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Havelock City, Colombo 05" required />
                  <div className="map-container">
                    {isLoaded ? (
                      <GoogleMap mapContainerStyle={mapContainerStyle} center={{ lat: formData.lat, lng: formData.lng }} zoom={14} onClick={onMapClick}>
                        <Marker position={{ lat: formData.lat, lng: formData.lng }} />
                      </GoogleMap>
                    ) : <div className="map-loading">Loading Map...</div>}
                  </div>
                  <div className="button-group">
                    <button className="btn-outline" onClick={prevStep}>Back</button>
                    <button className="btn-primary-lg" type="submit">Publish Listing</button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Sidebar Tips - Consistent with Home Page "Why Us" */}
          <div className="listing-sidebar">
            <div className="tip-card">
              <h4>Verified Hosts</h4>
              <p>We verify every vehicle to ensure safety for our community.</p>
            </div>
            <div className="tip-card">
              <h4>Insurance Included</h4>
              <p>Your vehicle is covered under our premier trip insurance policy.</p>
            </div>
            <div className="earning-preview">
              <span className="label">Potential Earnings</span>
              <span className="amount">LKR 120,000+</span>
              <span className="sub">average per month</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .list-page {
          background: transparent;
          padding: 80px 20px;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        
        /* Header styling */
        .list-header { text-align: center; margin-bottom: 50px; }
        .hero-badge {
          background: #edededff;
          color: #7C3AED;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .list-title { font-size: 3rem; font-weight: 800; color: #111827; margin-bottom: 10px; }
        .text-purple { color: #7C3AED; }
        .list-subtitle { color: #6B7280; font-size: 1.1rem; }

        /* Stepper */
        .stepper-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 40px;
        }
        .step-pill {
          padding: 8px 20px;
          background: #E5E7EB;
          border-radius: 100px;
          font-weight: 700;
          font-size: 14px;
          color: #6B7280;
        }
        .step-pill.active { background: #7C3AED; color: white; }
        .step-line { width: 40px; height: 2px; background: #6b6b6bff; }

        /* Layout Grid */
        .main-listing-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 40px;
        }

        .form-content-card {
          background: white;
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          border: 1px solid #e9c7e6ff;
        }

        /* Form Elements */
        .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 25px; color: #1F2937; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .input-field label { display: block; font-size: 11px; font-weight: 800; color: #9CA3AF; margin-bottom: 8px; letter-spacing: 0.5px; }
        input, textarea, select {
          width: 100%;
          padding: 14px 20px;
          border-radius: 12px;
          border: 1px solid #0043caff;
          background: #6302acff;
          font-size: 15px;
          transition: 0.3s;
          color: white; /* Added white to ensure readability on your dark blue background */
          color-scheme: dark; /* Ensures date picker icons and dropdowns are light-themed to match the dark CSS */
        }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #7C3AED; background: white; color: #111827; box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1); }

        /* Buttons */
        .btn-primary-lg {
          background: #7C3AED;
          color: white;
          width: 100%;
          padding: 16px;
          border-radius: 100px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          margin-top: 30px;
          font-size: 16px;
          box-shadow: 0 10px 20px rgba(124, 58, 237, 0.3);
          transition: 0.3s;
        }
        .btn-primary-lg:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(124, 58, 237, 0.4); }
        .btn-outline { background: none; border: 1px solid #E5E7EB; padding: 12px 25px; border-radius: 100px; font-weight: 600; cursor: pointer; }
        .button-group { display: flex; gap: 15px; align-items: center; margin-top: 30px; }

        /* Upload Box */
        .upload-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .upload-box {
          aspect-ratio: 1;
          background: #F3F4F6;
          border: 2px dashed #D1D5DB;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .upload-box img { width: 100%; height: 100%; object-fit: cover; }
        .plus { font-size: 24px; color: #9CA3AF; }

        /* Sidebar */
        .tip-card {
          background: #F5F3FF;
          padding: 20px;
          border-radius: 16px;
          margin-bottom: 15px;
          border: 1px solid #DDD6FE;
        }
        .tip-card h4 { color: #6D28D9; margin-bottom: 8px; font-size: 15px; }
        .tip-card p { font-size: 13px; color: #5B21B6; line-height: 1.5; }
        .earning-preview {
          background: #111827;
          padding: 25px;
          border-radius: 20px;
          color: white;
          text-align: center;
        }
        .earning-preview .amount { display: block; font-size: 20px; font-weight: 800; color: #A78BFA; margin: 5px 0; }
        .earning-preview .label { font-size: 12px; opacity: 0.7; text-transform: uppercase; }
        .earning-preview .sub { font-size: 11px; opacity: 0.5; }

        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 900px) {
          .main-listing-layout { grid-template-columns: 1fr; }
          .list-title { font-size: 2.2rem; }
        }
      `}</style>
    </div>
  );
};

export default ListVehicle;