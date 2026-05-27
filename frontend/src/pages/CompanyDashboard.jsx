import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Car, Edit3, Trash2, Plus, Save, X, Phone, Mail, MapPin } from 'lucide-react';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [company, setCompany] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!token || !user || user.role !== 'company') {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const [companyRes, vehiclesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/companies/me', { headers: { 'x-auth-token': token } }),
          axios.get('http://localhost:5000/api/vehicles/my', { headers: { 'x-auth-token': token } }),
        ]);
        setCompany(companyRes.data);
        setEditData(companyRes.data);
        setVehicles(vehiclesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put('http://localhost:5000/api/companies/me', editData, {
        headers: { 'x-auth-token': token },
      });
      setCompany(res.data);
      setEditMode(false);
    } catch (err) {
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (vehicleId) => {
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${vehicleId}`, {
        headers: { 'x-auth-token': token },
      });
      setVehicles(vehicles.filter(v => v._id !== vehicleId));
      setDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete vehicle.');
    }
  };

  if (loading) return (
    <div className="dash-loading"><div className="spinner"/></div>
  );

  if (!company) return (
    <div className="dash-error">
      <Building2 size={48} color="#DDD6FE"/>
      <h2>Company Profile Not Found</h2>
      <p>Your company profile could not be loaded.</p>
      <Link to="/register?role=company" className="dash-btn-primary">Register as Company</Link>
    </div>
  );

  return (
    <div className="dash-page">
      {/* Sidebar */}
      <div className="dash-layout">
        <aside className="dash-sidebar">
          <div className="sidebar-logo-wrap">
            {company.logo ? (
              <img src={company.logo} alt={company.companyName} className="sidebar-logo-img"/>
            ) : (
              <div className="sidebar-logo-placeholder"><Building2 size={28} color="#8B5CF6"/></div>
            )}
            <div>
              <div className="sidebar-company-name">{company.companyName}</div>
              <div className="sidebar-verified">✓ Verified</div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="sidebar-nav-item active"><Building2 size={16}/> Company Profile</div>
            <Link to="/list-my-car" className="sidebar-nav-item"><Plus size={16}/> Add Vehicle</Link>
            <Link to={`/companies/${company._id}`} className="sidebar-nav-item" target="_blank"><Car size={16}/> Public Page ↗</Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="dash-main">
          {/* Profile Section */}
          <section className="dash-section">
            <div className="dash-section-header">
              <h2>Company Profile</h2>
              {!editMode ? (
                <button className="dash-edit-btn" onClick={() => setEditMode(true)}><Edit3 size={15}/> Edit</button>
              ) : (
                <div className="dash-edit-actions">
                  <button className="dash-cancel-btn" onClick={() => { setEditMode(false); setEditData(company); }}><X size={15}/> Cancel</button>
                  <button className="dash-save-btn" onClick={handleSave} disabled={saving}><Save size={15}/> {saving ? 'Saving...' : 'Save'}</button>
                </div>
              )}
            </div>

            {editMode ? (
              <div className="profile-edit-grid">
                {[
                  { label: 'Company Name', key: 'companyName', type: 'text', placeholder: 'e.g. Colombo Car Rentals' },
                  { label: 'Phone', key: 'phone', type: 'text', placeholder: '+94 77 XXX XXXX' },
                  { label: 'Contact Email', key: 'contactEmail', type: 'email', placeholder: 'info@yourcompany.lk' },
                  { label: 'Address', key: 'address', type: 'text', placeholder: 'Colombo 03, Western Province' },
                  { label: 'Logo URL', key: 'logo', type: 'text', placeholder: 'https://...' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key} className="edit-field">
                    <label>{label}</label>
                    <input
                      type={type}
                      value={editData[key] || ''}
                      onChange={e => setEditData({ ...editData, [key]: e.target.value })}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
                <div className="edit-field edit-field-full">
                  <label>Description</label>
                  <textarea
                    rows={4}
                    value={editData.description || ''}
                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Tell customers about your company, specialties, and service quality..."
                  />
                </div>
              </div>
            ) : (
              <div className="profile-view-grid">
                <div className="profile-stat"><MapPin size={16}/><div><span>Address</span><strong>{company.address || '—'}</strong></div></div>
                <div className="profile-stat"><Phone size={16}/><div><span>Phone</span><strong>{company.phone || '—'}</strong></div></div>
                <div className="profile-stat"><Mail size={16}/><div><span>Email</span><strong>{company.contactEmail || '—'}</strong></div></div>
                <div className="profile-stat"><Car size={16}/><div><span>Total Fleet</span><strong>{vehicles.length} vehicles</strong></div></div>
                {company.description && (
                  <div className="profile-desc-row">
                    <p>{company.description}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Vehicles Section */}
          <section className="dash-section">
            <div className="dash-section-header">
              <h2>Your Fleet ({vehicles.length})</h2>
              <Link to="/list-my-car" className="dash-add-btn"><Plus size={15}/> Add Vehicle</Link>
            </div>
            {vehicles.length === 0 ? (
              <div className="fleet-empty-dash">
                <Car size={40} color="#DDD6FE"/>
                <p>No vehicles listed yet.</p>
                <Link to="/list-my-car" className="dash-btn-primary">List Your First Vehicle</Link>
              </div>
            ) : (
              <div className="fleet-table">
                {vehicles.map(v => (
                  <div key={v._id} className="fleet-table-row">
                    <div className="fleet-row-img">
                      {v.images && v.images[0] ? (
                        <img src={v.images[0]} alt={v.brand}/>
                      ) : (
                        <div className="fleet-img-placeholder"><Car size={18} color="#9CA3AF"/></div>
                      )}
                    </div>
                    <div className="fleet-row-info">
                      <strong>{v.brand} {v.model} ({v.year})</strong>
                      <span><MapPin size={12}/> {v.location}</span>
                    </div>
                    <div className="fleet-row-price">LKR {v.pricePerDay?.toLocaleString()}/day</div>
                    <div className="fleet-row-actions">
                      <Link to={`/vehicle/${v._id}`} className="fleet-action-view">View</Link>
                      <button
                        className="fleet-action-delete"
                        onClick={() => setDeleteConfirm(v._id)}
                      ><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Delete Vehicle?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="modal-confirm" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dash-page { min-height: 100vh; font-family: 'Inter', sans-serif; background: #FAFAFA; }
        .dash-loading { min-height: 60vh; display: flex; align-items: center; justify-content: center; }
        .dash-error { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; text-align: center; padding: 2rem; }
        .dash-error h2 { font-size: 1.5rem; font-weight: 800; color: #1F2937; }
        .dash-error p { color: #6B7280; }

        .spinner { width:40px; height:40px; border: 3px solid #EDE9FE; border-top-color: #7C3AED; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .dash-layout { display: flex; min-height: calc(100vh - 80px); }

        .dash-sidebar {
          width: 260px; flex-shrink: 0;
          background: white; border-right: 1px solid #F1F5F9;
          padding: 2rem 1.5rem; display: flex; flex-direction: column; gap: 2rem;
          position: sticky; top: 80px; height: calc(100vh - 80px); overflow-y: auto;
        }

        .sidebar-logo-wrap { display: flex; align-items: center; gap: 12px; }
        .sidebar-logo-img { width: 50px; height: 50px; border-radius: 12px; object-fit: cover; }
        .sidebar-logo-placeholder { width: 50px; height: 50px; border-radius: 12px; background: #EDE9FE; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .sidebar-company-name { font-size: 0.95rem; font-weight: 800; color: #111827; }
        .sidebar-verified { font-size: 0.72rem; color: #16A34A; font-weight: 700; }

        .sidebar-nav { display: flex; flex-direction: column; gap: 4px; }
        .sidebar-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px;
          font-size: 0.9rem; font-weight: 600; color: #6B7280;
          text-decoration: none; cursor: pointer; transition: all 0.2s;
        }
        .sidebar-nav-item:hover, .sidebar-nav-item.active { background: #EDE9FE; color: #7C3AED; }

        .dash-main { flex: 1; padding: 2.5rem 2rem; max-width: 900px; }

        .dash-section {
          background: white; border-radius: 1.5rem;
          border: 1px solid #F1F5F9;
          padding: 2rem; margin-bottom: 1.5rem;
        }

        .dash-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .dash-section-header h2 { font-size: 1.2rem; font-weight: 800; color: #1F2937; }

        .dash-edit-btn {
          display: flex; align-items: center; gap: 6px;
          background: #EDE9FE; color: #7C3AED;
          border: none; border-radius: 100px; padding: 0.5rem 1.2rem;
          font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: background 0.2s;
        }
        .dash-edit-btn:hover { background: #DDD6FE; }

        .dash-edit-actions { display: flex; gap: 8px; }
        .dash-cancel-btn { display: flex; align-items: center; gap: 6px; background: #F3F4F6; color: #6B7280; border: none; border-radius: 100px; padding: 0.5rem 1.2rem; font-weight: 700; font-size: 0.85rem; cursor: pointer; }
        .dash-save-btn { display: flex; align-items: center; gap: 6px; background: #7C3AED; color: white; border: none; border-radius: 100px; padding: 0.5rem 1.2rem; font-weight: 700; font-size: 0.85rem; cursor: pointer; }
        .dash-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .profile-edit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .edit-field { display: flex; flex-direction: column; gap: 6px; }
        .edit-field-full { grid-column: 1 / -1; }
        .edit-field label { font-size: 0.75rem; font-weight: 800; color: #9CA3AF; letter-spacing: 0.05em; }
        .edit-field input, .edit-field textarea {
          padding: 10px 14px; border: 1.5px solid #E5E7EB; border-radius: 10px;
          font-size: 0.9rem; background: #F9FAFB; outline: none; transition: border-color 0.2s; font-family: inherit;
        }
        .edit-field input:focus, .edit-field textarea:focus { border-color: #7C3AED; background: white; }
        .edit-field textarea { resize: vertical; }

        .profile-view-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem; }
        .profile-stat { display: flex; align-items: flex-start; gap: 10px; }
        .profile-stat svg { color: #8B5CF6; margin-top: 2px; flex-shrink: 0; }
        .profile-stat div { display: flex; flex-direction: column; }
        .profile-stat span { font-size: 0.72rem; color: #9CA3AF; font-weight: 700; text-transform: uppercase; }
        .profile-stat strong { font-size: 0.9rem; color: #1F2937; font-weight: 700; }

        .profile-desc-row { grid-column: 1 / -1; background: #F9FAFB; border-radius: 10px; padding: 1rem; }
        .profile-desc-row p { color: #374151; font-size: 0.9rem; line-height: 1.6; margin: 0; }

        .dash-add-btn { display: flex; align-items: center; gap: 6px; background: #7C3AED; color: white; padding: 0.5rem 1.2rem; border-radius: 100px; font-weight: 700; font-size: 0.85rem; text-decoration: none; transition: background 0.2s; }
        .dash-add-btn:hover { background: #6D28D9; }
        .dash-btn-primary { display: inline-flex; align-items: center; gap: 6px; background: #7C3AED; color: white; padding: 0.75rem 2rem; border-radius: 100px; font-weight: 700; text-decoration: none; transition: background 0.2s; border: none; cursor: pointer; }
        .dash-btn-primary:hover { background: #6D28D9; }

        .fleet-empty-dash { text-align: center; padding: 3rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: #9CA3AF; }

        .fleet-table { display: flex; flex-direction: column; gap: 0.75rem; }
        .fleet-table-row {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem; border-radius: 12px;
          border: 1px solid #F1F5F9; background: #FAFAFA;
          transition: background 0.2s;
        }
        .fleet-table-row:hover { background: #F5F3FF; }

        .fleet-row-img { width: 70px; height: 52px; border-radius: 10px; overflow: hidden; flex-shrink: 0; }
        .fleet-row-img img { width: 100%; height: 100%; object-fit: cover; }
        .fleet-img-placeholder { width: 70px; height: 52px; border-radius: 10px; background: #EDE9FE; display: flex; align-items: center; justify-content: center; }

        .fleet-row-info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
        .fleet-row-info strong { font-size: 0.9rem; font-weight: 800; color: #1F2937; }
        .fleet-row-info span { display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; color: #9CA3AF; }

        .fleet-row-price { font-weight: 800; color: #7C3AED; font-size: 0.9rem; white-space: nowrap; }

        .fleet-row-actions { display: flex; align-items: center; gap: 8px; }
        .fleet-action-view { background: #EDE9FE; color: #6D28D9; padding: 5px 14px; border-radius: 100px; font-size: 0.8rem; font-weight: 700; text-decoration: none; transition: background 0.2s; }
        .fleet-action-view:hover { background: #DDD6FE; }
        .fleet-action-delete { background: #FEF2F2; color: #DC2626; border: none; border-radius: 100px; padding: 6px 10px; cursor: pointer; display: flex; align-items: center; transition: background 0.2s; }
        .fleet-action-delete:hover { background: #FEE2E2; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 999; backdrop-filter: blur(4px); }
        .modal-box { background: white; border-radius: 1.5rem; padding: 2rem; max-width: 360px; width: 90%; text-align: center; }
        .modal-box h3 { font-size: 1.2rem; font-weight: 800; color: #111827; margin-bottom: 0.5rem; }
        .modal-box p { color: #6B7280; font-size: 0.9rem; margin-bottom: 1.5rem; }
        .modal-actions { display: flex; gap: 12px; justify-content: center; }
        .modal-cancel { background: #F3F4F6; color: #374151; border: none; padding: 0.6rem 1.5rem; border-radius: 100px; font-weight: 700; cursor: pointer; }
        .modal-confirm { background: #DC2626; color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 100px; font-weight: 700; cursor: pointer; }
        .modal-confirm:hover { background: #B91C1C; }

        @media (max-width: 768px) {
          .dash-layout { flex-direction: column; }
          .dash-sidebar { width: 100%; height: auto; position: static; border-right: none; border-bottom: 1px solid #F1F5F9; }
          .profile-edit-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default CompanyDashboard;
