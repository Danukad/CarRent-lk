import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Check,
  CheckCircle2,
  MessageSquare,
  Navigation,
  Fuel,
  Users,
  Settings2,
  Phone,
  Gauge,
  Calendar,
  Building2,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../config";
import { formatVehicleImageUrl, handleImageError } from "../utils/imageHelper";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import { useToast } from "../context/ToastContext";
import ReviewSection from "../components/ReviewSection";

const detailMapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1rem",
};

const VehicleDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  // Booking State
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Booked dates for demo
  const bookedDates = [
    addDays(new Date(), 2),
    addDays(new Date(), 3),
    addDays(new Date(), 7),
  ];

  const [sent, setSent] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const [vehicleRes, reviewsRes] = await Promise.all([
          axios.get(`${API_URL}/api/vehicles/${id}`),
          axios.get(`${API_URL}/api/vehicles/${id}/reviews`)
        ]);
        setVehicle(vehicleRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error("Error fetching vehicle data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleData();
  }, [id]);

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "5.0";
  const numReviews = reviews.length;

  const handleContact = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.warning("Please select your required booking dates on the calendar first.", "Dates Required");
      return;
    }

    const hostPhone = vehicle.company?.phone || "+94770000000";
    const cleanPhone = hostPhone.replace(/[^0-9]/g, "");
    const dateStr = `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
    const msg = `Hello! I would like to book the ${vehicle.brand} ${vehicle.model} (${vehicle.year}) listed on Yamu Car Rentals for dates ${dateStr}. Is it available?`;
    const waUrl = `https://wa.me/${cleanPhone.startsWith("0") ? "94" + cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(msg)}`;

    // Try posting bid/inquiry if logged in
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post(
          `${API_URL}/api/bids`,
          {
            vehicleId: vehicle._id,
            offerPrice: vehicle.pricePerDay,
            message: `Booking inquiry for ${dateStr}`,
          },
          { headers: { "x-auth-token": token } }
        )
        .catch((err) => console.warn("Inquiry logged:", err.message));
    }

    setSent(true);
    // Open WhatsApp in new tab
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="detail-wrap">
        <div className="container" style={{ textAlign: "center", padding: "8rem 0" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem" }} />
          <p style={{ color: "#6b7280" }}>Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="detail-wrap">
        <div className="container" style={{ textAlign: "center", padding: "8rem 0" }}>
          <h2 style={{ color: "#111827" }}>Vehicle not found</h2>
          <Link to="/vehicles" style={{ color: "#f97316", fontWeight: 700 }}>← Back to Listings</Link>
        </div>
      </div>
    );
  }

  const rawImages = Array.isArray(vehicle.images) && vehicle.images.length > 0
    ? vehicle.images.filter(img => typeof img === "string" && img.trim() !== "")
    : [];

  const images = rawImages.length > 0
    ? rawImages.map(img => formatVehicleImageUrl(img, vehicle.vehicleType))
    : [formatVehicleImageUrl(null, vehicle.vehicleType)];

  const currentImage = images[activeImageIndex] || images[0];

  return (
    <div className="detail-wrap">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/vehicles">← Back to Listings</Link>
          {vehicle.company && (
            <span style={{ marginLeft: 8, color: "#94a3b8" }}>
              / <Link to={`/companies/${vehicle.company._id}`} style={{ color: "#ea580c" }}>{vehicle.company.companyName}</Link>
            </span>
          )}
        </div>

        <div className="detail-grid">
          {/* Left: Info */}
          <div className="detail-main">
            <div className="main-image-wrap">
              <img
                src={currentImage}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="main-image"
                onError={handleImageError}
              />
              <div className="image-badge">
                <MapPin
                  size={14}
                  style={{
                    marginRight: "4px",
                    verticalAlign: "middle",
                    display: "inline-block",
                  }}
                />
                <span>{vehicle.location}</span>
              </div>
            </div>

            {/* Multiple Photos Thumbnails Gallery */}
            {images.length > 1 && (
              <div className="thumbnails-gallery" style={{ display: "flex", gap: 10, marginBottom: "1.75rem", overflowX: "auto", paddingBottom: 4 }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: 72,
                      height: 52,
                      borderRadius: 10,
                      overflow: "hidden",
                      border: activeImageIndex === idx ? "2.5px solid #ea580c" : "1.5px solid #e2e8f0",
                      padding: 0,
                      cursor: "pointer",
                      flexShrink: 0,
                      background: "#fff",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="vehicle-header">
              <div>
                <span className="vehicle-year-chip">{vehicle.year}</span>
                {vehicle.vehicleType && (
                  <span className="vehicle-year-chip" style={{ marginLeft: 6, background: "rgba(249,115,22,0.12)", color: "#ea580c" }}>
                    {vehicle.vehicleType}
                  </span>
                )}
                <h1>
                  {vehicle.brand} {vehicle.model}
                </h1>
              </div>
              <div className="vehicle-rating">
                <span>
                  <Star
                    size={16}
                    fill="#f59e0b"
                    color="#f59e0b"
                    style={{
                      marginRight: "6px",
                      verticalAlign: "middle",
                      display: "inline-block",
                    }}
                  />
                  {avgRating}
                </span>
                <small>{numReviews} reviews</small>
              </div>
            </div>

            {/* Key Specs Card */}
            <div className="specs-overview-card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: "2rem", background: "#ffffff", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Fuel size={18} color="#ea580c" />
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 700 }}>FUEL</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>{vehicle.fuelType || "Petrol"}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Settings2 size={18} color="#ea580c" />
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 700 }}>TRANSMISSION</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>{vehicle.transmission || "Automatic"}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={18} color="#ea580c" />
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 700 }}>SEATING</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>{vehicle.seats || 5} Seats</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Gauge size={18} color="#ea580c" />
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 700 }}>AFTER 100KM</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>LKR {vehicle.pricePerKmAfter100km || 0}/km</div>
                </div>
              </div>
            </div>

            <div className="about-section">
              <h3>About This Vehicle</h3>
              <p>{vehicle.description || "Well-maintained, clean, and reliable vehicle ready for self-drive or chauffeur rental across Sri Lanka."}</p>
            </div>

            <div className="features-section">
              <h3>What's Included</h3>
              <div className="features-grid">
                {[
                  "Air Conditioning",
                  "Comprehensive Insurance",
                  "Bluetooth Audio System",
                  "24/7 Roadside Assistance",
                  "Free Islandwide Support",
                  "Verified Host Verification",
                ].map((f) => (
                  <div key={f} className="feature-tag">
                    <Check size={16} className="feature-check" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map Section */}
            {vehicle.lat && vehicle.lng && (
              <div className="location-map-section">
                <h3>
                  <Navigation size={18} className="feature-check" />
                  Pickup & Return Location
                </h3>
                <p className="location-address">
                  <MapPin size={14} /> {vehicle.location}
                </p>
                <div className="detail-map-wrapper">
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={detailMapContainerStyle}
                      center={{ lat: Number(vehicle.lat), lng: Number(vehicle.lng) }}
                      zoom={15}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        zoomControl: true,
                        styles: [
                          { featureType: "poi", stylers: [{ visibility: "off" }] },
                          { featureType: "transit", stylers: [{ visibility: "off" }] },
                        ],
                      }}
                    >
                      <MarkerF
                        position={{ lat: Number(vehicle.lat), lng: Number(vehicle.lng) }}
                        title={`${vehicle.brand} ${vehicle.model} - Pickup Location`}
                      />
                    </GoogleMap>
                  ) : (
                    <div className="map-loading-placeholder">
                      <Navigation size={24} color="#9ca3af" />
                      <p>Loading Map...</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <ReviewSection 
              vehicleId={vehicle._id} 
              reviews={reviews} 
              onReviewAdded={handleReviewAdded} 
            />
          </div>

          {/* Right: Booking Sidebar */}
          <aside className="bid-panel">
            <div className="bid-card">
              <div className="price-row">
                <span className="price">
                  LKR {vehicle.pricePerDay?.toLocaleString()}
                </span>
                <span className="per-day">/ day</span>
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#ea580c",
                  background: "#fff7ed",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  display: "inline-block",
                  marginTop: "6px",
                  marginBottom: "12px",
                  border: "1px solid #ffedd5",
                }}
              >
                ⚡ Free 100 km/day included • +LKR {(vehicle.pricePerKmAfter100km || 0).toLocaleString()}/km extra
              </div>
              
              <div className="owner-row">
                <div className="owner-avatar">{vehicle.company?.companyName?.[0] || vehicle.owner?.name?.[0] || "Y"}</div>
                <div>
                  <strong>{vehicle.company?.companyName || vehicle.owner?.name || "Verified Partner"}</strong>
                  <p>{vehicle.company ? "Verified Fleet Partner" : "Verified Individual Host"}</p>
                </div>
              </div>
              <hr className="divider" />

              {sent ? (
                <div className="sent-msg">
                  <CheckCircle2 size={44} className="sent-check-icon" />
                  <h3>Booking Chat Launched!</h3>
                  <p>WhatsApp was opened with your booking details. The host will confirm availability right away.</p>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ marginTop: 12, padding: "8px 16px", fontSize: "0.88rem" }}
                    onClick={() => setSent(false)}
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <div className="booking-form">
                  <h3>Check Availability</h3>
                  <p>Select your required dates below. Gray dates are already booked.</p>
                  
                  <div className="calendar-wrapper">
                    <DatePicker
                      selected={startDate}
                      onChange={(update) => setDateRange(update)}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      inline
                      minDate={new Date()}
                      excludeDates={bookedDates}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleContact}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginTop: "1rem"
                    }}
                  >
                    <MessageSquare size={18} />
                    <span>Contact via WhatsApp</span>
                  </button>

                  {vehicle.company?.phone && (
                    <a
                      href={`tel:${vehicle.company.phone.replace(/[^0-9]/g, "")}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        marginTop: 10,
                        color: "#64748b",
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      <Phone size={14} /> Call Host Directly: {vehicle.company.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .detail-wrap {
          padding: 120px 0 6rem;          
          background: #f8fafc;
          transition: background-color 0.3s ease;
        }
        .breadcrumb {
          margin-bottom: 1.5rem;
        }
        .breadcrumb a {
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .breadcrumb a:hover { color: #0f172a; }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2.5rem;
          align-items: start;
        }
        .main-image-wrap {
          position: relative;
          margin-bottom: 2rem;
        }
        .main-image {
          width: 100%;
          height: 420px;
          object-fit: cover;
          border-radius: 1.25rem;
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }
        .image-badge {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(10px);
          color: white;
          padding: 0.4rem 0.9rem;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .vehicle-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        .vehicle-year-chip {
          display: inline-block;
          background: rgba(124,58,237,0.15);
          color: var(--primary-light);
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .vehicle-header h1 { font-size: 2rem; }
        .vehicle-rating {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          text-align: center;
          flex-shrink: 0;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .vehicle-rating span { font-weight: 800; font-size: 1.1rem; }
        .vehicle-rating small { color: var(--text-muted); font-size: 0.8rem; }
        .about-section, .features-section {
          margin-bottom: 2rem;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .about-section h3, .features-section h3 {
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }
        .about-section p { line-height: 1.75; color: var(--text-muted); }
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
          margin-top: 0.75rem;
        }
        .feature-tag {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .feature-check {
          color: var(--accent);
          flex-shrink: 0;
        }
        .sent-check-icon {
          color: var(--accent);
          margin-bottom: 0.5rem;
        }
        
        /* Bid Panel */
        .bid-panel { position: sticky; top: 88px; }
        .bid-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 1.25rem;
          padding: 1.75rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }
        .price-row {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
        }
        .price {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -1px;
        }
        .per-day { color: var(--text-muted); font-weight: 500; }
        .owner-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .owner-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--grad-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          color: white;
          flex-shrink: 0;
        }
        .owner-row strong { display: block; color: #0f172a; font-size: 0.95rem; }
        .owner-row p { color: var(--text-muted); font-size: 0.8rem; margin: 0; }
        .divider { margin: 1.5rem 0; border: none; border-top: 1px solid var(--border); }
        
        /* Booking Form */
        .booking-form h3 { margin-bottom: 0.3rem; font-size: 1.1rem; }
        .booking-form > p { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.25rem; line-height: 1.5; }
        .booking-form { display: flex; flex-direction: column; }
        
        /* Custom react-datepicker styling for premium look */
        .calendar-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
        }
        .react-datepicker {
          border: 1px solid var(--border) !important;
          border-radius: 12px !important;
          font-family: inherit !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
          padding: 0.5rem !important;
          width: 100%;
        }
        .react-datepicker__month-container {
          width: 100%;
        }
        .react-datepicker__header {
          background-color: transparent !important;
          border-bottom: 1px solid var(--border) !important;
          padding-top: 0.5rem !important;
        }
        .react-datepicker__current-month {
          font-weight: 700 !important;
          font-size: 1rem !important;
          color: #0f172a !important;
          margin-bottom: 0.5rem !important;
        }
        .react-datepicker__day-name {
          color: var(--text-muted) !important;
          font-weight: 600 !important;
          width: 2rem !important;
          line-height: 2rem !important;
          margin: 0.2rem !important;
        }
        .react-datepicker__day {
          width: 2rem !important;
          line-height: 2rem !important;
          margin: 0.2rem !important;
          border-radius: 6px !important;
          color: #0f172a !important;
          font-weight: 500 !important;
          transition: all 0.2s;
        }
        .react-datepicker__day:hover {
          background-color: var(--primary-soft) !important;
          color: var(--primary) !important;
        }
        .react-datepicker__day--selected, 
        .react-datepicker__day--in-range, 
        .react-datepicker__day--in-selecting-range {
          background-color: var(--primary) !important;
          color: white !important;
          font-weight: 700 !important;
        }
        .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range) {
          background-color: rgba(249, 115, 22, 0.4) !important;
        }
        /* Excluded / Booked Dates */
        .react-datepicker__day--excluded {
          background-color: #f1f5f9 !important;
          color: #cbd5e1 !important;
          text-decoration: line-through !important;
          cursor: not-allowed !important;
        }
        .react-datepicker__day--excluded:hover {
          background-color: #f1f5f9 !important;
          color: #cbd5e1 !important;
        }
        .react-datepicker__navigation {
          top: 0.8rem !important;
        }

        .sent-msg {
          text-align: center;
          padding: 1.5rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .sent-msg span { font-size: 2.5rem; }
        .sent-msg h3 { color: var(--accent); }
        .sent-msg p { color: var(--text-muted); font-size: 0.9rem; }

        /* Location Map Section */
        .location-map-section {
          margin-bottom: 2rem;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          animation: fadeInMap 0.5s ease both 0.2s;
        }
        .location-map-section h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        .location-address {
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        .detail-map-wrapper {
          width: 100%;
          height: 280px;
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid rgba(249, 115, 22, 0.1);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }
        .detail-map-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 0.75rem;
          color: #6b7280;
          background: #f9fafb;
          border-radius: 1rem;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.05);
          border-top-color: #f97316;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInMap {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr; }
          .bid-panel { position: relative; top: auto; }
          .main-image { height: 280px; }
          .features-grid { grid-template-columns: 1fr; }
          .detail-map-wrapper { height: 220px; }
        }
      `}</style>
    </div>
  );
};

export default VehicleDetail;
