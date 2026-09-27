import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { useToast } from "../context/ToastContext";
import { formatVehicleImageUrl, handleImageError } from "../utils/imageHelper";
import {
  BarChart3,
  Building2,
  CalendarCheck,
  Car,
  CarFront,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Edit3,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Plus,
  Settings,
  Save,
  TrendingUp,
  Trash2,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatLKR, revenueData } from "../data/mock";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Fleet", icon: CarFront },
  { label: "Bookings", icon: CalendarCheck },
  { label: "Payments", icon: CreditCard },
  { label: "Customers", icon: Users },
  { label: "Settings", icon: Settings },
];

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [company, setCompany] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [newCompanyName, setNewCompanyName] = useState(user?.name ? `${user.name} Rentals` : "");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("Colombo, Sri Lanka");

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const [companyRes, vehiclesRes] = await Promise.all([
          axios.get(`${API_URL}/api/companies/me`, {
            headers: { "x-auth-token": token },
          }),
          axios.get(`${API_URL}/api/vehicles/my`, {
            headers: { "x-auth-token": token },
          }),
        ]);
        if (companyRes.data) {
          setCompany(companyRes.data);
          setEditData(companyRes.data);
          // Sync updated role in local storage
          if (user && user.role !== "company") {
            const updatedUser = { ...user, role: "company" };
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        }
        setVehicles(vehiclesRes.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleQuickCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/companies/me`,
        {
          companyName: newCompanyName || `${user?.name || "My"} Rentals`,
          phone: newPhone,
          address: newAddress,
          contactEmail: user?.email || "",
        },
        { headers: { "x-auth-token": token } }
      );
      setCompany(res.data);
      setEditData(res.data);
      if (user && user.role !== "company") {
        const updatedUser = { ...user, role: "company" };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      toast.success("Company profile created successfully!");
    } catch (err) {
      toast.error("Failed to initialize company profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${API_URL}/api/companies/me`, editData, {
        headers: { "x-auth-token": token },
      });
      setCompany(res.data);
      setEditMode(false);
      toast.success("Company profile updated successfully!");
    } catch (err) {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (vehicleId) => {
    try {
      await axios.delete(`${API_URL}/api/vehicles/${vehicleId}`, {
        headers: { "x-auth-token": token },
      });
      setVehicles(vehicles.filter((v) => v._id !== vehicleId));
      setDeleteConfirm(null);
      toast.success("Vehicle removed from fleet.");
    } catch (err) {
      toast.error("Failed to delete vehicle: " + (err.response?.data?.msg || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const totalRevenue = revenueData.reduce((s, r) => s + r.revenue, 0);

  /* ── Loading state ── */
  if (loading)
    return (
      <div className="cd-loading">
        <div className="cd-spinner" />
        <p>Loading your dashboard...</p>
        <style>{loadingCSS}</style>
      </div>
    );

  /* ── No company found / Quick Setup Fallback ── */
  if (!company)
    return (
      <div className="cd-loading" style={{ padding: "40px 20px" }}>
        <div className="cd-error-icon" style={{ background: "#FFEDD5", color: "#F97316" }}>
          <Building2 size={36} />
        </div>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 8px 0" }}>Setup Your Company Profile</h2>
        <p style={{ color: "#64748B", maxWidth: 440, textAlign: "center", marginBottom: 24, fontSize: "0.95rem" }}>
          Provide your company details below to initialize your fleet manager dashboard.
        </p>

        <form onSubmit={handleQuickCreate} style={{ width: "100%", maxWidth: 460, background: "#fff", padding: "28px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="cd-form-group">
            <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#334155", marginBottom: 6 }}>Company Name</label>
            <input 
              type="text" 
              placeholder="e.g. Colombo Premier Fleet" 
              required
              value={newCompanyName} 
              onChange={(e) => setNewCompanyName(e.target.value)} 
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #CBD5E1", fontSize: "0.9rem", boxSizing: "border-box" }}
            />
          </div>
          <div className="cd-form-group">
            <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#334155", marginBottom: 6 }}>Phone Number</label>
            <input 
              type="text" 
              placeholder="e.g. +94 77 123 4567" 
              value={newPhone} 
              onChange={(e) => setNewPhone(e.target.value)} 
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #CBD5E1", fontSize: "0.9rem", boxSizing: "border-box" }}
            />
          </div>
          <div className="cd-form-group">
            <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#334155", marginBottom: 6 }}>Address / City</label>
            <input 
              type="text" 
              placeholder="e.g. Colombo 03, Sri Lanka" 
              value={newAddress} 
              onChange={(e) => setNewAddress(e.target.value)} 
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #CBD5E1", fontSize: "0.9rem", boxSizing: "border-box" }}
            />
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className="cd-add-vehicle-btn" 
            style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: 8, fontSize: "0.95rem" }}
          >
            {saving ? "Creating Profile..." : "Create & Launch Dashboard →"}
          </button>
          <button 
            type="button" 
            onClick={handleLogout} 
            style={{ background: "transparent", border: "none", color: "#EF4444", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", marginTop: 4, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <LogOut size={14} /> Log out of account
          </button>
        </form>
        <style>{loadingCSS}</style>
      </div>
    );

  return (
    <>
      <div className="cd-wrapper">
        <div className="cd-layout">
          {/* ── Sidebar ── */}
          <aside className="cd-sidebar">
            <Link to="/" className="cd-logo">
              <span className="cd-logo-icon"><CarFront size={18} /></span>
              <span className="cd-logo-text">
                CarRents<span className="cd-logo-accent">.lk</span>
              </span>
            </Link>

            <nav className="cd-nav">
              {navItems.map(({ label, icon: Icon, active }) => (
                <button key={label} type="button"
                  className={`cd-nav-item ${active ? "cd-nav-active" : ""}`}>
                  <Icon size={16} />
                  {label}
                </button>
              ))}

              <div className="cd-nav-divider" />

              <Link to={`/companies/${company._id}`} className="cd-nav-item" target="_blank">
                <ExternalLink size={16} />
                View Public Page
              </Link>

              <div className="cd-nav-divider" />

              <button className="cd-nav-item cd-nav-logout" onClick={handleLogout}>
                <LogOut size={16} />
                Log Out
              </button>
            </nav>

            <div className="cd-sidebar-card">
              <p className="cd-sidebar-card-name">{company.companyName}</p>
              <p className="cd-sidebar-card-sub">
                <CheckCircle size={10} style={{ color: "#10b981" }} /> Verified company · Colombo
              </p>
              <Link to="/list-my-car" className="cd-add-vehicle-btn">
                <Plus size={14} /> Add vehicle
              </Link>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="cd-main">
            <header className="cd-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1 className="cd-title">
                  Good morning, <span style={{ color: "#f97316" }}>{company.companyName}</span>
                </h1>
                <p className="cd-subtitle">Here's how your fleet performed this month.</p>
              </div>
              <button 
                type="button" 
                onClick={handleLogout}
                className="cd-btn-outline"
                style={{ color: "#EF4444", borderColor: "rgba(239,68,68,0.3)", display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </header>

            {/* ── Stat cards ── */}
            <div className="cd-stats-grid">
              <StatCard icon={Wallet} label="Revenue (7 months)" value={formatLKR(totalRevenue)} delta="+18.2%" deltaColor="#10b981" />
              <StatCard icon={CalendarCheck} label="Active bookings" value="12" delta="+3 today" deltaColor="#10b981" />
              <StatCard icon={CarFront} label="Fleet size" value={`${vehicles.length} vehicles`} delta={`${vehicles.length > 0 ? vehicles.length : 0} listed`} deltaColor="#71717a" />
              <StatCard icon={TrendingUp} label="Utilisation" value="78%" delta="+6.4%" deltaColor="#10b981" />
            </div>

            {/* ── Chart + Quick actions row ── */}
            <div className="cd-mid-row">
              <section className="cd-card cd-chart-card">
                <div className="cd-card-head">
                  <h2 className="cd-card-title">Revenue (LKR)</h2>
                  <span className="cd-monthly-badge"><BarChart3 size={14} /> Monthly</span>
                </div>
                <div className="cd-chart-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0f766e" stopOpacity={0.55} />
                          <stop offset="100%" stopColor="#0f766e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                      <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #e5e7eb", background: "#fff", color: "#111827" }} formatter={(v) => formatLKR(v)} />
                      <Area type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={3} fill="url(#rev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="cd-card cd-actions-card">
                <h2 className="cd-card-title">Quick actions</h2>
                <div className="cd-actions-grid">
                  {[
                    { label: "Add vehicle", icon: Plus, to: "/list-my-car" },
                    { label: "New booking", icon: CalendarCheck },
                    { label: "Withdraw", icon: Wallet },
                    { label: "Reports", icon: BarChart3 },
                  ].map(({ label, icon: Icon, to }) => (
                    to ? (
                      <Link key={label} to={to} className="cd-action-btn">
                        <Icon size={20} className="cd-action-icon" />
                        <span className="cd-action-label">{label}</span>
                      </Link>
                    ) : (
                      <button key={label} type="button" className="cd-action-btn">
                        <Icon size={20} className="cd-action-icon" />
                        <span className="cd-action-label">{label}</span>
                      </button>
                    )
                  ))}
                </div>

                <h3 className="cd-payment-title">Payment status</h3>
                <ul className="cd-payment-list">
                  {[
                    { label: "Cleared", value: 412000, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
                    { label: "Pending payout", value: 96500, color: "#f97316", bg: "rgba(249,115,22,0.1)" },
                    { label: "Refunded", value: 34500, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
                  ].map((p) => (
                    <li key={p.label} className="cd-payment-row" style={{ background: p.bg }}>
                      <span className="cd-payment-label">{p.label}</span>
                      <span className="cd-payment-value" style={{ color: p.color }}>{formatLKR(p.value)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* ── Company Profile Card ── */}
            <section className="cd-card cd-profile-card">
              <div className="cd-card-head">
                <div>
                  <h2 className="cd-card-title">Company Information</h2>
                  <p className="cd-card-desc">Manage your public contact details.</p>
                </div>
                {!editMode ? (
                  <button className="cd-btn-outline" onClick={() => setEditMode(true)}>
                    <Edit3 size={12} /> Edit
                  </button>
                ) : (
                  <div className="cd-edit-actions">
                    <button className="cd-btn-text" onClick={() => { setEditMode(false); setEditData(company); }}>Cancel</button>
                    <button className="cd-btn-primary-sm" onClick={handleSave} disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>
              <div className="cd-card-body">
                {editMode ? (
                  <div className="cd-edit-form">
                    <div className="cd-form-row">
                      <div className="cd-form-group">
                        <label>Company Name</label>
                        <input type="text" value={editData.companyName || ""} onChange={(e) => setEditData({ ...editData, companyName: e.target.value })} />
                      </div>
                      <div className="cd-form-group">
                        <label>Phone Number</label>
                        <input type="text" value={editData.phone || ""} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
                      </div>
                    </div>
                    <div className="cd-form-row">
                      <div className="cd-form-group">
                        <label>Contact Email</label>
                        <input type="email" value={editData.contactEmail || ""} onChange={(e) => setEditData({ ...editData, contactEmail: e.target.value })} />
                      </div>
                      <div className="cd-form-group">
                        <label>Address</label>
                        <input type="text" value={editData.address || ""} onChange={(e) => setEditData({ ...editData, address: e.target.value })} />
                      </div>
                    </div>
                    <div className="cd-form-group">
                      <label>Logo URL</label>
                      <input type="text" value={editData.logo || ""} onChange={(e) => setEditData({ ...editData, logo: e.target.value })} />
                    </div>
                    <div className="cd-form-group">
                      <label>Description</label>
                      <textarea rows={3} value={editData.description || ""} onChange={(e) => setEditData({ ...editData, description: e.target.value })} placeholder="Describe your services..." />
                    </div>
                  </div>
                ) : (
                  <div className="cd-info-grid">
                    <div className="cd-info-item">
                      <div className="cd-info-icon"><MapPin size={16} /></div>
                      <div><span className="cd-info-label">Address</span><span className="cd-info-value">{company.address || "Not specified"}</span></div>
                    </div>
                    <div className="cd-info-item">
                      <div className="cd-info-icon"><Phone size={16} /></div>
                      <div><span className="cd-info-label">Phone</span><span className="cd-info-value">{company.phone || "Not specified"}</span></div>
                    </div>
                    <div className="cd-info-item">
                      <div className="cd-info-icon"><Mail size={16} /></div>
                      <div><span className="cd-info-label">Email</span><span className="cd-info-value">{company.contactEmail || "Not specified"}</span></div>
                    </div>
                    {company.description && (
                      <div className="cd-info-item cd-info-full">
                        <div><span className="cd-info-label">About</span><p className="cd-info-desc">{company.description}</p></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* ── Vehicle Fleet Table ── */}
            <section className="cd-card cd-fleet-card">
              <div className="cd-card-head">
                <div>
                  <h2 className="cd-card-title">Vehicle Fleet</h2>
                  <p className="cd-card-desc">You have {vehicles.length} vehicles active.</p>
                </div>
                <Link to="/list-my-car" className="cd-btn-primary-sm"><Plus size={12} /> Add</Link>
              </div>
              <div className="cd-card-body" style={{ padding: 0 }}>
                {vehicles.length === 0 ? (
                  <div className="cd-empty-state">
                    <Car size={24} style={{ color: "#f97316" }} />
                    <h3>Your fleet is empty</h3>
                    <p>Start building your presence.</p>
                    <Link to="/list-my-car" className="cd-add-vehicle-btn" style={{ marginTop: 8 }}>Add Vehicle</Link>
                  </div>
                ) : (
                  <div className="cd-table-wrap">
                    <table className="cd-table">
                      <thead>
                        <tr>
                          <th>Vehicle Details</th>
                          <th>Location</th>
                          <th>Rate / Day</th>
                          <th style={{ textAlign: "right" }}>Manage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicles.map((v) => (
                          <tr key={v._id}>
                            <td>
                              <div className="cd-cell-vehicle">
                                {v.images && v.images.length > 0 ? (
                                  <img
                                    src={formatVehicleImageUrl(v.images, v.vehicleType)}
                                    alt={v.brand}
                                    className="cd-vehicle-thumb"
                                    onError={(e) => handleImageError(e, formatVehicleImageUrl(null, v.vehicleType))}
                                  />
                                ) : (
                                  <div className="cd-vehicle-thumb-placeholder"><Car size={14} /></div>
                                )}
                                <div>
                                  <span className="cd-vehicle-name">{v.brand} {v.model}</span>
                                  <span className="cd-vehicle-year">{v.year}</span>
                                </div>
                              </div>
                            </td>
                            <td className="cd-cell-muted">
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                <MapPin size={12} /> {v.location}
                              </span>
                            </td>
                            <td className="cd-cell-price">LKR {v.pricePerDay?.toLocaleString()}</td>
                            <td>
                              <div className="cd-cell-actions">
                                <Link to={`/vehicle/${v._id}`} className="cd-action-icon-btn cd-view-btn" title="View"><ChevronRight size={14} /></Link>
                                <button className="cd-action-icon-btn cd-delete-btn" onClick={() => setDeleteConfirm(v._id)} title="Delete"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <div className="cd-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="cd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cd-modal-icon"><Trash2 size={24} /></div>
            <h3>Delete Vehicle?</h3>
            <p>Permanently delete this vehicle from the marketplace?</p>
            <div className="cd-modal-actions">
              <button className="cd-btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="cd-btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{dashboardCSS}</style>
    </>
  );
}

function StatCard({ icon: Icon, label, value, delta, deltaColor }) {
  return (
    <div className="cd-stat-card">
      <div className="cd-stat-top">
        <span className="cd-stat-icon"><Icon size={20} /></span>
        <p className="cd-stat-label">{label}</p>
      </div>
      <p className="cd-stat-value">{value}</p>
      <p className="cd-stat-delta" style={{ color: deltaColor }}>{delta}</p>
    </div>
  );
}

/* ── Loading/Error CSS ── */
const loadingCSS = `
  .cd-loading {
    min-height: 80vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    font-family: var(--font-body, "Plus Jakarta Sans", sans-serif);
  }
  .cd-spinner {
    width: 48px; height: 48px;
    border: 3px solid #FFEDD5; border-top-color: #F97316;
    border-radius: 50%; animation: cd-spin 1s ease infinite; margin-bottom: 1rem;
  }
  @keyframes cd-spin { to { transform: rotate(360deg); } }
  .cd-error-icon {
    width: 60px; height: 60px; background: #FEE2E2; color: #EF4444;
    border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;
  }
`;

/* ── Main Dashboard CSS ── */
const dashboardCSS = `
  .cd-wrapper {
    min-height: 100vh;
    background: #fafafa;
    font-family: var(--font-body, "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif);
    color: #09090b;
  }
  .cd-layout { display: flex; max-width: 1500px; margin: 0 auto; }

  /* ── Sidebar ── */
  .cd-sidebar {
    position: sticky; top: 0; width: 250px; flex-shrink: 0;
    height: 100vh; overflow-y: auto; padding: 24px 20px;
    border-right: 1px solid rgba(228,228,231,0.6); background: #fff;
    display: flex; flex-direction: column;
  }
  .cd-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: inherit; }
  .cd-logo-icon {
    width: 36px; height: 36px; display: grid; place-items: center;
    border-radius: 12px; background: #0f766e; color: #fff;
  }
  .cd-logo-text { font-size: 1.125rem; font-weight: 800; font-family: var(--font-display, 'Poppins', sans-serif); }
  .cd-logo-accent { color: #f97316; }

  .cd-nav { margin-top: 32px; display: flex; flex-direction: column; gap: 4px; }
  .cd-nav-item {
    display: flex; align-items: center; gap: 12px; padding: 10px 16px;
    border-radius: 100px; border: none; background: transparent; color: #71717a;
    font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
    text-align: left; font-family: inherit; text-decoration: none;
  }
  .cd-nav-item:hover { background: #f4f4f5; color: #18181b; }
  .cd-nav-active { background: #0f766e !important; color: #fff !important; }
  .cd-nav-divider { height: 1px; background: rgba(226,232,240,0.6); margin: 12px 8px; }
  .cd-nav-logout { color: #ef4444 !important; }
  .cd-nav-logout:hover { background: #fef2f2 !important; }

  .cd-sidebar-card {
    margin-top: 32px; border: 1px solid rgba(228,228,231,0.6);
    border-radius: 24px; background: #fff; padding: 16px;
  }
  .cd-sidebar-card-name { font-size: 0.875rem; font-weight: 700; color: #09090b; margin: 0; }
  .cd-sidebar-card-sub { font-size: 0.75rem; color: #71717a; margin: 4px 0 0; display: flex; align-items: center; gap: 4px; }
  .cd-add-vehicle-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    margin-top: 12px; padding: 8px 12px; border-radius: 100px;
    background: #f97316; color: #fff; font-size: 0.75rem; font-weight: 700;
    text-decoration: none; transition: background 0.2s; border: none; cursor: pointer;
  }
  .cd-add-vehicle-btn:hover { background: #ea580c; }

  /* ── Main ── */
  .cd-main { flex: 1; min-width: 0; padding: 24px 24px 40px; }
  .cd-header { display: flex; align-items: center; justify-content: space-between; }
  .cd-title {
    font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px;
    color: #09090b; margin: 0; font-family: var(--font-display, 'Poppins', sans-serif);
  }
  .cd-subtitle { font-size: 0.875rem; color: #71717a; margin: 4px 0 0; }

  /* ── Stats ── */
  .cd-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 24px; }
  .cd-stat-card {
    background: #fff; border: 1px solid rgba(228,228,231,0.6);
    border-radius: 24px; padding: 20px; transition: all 0.2s;
  }
  .cd-stat-card:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
  .cd-stat-top { display: flex; align-items: center; gap: 12px; }
  .cd-stat-icon {
    width: 40px; height: 40px; display: grid; place-items: center;
    border-radius: 16px; background: #ccfbf1; color: #0f766e; flex-shrink: 0;
  }
  .cd-stat-label { font-size: 0.75rem; color: #71717a; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .cd-stat-value { font-size: 1.25rem; font-weight: 800; margin: 12px 0 0; color: #09090b; font-family: var(--font-display, 'Poppins', sans-serif); }
  .cd-stat-delta { font-size: 0.75rem; font-weight: 600; margin: 2px 0 0; }

  /* ── Mid row ── */
  .cd-mid-row { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 24px; }
  .cd-card { background: #fff; border: 1px solid rgba(228,228,231,0.6); border-radius: 24px; padding: 20px; }
  .cd-card-head { display: flex; align-items: center; justify-content: space-between; }
  .cd-card-title { font-size: 1rem; font-weight: 700; color: #09090b; margin: 0; font-family: var(--font-display, 'Poppins', sans-serif); }
  .cd-card-desc { font-size: 0.8rem; color: #71717a; margin: 2px 0 0; }
  .cd-card-body { padding: 16px 20px; }
  .cd-monthly-badge {
    display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px;
    border-radius: 100px; background: rgba(16,185,129,0.15); color: #10b981;
    font-size: 0.75rem; font-weight: 600;
  }
  .cd-chart-wrap { width: 100%; height: 256px; margin-top: 16px; }

  /* ── Quick actions ── */
  .cd-actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
  .cd-action-btn {
    display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
    padding: 16px; border-radius: 16px; border: 1px solid rgba(228,228,231,0.6);
    background: #fafafa; cursor: pointer; transition: all 0.2s; font-family: inherit;
    text-decoration: none; color: inherit;
  }
  .cd-action-btn:hover { border-color: rgba(15,118,110,0.3); box-shadow: 0 6px 16px rgba(0,0,0,0.04); transform: translateY(-1px); }
  .cd-action-icon { color: #0f766e; }
  .cd-action-label { font-size: 0.75rem; font-weight: 700; color: #09090b; }

  .cd-payment-title { font-size: 0.875rem; font-weight: 700; margin: 24px 0 0; color: #09090b; }
  .cd-payment-list { list-style: none; padding: 0; margin: 12px 0 0; display: flex; flex-direction: column; gap: 8px; }
  .cd-payment-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 16px; }
  .cd-payment-label { color: #71717a; font-size: 0.875rem; }
  .cd-payment-value { font-weight: 700; font-size: 0.875rem; }

  /* ── Profile card ── */
  .cd-profile-card { margin-top: 24px; }
  .cd-edit-actions { display: flex; gap: 8px; }
  .cd-btn-outline {
    background: #fff; color: #09090b; border: 1px solid #e2e8f0; padding: 6px 12px;
    border-radius: 8px; font-weight: 700; font-size: 0.8rem; cursor: pointer;
    display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;
  }
  .cd-btn-outline:hover { border-color: #f97316; color: #f97316; }
  .cd-btn-primary-sm {
    background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
    color: #fff; border: none; padding: 6px 12px; border-radius: 8px;
    font-weight: 700; font-size: 0.8rem; cursor: pointer;
    display: inline-flex; align-items: center; gap: 4px;
    box-shadow: 0 2px 8px rgba(249,115,22,0.3); transition: all 0.2s;
  }
  .cd-btn-primary-sm:hover { transform: translateY(-1px); }
  .cd-btn-text {
    background: transparent; color: #64748b; border: none; padding: 6px 12px;
    font-weight: 700; font-size: 0.8rem; cursor: pointer;
  }
  .cd-btn-danger {
    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
    color: #fff; border: none; padding: 8px 20px; border-radius: 10px;
    font-weight: 700; font-size: 0.85rem; cursor: pointer;
    box-shadow: 0 2px 8px rgba(239,68,68,0.3);
  }

  .cd-edit-form { display: flex; flex-direction: column; gap: 16px; }
  .cd-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .cd-form-group { display: flex; flex-direction: column; gap: 6px; }
  .cd-form-group label { font-size: 0.75rem; font-weight: 800; color: #334155; }
  .cd-form-group input, .cd-form-group textarea {
    padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px;
    font-family: inherit; font-size: 0.9rem; color: #09090b; transition: all 0.2s;
    outline: none; width: 100%; box-sizing: border-box;
  }
  .cd-form-group input:focus, .cd-form-group textarea:focus {
    border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1);
  }

  .cd-info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
  .cd-info-item {
    display: flex; gap: 12px; align-items: center; padding: 12px;
    border-radius: 12px; background: #fafafa; border: 1px solid transparent; transition: all 0.2s;
  }
  .cd-info-item:hover { background: #fff7ed; border-color: rgba(249,115,22,0.1); transform: translateY(-1px); }
  .cd-info-full { grid-column: 1 / -1; align-items: flex-start; }
  .cd-info-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #F97316, #EA580C); color: #fff;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .cd-info-label { font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; }
  .cd-info-value { font-size: 0.9rem; font-weight: 700; color: #09090b; display: block; }
  .cd-info-desc { margin: 4px 0 0; color: #334155; line-height: 1.5; font-size: 0.85rem; }

  /* ── Fleet card ── */
  .cd-fleet-card { margin-top: 24px; }
  .cd-empty-state { text-align: center; padding: 40px 20px; }
  .cd-empty-state h3 { margin: 8px 0 4px; font-size: 1rem; }
  .cd-empty-state p { color: #71717a; font-size: 0.875rem; margin: 0; }

  .cd-table-wrap { overflow-x: auto; }
  .cd-table { width: 100%; min-width: 640px; border-collapse: collapse; font-size: 0.875rem; }
  .cd-table th {
    text-align: left; padding: 12px 20px; font-size: 0.75rem; font-weight: 800;
    color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;
    background: #f8fafc; border-bottom: 1px solid #e2e8f0;
  }
  .cd-table td { padding: 14px 20px; vertical-align: middle; border-bottom: 1px solid #f1f5f9; }
  .cd-table tbody tr:hover td { background: rgba(249,115,22,0.03); }
  .cd-cell-vehicle { display: flex; align-items: center; gap: 10px; }
  .cd-vehicle-thumb { width: 48px; height: 36px; border-radius: 8px; object-fit: cover; }
  .cd-vehicle-thumb-placeholder {
    width: 48px; height: 36px; border-radius: 8px; background: #f1f5f9;
    display: flex; align-items: center; justify-content: center; color: #94a3b8;
  }
  .cd-vehicle-name { font-weight: 600; color: #09090b; display: block; }
  .cd-vehicle-year { font-size: 0.75rem; color: #94a3b8; }
  .cd-cell-muted { color: #71717a; }
  .cd-cell-price { font-weight: 600; color: #0f766e; }
  .cd-cell-actions { display: flex; gap: 8px; justify-content: flex-end; }
  .cd-action-icon-btn {
    width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s; background: #fff;
  }
  .cd-view-btn { color: #0f766e; }
  .cd-view-btn:hover { background: #ccfbf1; border-color: #0f766e; }
  .cd-delete-btn { color: #ef4444; }
  .cd-delete-btn:hover { background: #fee2e2; border-color: #ef4444; }

  /* ── Modal ── */
  .cd-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center; z-index: 1000;
    animation: cd-fadeIn 0.2s;
  }
  .cd-modal {
    background: #fff; border-radius: 24px; padding: 32px; text-align: center;
    max-width: 400px; width: 90%; animation: cd-zoomIn 0.25s;
  }
  .cd-modal-icon {
    width: 56px; height: 56px; border-radius: 16px; background: #fee2e2; color: #ef4444;
    display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
  }
  .cd-modal h3 { margin: 0 0 8px; font-size: 1.125rem; }
  .cd-modal p { color: #71717a; font-size: 0.875rem; margin: 0 0 20px; }
  .cd-modal-actions { display: flex; gap: 12px; justify-content: center; }

  @keyframes cd-fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cd-zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .cd-sidebar { display: none; }
    .cd-stats-grid { grid-template-columns: repeat(2, 1fr); }
    .cd-mid-row { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .cd-stats-grid { grid-template-columns: 1fr; }
    .cd-main { padding: 16px 12px 80px; }
    .cd-title { font-size: 1.375rem; }
    .cd-form-row { grid-template-columns: 1fr; }
  }
`;
