import React, { useState } from "react";
import axios from "axios";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1.25rem",
  border: "1px solid rgba(249, 115, 22, 0.08)",
};

const ListVehicle = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    fuelType: "",
    transmission: "",
    location: "",
    description: "",
    availableFrom: new Date().toISOString().split("T")[0],
    availableTo: new Date(Date.now() + 31536000000).toISOString().split("T")[0],
    images: ["", "", "", "", ""],
    lat: 6.9271,
    lng: 79.8612,
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const nextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };
  const prevStep = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        uploadData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
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
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first.");

      const config = {
        headers: { "Content-Type": "application/json", "x-auth-token": token },
      };
      const res = await axios.post(
        "http://localhost:5000/api/vehicles",
        formData,
        config,
      );
      alert("Vehicle listed successfully!");
      setStep(1);
    } catch (err) {
      alert("Error: " + (err.response?.data?.msg || err.message));
    }
  };

  const StepIconDetails = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
  const StepIconPhotos = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
  const StepIconLocation = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
  const StepCheckIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  const stepLabels = [
    { num: 1, label: "Details", icon: <StepIconDetails /> },
    { num: 2, label: "Photos", icon: <StepIconPhotos /> },
    { num: 3, label: "Location", icon: <StepIconLocation /> },
  ];

  const uploadedCount = formData.images.filter((img) => img).length;

  return (
    <div className="lv-page">
      <div className="lv-container">
        {/* Hero Header */}
        <div className="lv-header">
          <div className="lv-badge">
            <span className="lv-badge-dot"></span>
            <span>Sri Lanka's modern car marketplace</span>
          </div>
          <h1 className="lv-title">
            Turn your car into{" "}
            <span className="lv-gradient-text">earnings.</span>
          </h1>
          <p className="lv-subtitle">
            Complete the 3 steps below to get your vehicle verified and live on
            the platform.
          </p>
        </div>

        {/* Elegant Stepper */}
        <div className="lv-stepper">
          {stepLabels.map((s, i) => (
            <React.Fragment key={s.num}>
              <button
                className={`lv-step-item ${step === s.num ? "current" : ""} ${step > s.num ? "completed" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (step > s.num) setStep(s.num);
                }}
                type="button"
              >
                <span className="lv-step-icon">
                  {step > s.num ? <StepCheckIcon /> : s.icon}
                </span>
                <span className="lv-step-label">{s.label}</span>
              </button>
              {i < stepLabels.length - 1 && (
                <div
                  className={`lv-step-connector ${step > s.num ? "done" : ""}`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="lv-layout">
          {/* Main Form Card */}
          <div className="lv-form-card">
            {/* Progress indicator */}
            <div className="lv-progress-bar">
              <div
                className="lv-progress-fill"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* STEP 1 */}
              {step === 1 && (
                <div className="lv-fade-in">
                  <div className="lv-section-header">
                    <h3>Vehicle Specifications</h3>
                    <span className="lv-step-badge">Step 1 of 3</span>
                  </div>
                  <div className="lv-form-grid">
                    <div className="lv-field">
                      <label>Brand</label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="e.g. Toyota"
                        required
                      />
                    </div>
                    <div className="lv-field">
                      <label>Model</label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="e.g. Aqua"
                        required
                      />
                    </div>
                    <div className="lv-field">
                      <label>Year</label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        placeholder="2022"
                        required
                      />
                    </div>
                    <div className="lv-field">
                      <label>Daily Price (LKR)</label>
                      <input
                        type="number"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        placeholder="8,500"
                        required
                      />
                    </div>
                    <div className="lv-field">
                      <label>Fuel Type</label>
                      <select
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Select fuel type
                        </option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                      </select>
                    </div>
                    <div className="lv-field">
                      <label>Transmission</label>
                      <select
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Select type
                        </option>
                        <option value="Auto">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                    <div className="lv-field">
                      <label>Available From</label>
                      <input
                        type="date"
                        name="availableFrom"
                        value={formData.availableFrom}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="lv-field">
                      <label>Available To</label>
                      <input
                        type="date"
                        name="availableTo"
                        value={formData.availableTo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="lv-field lv-full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tell us about the features, condition, and what makes your vehicle special..."
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  <button className="lv-btn-primary" onClick={nextStep}>
                    Continue to Photos
                    <span className="lv-btn-arrow">→</span>
                  </button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="lv-fade-in">
                  <div className="lv-section-header">
                    <h3>Upload High-Quality Photos</h3>
                    <span className="lv-step-badge">Step 2 of 3</span>
                  </div>
                  <p className="lv-info-note">
                    <span className="lv-info-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </span>
                    Upload exactly 5 photos to earn a{" "}
                    <strong>"Verified"</strong> badge. {uploadedCount}/5
                    uploaded.
                  </p>
                  <div className="lv-upload-grid">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`lv-upload-box ${formData.images[i] ? "has-image" : ""}`}
                      >
                        {formData.images[i] ? (
                          <>
                            <img
                              src={formData.images[i]}
                              alt={`Vehicle photo ${i + 1}`}
                            />
                            <div className="lv-upload-overlay">
                              <span>✓</span>
                            </div>
                          </>
                        ) : (
                          <label className="lv-upload-label">
                            <input
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) => handlePhotoUpload(e, i)}
                            />
                            <div className="lv-upload-content">
                              <span className="lv-upload-icon">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                              </span>
                              <span className="lv-upload-text">
                                Photo {i + 1}
                              </span>
                            </div>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="lv-btn-group">
                    <button
                      className="lv-btn-back"
                      onClick={prevStep}
                      type="button"
                    >
                      <span>←</span> Back
                    </button>
                    <button
                      className="lv-btn-primary"
                      onClick={(e) =>
                        formData.images.filter((img) => img).length === 5
                          ? nextStep(e)
                          : alert("All 5 photos required")
                      }
                      type="button"
                    >
                      Set Location
                      <span className="lv-btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="lv-fade-in">
                  <div className="lv-section-header">
                    <h3>Pickup Location</h3>
                    <span className="lv-step-badge">Step 3 of 3</span>
                  </div>
                  <div
                    className="lv-field lv-full-width"
                    style={{ marginBottom: "1.5rem" }}
                  >
                    <label>Address</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Havelock City, Colombo 05"
                      required
                    />
                  </div>
                  <div className="lv-map-wrapper">
                    {isLoaded ? (
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={{ lat: formData.lat, lng: formData.lng }}
                        zoom={14}
                        onClick={onMapClick}
                      >
                        <Marker
                          position={{ lat: formData.lat, lng: formData.lng }}
                        />
                      </GoogleMap>
                    ) : (
                      <div className="lv-map-loading">
                        <div className="lv-spinner"></div>
                        <span>Loading Map...</span>
                      </div>
                    )}
                  </div>
                  <div className="lv-btn-group">
                    <button
                      className="lv-btn-back"
                      onClick={prevStep}
                      type="button"
                    >
                      <span>←</span> Back
                    </button>
                    <button
                      className="lv-btn-primary lv-btn-publish"
                      type="submit"
                    >
                      <span className="lv-publish-icon">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </span>
                      Publish Listing
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Sidebar */}
          <div className="lv-sidebar">
            <div className="lv-tip-card">
              <div className="lv-tip-icon-wrap">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <h4>Verified Hosts</h4>
              <p>
                We verify every vehicle to ensure safety and trust within our
                community.
              </p>
            </div>
            <div className="lv-tip-card">
              <div className="lv-tip-icon-wrap">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <h4>Insurance Included</h4>
              <p>
                Your vehicle is covered under our premier trip insurance policy
                at no extra cost.
              </p>
            </div>
            <div className="lv-tip-card">
              <div className="lv-tip-icon-wrap">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h4>Fast Approval</h4>
              <p>
                Get your listing live within 24 hours after our quick
                verification process.
              </p>
            </div>
            <div className="lv-earnings-card">
              <div className="lv-earnings-glow"></div>
              <span className="lv-earnings-label">Potential Earnings</span>
              <span className="lv-earnings-amount">
                LKR 120,000<sup>+</sup>
              </span>
              <span className="lv-earnings-period">average per month</span>
              <div className="lv-earnings-bar">
                <div className="lv-earnings-bar-fill"></div>
              </div>
              <span className="lv-earnings-note">
                Based on similar vehicles in your area
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ============= LIST VEHICLE PAGE ============= */
        .lv-page {
          padding: 100px 20px 80px;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(90deg, rgba(249, 115, 22, 0.03) 1px, transparent 1px),
                      linear-gradient(rgba(249, 115, 22, 0.03) 1px, transparent 1px);
          background-size: clamp(30px, 5vw, 60px) clamp(30px, 5vw, 60px);
          background-attachment: fixed;
          transition: background-color 0.3s ease;
        }
        .lv-page:hover {
          background: linear-gradient(90deg, rgba(249, 115, 22, 0.06) 1px, transparent 1px),
                      linear-gradient(rgba(249, 115, 22, 0.06) 1px, transparent 1px);
          background-size: clamp(30px, 5vw, 60px) clamp(30px, 5vw, 60px);
          background-attachment: fixed;
        }
        .lv-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ---------- Header ---------- */
        .lv-header {
          text-align: center;
          margin-bottom: 48px;
          animation: lvFadeUp 0.6s ease both;
        }
        .lv-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(249, 115, 22, 0.08);
          border: 1px solid rgba(249, 115, 22, 0.15);
          padding: 6px 18px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          color: #f97316;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }
        .lv-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f97316;
          animation: lvPulse 2s infinite;
        }
        .lv-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800;
          color: #111827;
          margin-bottom: 12px;
          letter-spacing: -1px;
          line-height: 1.15;
        }
        .lv-gradient-text {
          background: linear-gradient(135deg, #f97316, #fb923c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lv-subtitle {
          color: #6B7280;
          font-size: 1.05rem;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ---------- Stepper ---------- */
        .lv-stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 44px;
          animation: lvFadeUp 0.6s ease 0.1s both;
        }
        .lv-step-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 22px;
          border-radius: 100px;
          background: rgba(0, 0, 0, 0.03);
          border: 1.5px solid transparent;
          font-weight: 600;
          font-size: 14px;
          color: #9CA3AF;
          cursor: default;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .lv-step-item.completed {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.2);
          color: #059669;
          cursor: pointer;
        }
        .lv-step-item.current {
          background: rgba(249, 115, 22, 0.08);
          border-color: rgba(249, 115, 22, 0.25);
          color: #f97316;
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.08);
        }
        .lv-step-icon {
          font-size: 16px;
          line-height: 1;
        }
        .lv-step-label {
          font-size: 13px;
          letter-spacing: 0.3px;
        }
        .lv-step-connector {
          width: 40px;
          height: 2px;
          background: #E5E7EB;
          margin: 0 4px;
          border-radius: 2px;
          transition: background 0.3s ease;
        }
        .lv-step-connector.done {
          background: linear-gradient(90deg, #10b981, #059669);
        }

        /* ---------- Layout ---------- */
        .lv-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 36px;
          align-items: start;
          animation: lvFadeUp 0.6s ease 0.2s both;
        }

        /* ---------- Form Card ---------- */
        .lv-form-card {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(249, 115, 22, 0.12);
          border-radius: 24px;
          padding: 0;
          overflow: hidden;
          box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.06),
            0 8px 32px -4px rgba(249, 115, 22, 0.08);
        }
        .lv-form-card form {
          padding: 36px 40px 40px;
        }

        /* Progress bar */
        .lv-progress-bar {
          height: 3px;
          background: #F3F4F6;
          width: 100%;
        }
        .lv-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f97316, #fb923c);
          border-radius: 0 3px 3px 0;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Section header */
        .lv-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .lv-section-header h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }
        .lv-step-badge {
          font-size: 12px;
          font-weight: 600;
          color: #f97316;
          background: rgba(249, 115, 22, 0.08);
          padding: 4px 14px;
          border-radius: 100px;
        }

        /* ---------- Form Fields ---------- */
        .lv-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .lv-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .lv-field label {
          font-size: 12px;
          font-weight: 700;
          color: #6B7280;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }
        .lv-field input,
        .lv-field textarea,
        .lv-field select {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1.5px solid #D1D5DB;
          background: #F3F4F6;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          color: #111827;
          transition: all 0.25s ease;
          outline: none;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
        }
        .lv-field input::placeholder,
        .lv-field textarea::placeholder {
          color: #9CA3AF;
        }
        .lv-field input:hover,
        .lv-field textarea:hover,
        .lv-field select:hover {
          border-color: #fed7aa;
          background: #FEF3C7;
        }
        .lv-field input:focus,
        .lv-field textarea:focus,
        .lv-field select:focus {
          border-color: #f97316;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.12), inset 0 1px 2px rgba(0, 0, 0, 0.02);
        }
        .lv-field textarea {
          resize: vertical;
          min-height: 100px;
          line-height: 1.6;
        }
        .lv-field select {
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%236B7280' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }
        .lv-full-width {
          margin-top: 4px;
          margin-bottom: 8px;
        }

        /* ---------- Buttons ---------- */
        .lv-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          width: 100%;
          padding: 15px 28px;
          border-radius: 14px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          margin-top: 28px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.25);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .lv-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .lv-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(249, 115, 22, 0.35);
        }
        .lv-btn-primary:hover::before { opacity: 1; }
        .lv-btn-primary:active { transform: translateY(0); }
        .lv-btn-arrow {
          font-size: 18px;
          transition: transform 0.2s;
        }
        .lv-btn-primary:hover .lv-btn-arrow { transform: translateX(3px); }

        .lv-btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1.5px solid #E5E7EB;
          padding: 13px 24px;
          border-radius: 14px;
          font-weight: 600;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .lv-btn-back:hover {
          border-color: #fed7aa;
          color: #f97316;
          background: rgba(249, 115, 22, 0.03);
        }

        .lv-btn-group {
          display: flex;
          gap: 14px;
          align-items: center;
          margin-top: 28px;
        }
        .lv-btn-group .lv-btn-primary { margin-top: 0; }

        .lv-btn-publish { gap: 8px; }
        .lv-publish-icon { font-size: 16px; }

        /* ---------- Upload Grid ---------- */
        .lv-info-note {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(124, 58, 237, 0.04);
          border: 1px solid rgba(124, 58, 237, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 13.5px;
          color: #6B7280;
          margin-bottom: 24px;
          line-height: 1.5;
        }
        .lv-info-icon { font-size: 15px; flex-shrink: 0; }
        .lv-info-note strong { color: #f97316; }

        .lv-upload-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        .lv-upload-box {
          aspect-ratio: 1;
          background: #FAFAFA;
          border: 2px dashed #DDD;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          transition: all 0.3s ease;
        }
        .lv-upload-box:hover {
          border-color: #fed7aa;
          background: rgba(249, 115, 22, 0.02);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.06);
        }
        .lv-upload-box.has-image {
          border: 2px solid #10b981;
          background: transparent;
        }
        .lv-upload-box.has-image:hover {
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.12);
        }
        .lv-upload-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .lv-upload-overlay {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }
        .lv-upload-label {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .lv-upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .lv-upload-icon {
          color: #C4B5FD;
          transition: color 0.2s;
        }
        .lv-upload-box:hover .lv-upload-icon { color: #f97316; }
        .lv-upload-text {
          font-size: 11px;
          font-weight: 600;
          color: #B0B8C4;
          letter-spacing: 0.3px;
        }

        /* ---------- Map ---------- */
        .lv-map-wrapper {
          aspect-ratio: 1 / 1;
          max-width: 500px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .lv-map-wrapper:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        .lv-map-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #FAFAFA;
          border-radius: 20px;
          color: #9CA3AF;
          font-size: 14px;
        }
        .lv-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid #E5E7EB;
          border-top-color: #7C3AED;
          border-radius: 50%;
          animation: lvSpin 0.8s linear infinite;
        }

        /* ---------- Sidebar ---------- */
        .lv-sidebar {
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: sticky;
          top: 100px;
        }
        .lv-tip-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 22px;
          border-radius: 18px;
          border: 1px solid rgba(124, 58, 237, 0.08);
          transition: all 0.3s ease;
        }
        .lv-tip-card:hover {
          border-color: rgba(124, 58, 237, 0.18);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.06);
        }
        .lv-tip-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(124, 58, 237, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          margin-bottom: 12px;
        }
        .lv-tip-card h4 {
          color: #1F2937;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .lv-tip-card p {
          font-size: 13px;
          color: #6B7280;
          line-height: 1.55;
        }

        /* Earnings card */
        .lv-earnings-card {
          background: linear-gradient(145deg, #1a1030, #0f0a1e);
          padding: 28px 24px;
          border-radius: 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(124, 58, 237, 0.2);
        }
        .lv-earnings-glow {
          position: absolute;
          top: -40px;
          right: -40px;
          width: 120px;
          height: 120px;
          background: rgba(124, 58, 237, 0.3);
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
        }
        .lv-earnings-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.45);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 10px;
        }
        .lv-earnings-amount {
          display: block;
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, #A78BFA, #C4B5FD);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 4px;
        }
        .lv-earnings-amount sup {
          font-size: 16px;
        }
        .lv-earnings-period {
          display: block;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 16px;
        }
        .lv-earnings-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        .lv-earnings-bar-fill {
          width: 72%;
          height: 100%;
          background: linear-gradient(90deg, #7C3AED, #A78BFA);
          border-radius: 4px;
          animation: lvBarGrow 1.5s ease 0.5s both;
        }
        .lv-earnings-note {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.3);
        }

        /* ---------- Animations ---------- */
        .lv-fade-in {
          animation: lvFadeUp 0.45s ease both;
        }
        @keyframes lvFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lvPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes lvSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes lvBarGrow {
          from { width: 0; }
          to   { width: 72%; }
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 960px) {
          .lv-layout {
            grid-template-columns: 1fr;
          }
          .lv-sidebar {
            position: static;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .lv-earnings-card {
            grid-column: 1 / -1;
          }
          .lv-title { font-size: 2rem; }
        }
        @media (max-width: 640px) {
          .lv-page { padding: 80px 16px 60px; }
          .lv-form-card form { padding: 24px 20px 28px; }
          .lv-form-grid { grid-template-columns: 1fr; }
          .lv-upload-grid { grid-template-columns: repeat(3, 1fr); }
          .lv-stepper { flex-wrap: wrap; gap: 8px; }
          .lv-step-connector { width: 20px; }
          .lv-sidebar { grid-template-columns: 1fr; }
          .lv-btn-group { flex-direction: column; }
          .lv-btn-back { width: 100%; justify-content: center; }
          .lv-section-header { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
      `}</style>
    </div>
  );
};

export default ListVehicle;
