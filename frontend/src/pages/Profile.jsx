import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { useToast } from "../context/ToastContext";
import { formatVehicleImageUrl, handleImageError } from "../utils/imageHelper";
import {
  Car,
  Calendar,
  Star,
  Banknote,
  Bell,
  Plus,
  TrendingUp,
  Grid,
  Settings as SettingsIcon,
  PenLine,
  Sparkles,
  ChevronRight,
  LogOut,
  X,
  Trash2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  User,
  Camera,
  Upload,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast, confirm } = useToast();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null") || {
    name: "User",
    email: "",
    role: "renter",
  };

  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user.name || "");
  const [editPhone, setEditPhone] = useState(user.phone || "");
  const [profileImage, setProfileImage] = useState(user.profileImage || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);
  const settingsFileInputRef = useRef(null);

  const [myVehicles, setMyVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [myReviews, setMyReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState("");

  const userId = user.id || user._id;

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be 10MB or less.");
      return;
    }

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const uploadRes = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = uploadRes.data?.url;
      if (!uploadedUrl) {
        throw new Error("Upload did not return an image URL.");
      }

      await axios.post(`${API_URL}/api/auth/update-profile`, {
        userId: userId,
        profileImage: uploadedUrl,
      });

      const updatedUser = {
        ...user,
        profileImage: uploadedUrl,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setProfileImage(uploadedUrl);
      window.dispatchEvent(new Event("user-updated"));
      window.dispatchEvent(new Event("storage"));
      toast.success("Profile photo updated successfully!", "Avatar Changed");
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast.error("Failed to upload photo: " + (err.response?.data?.msg || err.message));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    const ok = await confirm({
      title: "Remove Profile Picture?",
      message: "Are you sure you want to remove your profile picture and switch back to initials?",
      confirmText: "Remove Photo",
      cancelText: "Keep Photo",
      isDestructive: true,
    });
    if (!ok) return;

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/update-profile`, {
        userId: userId,
        profileImage: "",
      });
      const updatedUser = {
        ...user,
        profileImage: "",
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setProfileImage("");
      window.dispatchEvent(new Event("user-updated"));
      window.dispatchEvent(new Event("storage"));
      toast.success("Profile picture removed.");
    } catch (err) {
      toast.error("Failed to remove photo: " + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("company");
    window.location.href = "/";
  };

  // Fetch real listed vehicles if user is host/owner
  useEffect(() => {
    if (!token) return;
    const fetchUserData = async () => {
      setLoadingVehicles(true);
      setLoadingReviews(true);
      try {
        const [vehRes, revRes] = await Promise.all([
          axios.get(`${API_URL}/api/vehicles/my`, {
            headers: { "x-auth-token": token },
          }).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/reviews/my`, {
            headers: { "x-auth-token": token },
          }).catch(() => ({ data: [] }))
        ]);
        setMyVehicles(vehRes.data || []);
        setMyReviews(revRes.data || []);
      } catch (err) {
        console.warn("Could not fetch user data:", err);
      } finally {
        setLoadingVehicles(false);
        setLoadingReviews(false);
      }
    };
    fetchUserData();
  }, [token]);

  const handleDeleteVehicle = async (vehicleId) => {
    const ok = await confirm({
      title: "Delete Vehicle Listing?",
      message: "Are you sure you want to delete this vehicle listing? This action cannot be undone.",
      confirmText: "Delete Listing",
      cancelText: "Keep Listing",
      isDestructive: true,
    });
    if (!ok) return;

    try {
      await axios.delete(`${API_URL}/api/vehicles/${vehicleId}`, {
        headers: { "x-auth-token": token },
      });
      setMyVehicles(myVehicles.filter((v) => v._id !== vehicleId));
      toast.success("Vehicle listing removed successfully.");
    } catch (err) {
      toast.error("Failed to delete vehicle: " + (err.response?.data?.msg || err.message));
    }
  };

  // Handle Edit Profile Button Click
  const handleEditClick = () => {
    setEditName(user.name || "");
    setShowEditModal(true);
  };

  // Handle Save Profile
  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      toast.warning("Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/update-profile`,
        {
          userId: userId,
          name: editName.trim(),
          phone: editPhone.trim(),
        },
      );

      // Update localStorage
      const updatedUser = { ...user, name: res.data.user.name };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Close modal and refresh
      setShowEditModal(false);
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      toast.error(
        "Failed to update profile: " + (err.response?.data?.msg || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      setSettingsStatus("Name cannot be empty");
      return;
    }
    setLoading(true);
    setSettingsStatus("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/update-profile`, {
        userId: userId,
        name: editName.trim(),
        phone: editPhone.trim(),
      });
      const updatedUser = { ...user, name: res.data.user.name, phone: editPhone.trim() };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSettingsStatus("Settings saved successfully!");
    } catch (err) {
      setSettingsStatus(
        "Failed to save: " + (err.response?.data?.msg || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const initial = user?.name?.[0]?.toUpperCase() || "U";
  const firstName = user?.name?.split(" ")[0] || "User";
  const isRenter = user?.role === "renter";

  const stats = isRenter ? [
    {
      icon: <Calendar size={20} />,
      label: "My Trips",
      value: "1",
      colorClass: "icon-blue",
    },
    {
      icon: <Star size={20} />,
      label: "Reviews Given",
      value: "1",
      colorClass: "icon-amber",
    }
  ] : [
    {
      icon: <Car size={20} />,
      label: "My Listings",
      value: `${myVehicles.length}`,
      colorClass: "icon-orange",
    },
    {
      icon: <Calendar size={20} />,
      label: "Total Bookings",
      value: "4",
      colorClass: "icon-blue",
    },
    {
      icon: <Star size={20} />,
      label: "Rating",
      value: "5.0",
      colorClass: "icon-amber",
    },
    {
      icon: <Banknote size={20} />,
      label: "Status",
      value: "Verified",
      colorClass: "icon-green",
    },
  ];

  const tabs = isRenter ? [
    { id: "overview", label: "Overview", icon: <Grid size={16} /> },
    { id: "bookings", label: "My Trips", icon: <Calendar size={16} /> },
    { id: "reviews", label: `My Reviews (${myReviews.length})`, icon: <Star size={16} /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon size={16} /> },
  ] : [
    { id: "overview", label: "Overview", icon: <Grid size={16} /> },
    { id: "listings", label: `My Cars (${myVehicles.length})`, icon: <Car size={16} /> },
    { id: "bookings", label: "Bookings", icon: <Calendar size={16} /> },
    { id: "reviews", label: `My Reviews (${myReviews.length})`, icon: <Star size={16} /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon size={16} /> },
  ];

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header-card">
          <div
            className="avatar-wrapper"
            onClick={() => fileInputRef.current?.click()}
            title="Click to change profile picture"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
              accept="image/*"
              style={{ display: "none" }}
            />
            {uploadingAvatar ? (
              <div className="avatar-lg avatar-loading">
                <Loader2 size={32} className="spinner-icon" />
              </div>
            ) : profileImage ? (
              <img
                src={profileImage}
                alt={user.name}
                className="avatar-lg avatar-img-cover"
              />
            ) : (
              <div className="avatar-lg">{initial}</div>
            )}
            <button
              type="button"
              className="avatar-edit-badge"
              title="Upload new profile picture"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <Camera size={14} />
            </button>
            <div className="online-indicator" title="Active Account"></div>
          </div>

          <div className="profile-meta">
            <div className="verified-badge">
              <Sparkles size={13} className="verified-icon" />
              <span>{isRenter ? "Verified Renter" : "Verified Host"}</span>
            </div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>

          <div className="header-actions">
            <button className="edit-btn" onClick={handleEditClick}>
              <PenLine size={16} /> Edit Profile
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          {stats.map((s, i) => (
            <div key={i} className="stat-box">
              <div className={`stat-icon-wrapper ${s.colorClass}`}>
                {s.icon}
              </div>
              <div className="stat-info">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Nav */}
        <div className="tab-nav-container">
          <div className="tab-nav">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.icon} <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="animate-in">
              <div className="overview-masonry">
                <div className="masonry-row">
                  {/* Welcome Back Block - Radiant Yamu Sunset Theme */}
                  <div className="overview-card welcome-card">
                    <div className="welcome-decor-circle" />
                    <div className="welcome-bell-badge">
                      <Bell size={18} />
                    </div>
                    <h2>Welcome back, {firstName}!</h2>
                    {isRenter ? (
                      <p>
                        Discover thousands of verified cars, SUVs, and vans available for self-drive or with driver across Sri Lanka.
                      </p>
                    ) : (
                      <p>
                        Your vehicle listings are live on Yamu Car Rentals. Keep your availability updated to receive more bookings.
                      </p>
                    )}
                    <Link to={isRenter ? "/vehicles" : "/list-my-car"} className="view-insights-btn">
                      {isRenter ? "Browse Vehicles" : "List New Car"} <ChevronRight size={16} />
                    </Link>
                  </div>

                  {/* Add New Vehicle Block */}
                  <div className="overview-card add-vehicle-card">
                    <div className="add-icon-wrapper">
                      <Plus size={22} />
                    </div>
                    {isRenter ? (
                      <>
                        <h3>Become a Host</h3>
                        <p>List your personal vehicle and start earning high passive income with full verified guest security.</p>
                        <Link to="/choose-listing-type" className="cta-link">
                          Get started <ChevronRight size={16} />
                        </Link>
                      </>
                    ) : (
                      <>
                        <h3>Add New Vehicle</h3>
                        <p>Have another car or van? List it now to multiply your monthly rental earnings.</p>
                        <Link to="/list-my-car" className="cta-link">
                          + Add Vehicle <ChevronRight size={16} />
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                {!isRenter && (
                  <div className="masonry-row">
                    {/* Annual Earnings Block */}
                    <div className="overview-card annual-earnings-card">
                      <div className="icon-wrapper icon-green">
                        <TrendingUp size={20} />
                      </div>
                      <h3>Rental Performance</h3>
                      <p>
                        Your listings have high booking interest this month.
                      </p>
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar-fill"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                    </div>

                    {/* Active Offers Block */}
                    <div className="overview-card active-offers-card">
                      <div className="offers-left">
                        <div className="icon-wrapper icon-orange">
                          <Star size={20} />
                        </div>
                        <div className="offers-text">
                          <h3>Host Rating & Perks</h3>
                          <p>Top Rated Host badge active on all your live listings.</p>
                        </div>
                      </div>
                      <Link to="/why-us" className="cta-link review-link">
                        Host Benefits <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "listings" && (
            <div className="animate-in">
              <div className="section-header">
                <div>
                  <h2>My Listed Vehicles</h2>
                  <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "0.9rem" }}>
                    Manage pricing, availability, and details for your {myVehicles.length} vehicles.
                  </p>
                </div>
                <Link to="/list-my-car" className="btn-sm">
                  <Plus size={16} /> Add Vehicle
                </Link>
              </div>

              {loadingVehicles ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>
                  <div className="profile-spinner" />
                  <p style={{ marginTop: 12, fontWeight: 600 }}>Loading your vehicles...</p>
                </div>
              ) : myVehicles.length === 0 ? (
                <div className="empty-pane">
                  <div className="empty-icon-circle">
                    <Car size={36} />
                  </div>
                  <h3>No vehicles listed yet</h3>
                  <p>List your car, van, or SUV to start earning passive income on Yamu Car Rentals.</p>
                  <Link to="/list-my-car" className="btn-primary-action">
                    <Plus size={16} /> List Your First Vehicle
                  </Link>
                </div>
              ) : (
                <div className="listings-grid">
                  {myVehicles.map((item) => (
                    <div key={item._id} className="listing-card-modern">
                      <div className="listing-card-media">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={formatVehicleImageUrl(item.images, item.vehicleType)}
                            alt={`${item.brand} ${item.model}`}
                            className="listing-img"
                            onError={(e) => handleImageError(e, formatVehicleImageUrl(null, item.vehicleType))}
                          />
                        ) : (
                          <div className="listing-placeholder">
                            <Car size={32} color="#f97316" />
                          </div>
                        )}
                        <span className="listing-year-badge">{item.year || "2024"}</span>
                        {item.vehicleType && (
                          <span className="listing-type-badge">{item.vehicleType}</span>
                        )}
                      </div>

                      <div className="listing-card-body">
                        <div className="listing-title-row">
                          <h4>
                            {item.brand} {item.model}
                          </h4>
                          <span className="status-pill active">Active</span>
                        </div>

                        <div className="listing-meta-row">
                          <span className="listing-location">
                            <MapPin size={13} /> {item.location || "Sri Lanka"}
                          </span>
                          <span className="listing-rate">
                            LKR {item.pricePerDay?.toLocaleString()} <small>/day</small>
                          </span>
                        </div>

                        <div className="listing-actions-row">
                          <Link to={`/vehicle/${item._id}`} className="btn-view-listing">
                            View Listing <ChevronRight size={14} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteVehicle(item._id)}
                            className="btn-delete-listing"
                            title="Delete Listing"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="animate-in empty-pane">
              <div className="empty-icon-circle">
                <Calendar size={36} />
              </div>
              <h3>No bookings to show</h3>
              <p>When verified customers book your vehicle or you reserve a car, all rental details will appear here.</p>
              <Link to="/vehicles" className="btn-primary-action">
                Browse Marketplace
              </Link>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="animate-in">
              <div className="section-header">
                <div>
                  <h2>My Reviews & Community Feedback</h2>
                  <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "0.9rem" }}>
                    Verified reviews and feedback you have submitted on Yamu Car Rentals.
                  </p>
                </div>
                <Link to="/reviews" className="btn-add-vehicle" style={{ textDecoration: "none" }}>
                  <Plus size={16} /> Write New Review
                </Link>
              </div>

              {loadingReviews ? (
                <div style={{ padding: "4rem 0", textAlign: "center", color: "#64748b" }}>
                  Loading your reviews...
                </div>
              ) : myReviews.length === 0 ? (
                <div className="empty-pane">
                  <div className="empty-icon-circle">
                    <Star size={36} />
                  </div>
                  <h3>No Reviews Written Yet</h3>
                  <p>Share your experience from past trips to help other travelers and support verified hosts.</p>
                  <Link to="/reviews" className="btn-primary-action">
                    Explore Reviews Portal & Write a Review
                  </Link>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem", marginTop: "1rem" }}>
                  {myReviews.map((rev) => (
                    <div
                      key={rev._id}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "1.4rem",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.8rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "2px" }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < rev.rating ? "#f59e0b" : "#e2e8f0"}
                              color={i < rev.rating ? "#f59e0b" : "#cbd5e1"}
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {rev.vehicle && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", padding: "6px 10px", borderRadius: "8px" }}>
                          <Car size={14} color="#f97316" />
                          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>
                            {rev.vehicle.brand} {rev.vehicle.model} ({rev.vehicle.year})
                          </span>
                        </div>
                      )}

                      {rev.title && (
                        <h4 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 800, color: "#0f172a" }}>
                          {rev.title}
                        </h4>
                      )}

                      <p style={{ margin: 0, fontSize: "0.88rem", color: "#475569", lineHeight: 1.5 }}>
                        {rev.comment}
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "0.6rem", borderTop: "1px solid #f1f5f9" }}>
                        <span style={{ fontSize: "0.78rem", color: "#10b981", fontWeight: 700 }}>
                          ✓ Verified Trip
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                          👍 {rev.helpfulCount || 0} found helpful
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="animate-in settings-pane">
              <div className="settings-header">
                <h2>Account Settings</h2>
                <p>Update your personal information and contact preferences.</p>
              </div>

              {settingsStatus && (
                <div
                  className={`settings-alert ${
                    settingsStatus.includes("Failed") ? "alert-error" : "alert-success"
                  }`}
                >
                  {settingsStatus}
                </div>
              )}

              <form className="settings-form" onSubmit={handleSaveSettings}>
                {/* Profile Photo Section in Settings */}
                <div className="field">
                  <label>Profile Picture</label>
                  <div className="avatar-edit-modal-row">
                    <div className="modal-avatar-preview">
                      {profileImage ? (
                        <img src={profileImage} alt={user.name} />
                      ) : (
                        <div className="modal-avatar-initial">{initial}</div>
                      )}
                    </div>
                    <div className="avatar-modal-btns">
                      <input
                        type="file"
                        ref={settingsFileInputRef}
                        onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        className="btn-upload-photo"
                        onClick={() => settingsFileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                      >
                        <Upload size={14} />
                        <span>{uploadingAvatar ? "Uploading..." : "Upload Photo"}</span>
                      </button>
                      {profileImage && (
                        <button
                          type="button"
                          className="btn-remove-photo"
                          onClick={handleRemoveAvatar}
                          disabled={loading}
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    style={{ opacity: 0.7, cursor: "not-allowed", background: "#f1f5f9" }}
                  />
                  <small style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    Email is linked to your account authentication and cannot be edited.
                  </small>
                </div>

                <div className="field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+94 77 123 4567"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>

                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Edit Name Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Profile Photo in Modal */}
              <div className="form-group">
                <label>Profile Picture</label>
                <div className="avatar-edit-modal-row">
                  <div className="modal-avatar-preview">
                    {profileImage ? (
                      <img src={profileImage} alt={user.name} />
                    ) : (
                      <div className="modal-avatar-initial">{initial}</div>
                    )}
                  </div>
                  <div className="avatar-modal-btns">
                    <input
                      type="file"
                      ref={modalFileInputRef}
                      onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="btn-upload-photo"
                      onClick={() => modalFileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                    >
                      <Upload size={14} />
                      <span>{uploadingAvatar ? "Uploading..." : "Change Photo"}</span>
                    </button>
                    {profileImage && (
                      <button
                        type="button"
                        className="btn-remove-photo"
                        onClick={handleRemoveAvatar}
                        disabled={loading}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>Mobile Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="input-field"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowEditModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={handleSaveProfile}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .profile-page {
          min-height: 100vh;
          padding: 120px 0 6rem;
          background: #faf9f7;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(249, 115, 22, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(234, 88, 12, 0.04) 0%, transparent 40%);
          font-family: var(--font-body, "Plus Jakarta Sans", -apple-system, sans-serif);
          color: #0f172a;
        }

        /* Profile Header Card */
        .profile-header-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 2.25rem;
          display: flex;
          align-items: center;
          gap: 1.75rem;
          margin-bottom: 2rem;
          border: 1px solid #f1f5f9;
          box-shadow: 0 10px 30px -8px rgba(15, 23, 42, 0.05);
          position: relative;
          overflow: hidden;
        }

        .profile-header-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #ff8800, #f97316, #ea580c);
        }

        .avatar-wrapper {
          position: relative;
          display: flex;
          flex-shrink: 0;
          cursor: pointer;
          border-radius: 20px;
          transition: transform 0.2s ease;
        }

        .avatar-wrapper:hover {
          transform: scale(1.03);
        }

        .avatar-lg {
          width: 84px;
          height: 84px;
          border-radius: 20px;
          background: linear-gradient(135deg, #ff8800 0%, #f97316 45%, #ea580c 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.4rem;
          font-weight: 800;
          color: #ffffff;
          box-shadow: 0 8px 24px -4px rgba(249, 115, 22, 0.45);
          letter-spacing: -1px;
          overflow: hidden;
        }

        .avatar-img-cover {
          width: 84px;
          height: 84px;
          border-radius: 20px;
          object-fit: cover;
        }

        .avatar-loading {
          background: #1e293b;
        }

        .spinner-icon {
          animation: spin 1s linear infinite;
          color: #ffffff;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .avatar-edit-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 26px;
          height: 26px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 50%;
          color: #f97316;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 2;
        }

        .avatar-wrapper:hover .avatar-edit-badge {
          background: #f97316;
          color: #ffffff;
          border-color: #f97316;
          transform: scale(1.15);
        }

        .online-indicator {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 20px;
          height: 20px;
          background: #10b981;
          border: 3px solid #ffffff;
          border-radius: 50%;
          z-index: 3;
        }

        .avatar-edit-modal-row {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px 16px;
          margin-top: 6px;
        }

        .modal-avatar-preview {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          overflow: hidden;
          background: linear-gradient(135deg, #ff8800, #ea580c);
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(249, 115, 22, 0.2);
        }

        .modal-avatar-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-avatar-initial {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          font-weight: 800;
          color: white;
        }

        .avatar-modal-btns {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn-upload-photo {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0f172a;
          color: white;
          border: none;
          padding: 0.5rem 0.95rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-upload-photo:hover {
          background: #f97316;
        }

        .btn-upload-photo:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-remove-photo {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.25);
          padding: 0.5rem 0.85rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-remove-photo:hover {
          background: #ef4444;
          color: white;
        }

        .profile-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #fff7ed;
          color: #ea580c;
          border: 1px solid rgba(249, 115, 22, 0.25);
          font-size: 0.78rem;
          font-weight: 750;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          width: fit-content;
          margin-bottom: 0.35rem;
        }

        .verified-icon {
          color: #ea580c;
        }

        .profile-meta h1 {
          font-family: var(--font-display, "Poppins", sans-serif);
          font-size: 1.85rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #0f172a;
          margin: 0;
          line-height: 1.2;
        }

        .profile-meta p {
          color: #64748b;
          font-size: 0.92rem;
          margin: 0;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .edit-btn {
          background: linear-gradient(135deg, #ff8800 0%, #f97316 45%, #ea580c 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 0.75rem 1.4rem;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.35);
        }

        .edit-btn:hover {
          background: linear-gradient(135deg, #ff9500 0%, #ea580c 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(234, 88, 12, 0.45);
        }

        .logout-btn {
          background: #fef2f2;
          border: 1px solid #fee2e2;
          color: #ef4444;
          border-radius: 12px;
          padding: 0.75rem 1.25rem;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: #ef4444;
          color: #ffffff;
          border-color: #ef4444;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.25);
        }

        /* Stats Row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .stat-box {
          background: #ffffff;
          border-radius: 20px;
          padding: 1.35rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.1rem;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
          transition: all 0.25s ease;
        }

        .stat-box:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px -4px rgba(249, 115, 22, 0.12);
          border-color: rgba(249, 115, 22, 0.25);
        }

        .stat-icon-wrapper,
        .icon-wrapper,
        .add-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          flex-shrink: 0;
        }

        .icon-orange,
        .stat-icon-wrapper.icon-orange {
          background: #fff7ed;
          color: #ea580c;
        }

        .icon-blue,
        .stat-icon-wrapper.icon-blue {
          background: #f0f9ff;
          color: #0284c7;
        }

        .icon-amber,
        .stat-icon-wrapper.icon-amber {
          background: #fefce8;
          color: #d97706;
        }

        .icon-green,
        .stat-icon-wrapper.icon-green {
          background: #ecfdf5;
          color: #10b981;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-family: var(--font-display, "Poppins", sans-serif);
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 0.82rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-top: 2px;
        }

        /* Navigation Pills */
        .tab-nav-container {
          display: flex;
          margin-bottom: 2rem;
        }

        .tab-nav {
          display: inline-flex;
          background: #ffffff;
          border-radius: 16px;
          padding: 0.4rem;
          gap: 0.35rem;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03);
        }

        .tab-btn {
          padding: 0.65rem 1.35rem;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: #64748b;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tab-btn:hover {
          color: #ea580c;
          background: #fff7ed;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #ff8800 0%, #f97316 45%, #ea580c 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.35);
        }

        .tab-content {
          min-height: 320px;
        }

        /* Overview Masonry */
        .overview-masonry {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .masonry-row {
          display: flex;
          gap: 1.5rem;
        }

        .overview-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .overview-card h3 {
          font-family: var(--font-display, "Poppins", sans-serif);
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0.85rem 0 0.35rem 0;
        }

        .overview-card p {
          font-size: 0.92rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 0;
        }

        .overview-card p strong {
          color: #0f172a;
        }

        .cta-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 1.25rem;
          color: #ea580c;
          font-weight: 750;
          font-size: 0.92rem;
          text-decoration: none;
          transition: gap 0.2s ease;
        }

        .cta-link:hover {
          gap: 0.6rem;
          color: #c2410c;
        }

        /* Radiant Yamu Welcome Card */
        .welcome-card {
          flex: 1.7;
          background: radial-gradient(circle at 85% 20%, #ff8800 0%, #f97316 40%, #ea580c 80%, #c2410c 100%);
          color: #ffffff;
          position: relative;
          overflow: hidden;
          border: none;
          box-shadow: 0 12px 32px -6px rgba(234, 88, 12, 0.4);
        }

        .welcome-decor-circle {
          position: absolute;
          top: -40px;
          right: -40px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
          pointer-events: none;
        }

        .welcome-bell-badge {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          margin-bottom: 1.25rem;
        }

        .welcome-card h2 {
          font-family: var(--font-display, "Poppins", sans-serif);
          font-size: 1.85rem;
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.02em;
        }

        .welcome-card p {
          color: rgba(255, 255, 255, 0.92);
          font-size: 0.98rem;
          max-width: 85%;
          margin-bottom: 1.75rem;
        }

        .view-insights-btn {
          background: #ffffff;
          color: #ea580c;
          border: none;
          padding: 0.75rem 1.4rem;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.92rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          width: fit-content;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
        }

        .view-insights-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
          background: #fffbf5;
          gap: 0.6rem;
        }

        .add-vehicle-card {
          flex: 1;
        }

        .add-vehicle-card .add-icon-wrapper {
          background: #fff7ed;
          color: #ea580c;
        }

        .annual-earnings-card {
          flex: 1;
        }

        .progress-bar-container {
          height: 8px;
          background: #f1f5f9;
          border-radius: 999px;
          margin-top: 1.25rem;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff8800, #ea580c);
          border-radius: 999px;
        }

        .active-offers-card {
          flex: 1.7;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2rem;
        }

        .offers-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .offers-text h3 {
          margin: 0 0 0.25rem 0;
        }

        .review-link {
          margin-top: 0;
          white-space: nowrap;
        }

        /* Listings Tab */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.75rem;
          gap: 1rem;
        }

        .section-header h2 {
          font-family: var(--font-display, "Poppins", sans-serif);
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .btn-sm {
          background: linear-gradient(135deg, #ff8800 0%, #f97316 45%, #ea580c 100%);
          color: #ffffff;
          padding: 0.7rem 1.35rem;
          border-radius: 12px;
          font-weight: 750;
          font-size: 0.9rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.35);
          transition: all 0.2s ease;
        }

        .btn-sm:hover {
          background: linear-gradient(135deg, #ff9500 0%, #ea580c 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(234, 88, 12, 0.45);
        }

        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .listing-card-modern {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #f1f5f9;
          box-shadow: 0 6px 24px -4px rgba(15, 23, 42, 0.05);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }

        .listing-card-modern:hover {
          transform: translateY(-4px);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 16px 36px -8px rgba(249, 115, 22, 0.15);
        }

        .listing-card-media {
          position: relative;
          height: 180px;
          background: #f8fafc;
        }

        .listing-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .listing-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff7ed;
        }

        .listing-year-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: rgba(255, 255, 255, 0.95);
          color: #0f172a;
          padding: 0.25rem 0.65rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 800;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .listing-type-badge {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          background: linear-gradient(135deg, #ff8800, #f97316);
          color: white;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .listing-card-body {
          padding: 1.35rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .listing-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.6rem;
        }

        .listing-title-row h4 {
          font-family: var(--font-display, "Poppins", sans-serif);
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .status-pill {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.25rem 0.7rem;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .status-pill.active {
          background: #ecfdf5;
          color: #10b981;
        }

        .listing-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .listing-location {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #64748b;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .listing-location svg {
          color: #ea580c;
        }

        .listing-rate {
          font-family: var(--font-display, "Poppins", sans-serif);
          font-size: 1.05rem;
          font-weight: 900;
          color: #ea580c;
        }

        .listing-rate small {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        .listing-actions-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: auto;
        }

        .btn-view-listing {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          background: #fff7ed;
          color: #ea580c;
          border: 1px solid rgba(249, 115, 22, 0.25);
          padding: 0.65rem 1rem;
          border-radius: 10px;
          font-weight: 750;
          font-size: 0.88rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-view-listing:hover {
          background: #ea580c;
          color: #ffffff;
          border-color: #ea580c;
        }

        .btn-delete-listing {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #fef2f2;
          color: #ef4444;
          border: 1px solid #fee2e2;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-delete-listing:hover {
          background: #ef4444;
          color: #ffffff;
        }

        /* Empty Panes */
        .empty-pane {
          background: #ffffff;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 4.5rem 2rem;
          text-align: center;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
        }

        .empty-icon-circle {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: #fff7ed;
          color: #ea580c;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .empty-pane h3 {
          color: #0f172a;
          font-size: 1.35rem;
          font-weight: 800;
          margin: 0;
        }

        .empty-pane p {
          color: #64748b;
          max-width: 420px;
          font-size: 0.92rem;
          margin: 0 0 0.75rem 0;
        }

        .btn-primary-action {
          background: linear-gradient(135deg, #ff8800 0%, #f97316 45%, #ea580c 100%);
          color: #ffffff;
          padding: 0.8rem 1.6rem;
          border-radius: 12px;
          font-weight: 750;
          font-size: 0.95rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.35);
          transition: all 0.2s ease;
        }

        .btn-primary-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(234, 88, 12, 0.45);
        }

        /* Settings Pane */
        .settings-pane {
          background: #ffffff;
          border-radius: 24px;
          padding: 2.5rem;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
          max-width: 680px;
        }

        .settings-header {
          margin-bottom: 2rem;
        }

        .settings-header h2 {
          font-family: var(--font-display, "Poppins", sans-serif);
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.35rem 0;
        }

        .settings-header p {
          color: #64748b;
          font-size: 0.92rem;
          margin: 0;
        }

        .settings-alert {
          padding: 0.85rem 1.25rem;
          border-radius: 12px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .alert-success {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .alert-error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .field label {
          font-size: 0.82rem;
          font-weight: 800;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .field input {
          padding: 0.85rem 1.15rem;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          font-family: inherit;
          font-size: 0.95rem;
          color: #0f172a;
          background: #f8fafc;
          transition: all 0.2s ease;
        }

        .field input:focus {
          outline: none;
          border-color: #f97316;
          background: #ffffff;
          box-shadow: 0 0 0 3.5px rgba(249, 115, 22, 0.15);
        }

        .save-btn {
          background: linear-gradient(135deg, #ff8800 0%, #f97316 45%, #ea580c 100%);
          color: #ffffff;
          border: none;
          padding: 0.9rem;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.95rem;
          margin-top: 0.5rem;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.35);
          transition: all 0.2s ease;
        }

        .save-btn:hover {
          background: linear-gradient(135deg, #ff9500 0%, #ea580c 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(234, 88, 12, 0.45);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        .modal-content {
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
          max-width: 480px;
          width: 90%;
          overflow: hidden;
          animation: slideUp 0.25s ease;
        }

        .modal-header {
          padding: 1.5rem 1.75rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          font-family: var(--font-display, "Poppins", sans-serif);
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
        }

        .modal-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          padding: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .modal-body {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 800;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .input-field {
          width: 100%;
          padding: 0.85rem 1.15rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          font-family: inherit;
          color: #0f172a;
          transition: all 0.2s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3.5px rgba(249, 115, 22, 0.15);
        }

        .modal-footer {
          padding: 1.25rem 1.75rem;
          border-top: 1px solid #f1f5f9;
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          background: #f8fafc;
        }

        .btn-cancel {
          padding: 0.75rem 1.35rem;
          background: #ffffff;
          color: #475569;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          background: #f1f5f9;
        }

        .btn-save {
          padding: 0.75rem 1.4rem;
          background: linear-gradient(135deg, #ff8800 0%, #f97316 45%, #ea580c 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35);
          transition: all 0.2s ease;
        }

        .btn-save:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(234, 88, 12, 0.45);
        }

        .profile-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #ffedd5;
          border-top-color: #f97316;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Responsive */
        @media (max-width: 992px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
          .masonry-row {
            flex-direction: column;
          }
          .active-offers-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }

        @media (max-width: 640px) {
          .profile-header-card {
            flex-direction: column;
            text-align: center;
            padding: 1.75rem;
            gap: 1.25rem;
          }
          .profile-meta {
            align-items: center;
          }
          .header-actions {
            width: 100%;
            justify-content: center;
          }
          .stats-row {
            grid-template-columns: 1fr;
          }
          .tab-nav {
            width: 100%;
            overflow-x: auto;
            justify-content: flex-start;
          }
          .tab-btn {
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
