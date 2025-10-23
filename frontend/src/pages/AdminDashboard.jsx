﻿import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import API_BASE_URL from "../config/api";

import UserGrowthChart from "./userGrowthChart";
import RevenueChart from "./RevenueChart";

export default function AdminDashboard() {
  const [data, setData] = useState({ users: [], total: 0, page: 1, pages: 1 });
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Profile admini
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");

  const fetchUsers = async (page = 1, searchTerm = "", role = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = { page, limit: 10 };
      if (searchTerm) params.search = searchTerm;
      if (role) params.role = role;

      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      setError("â›”ï¸ Nuk mund tÃ« merren pÃ«rdoruesit.");
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const statsRes = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(statsRes.data);
    } catch {
      setError("â›”ï¸ Nuk mund tÃ« merren statistikat.");
    }
  };

  // Merr profilin e adminit aktual
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setProfileName(res.data.name);
      setProfileEmail(res.data.email);
    } catch {
      setError("â›”ï¸ Nuk mund tÃ« merret profili.");
    }
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/admin/profile`,
        { name: profileName, email: profileEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingProfile(false);
      fetchProfile();
      alert("âœ… Profili u pÃ«rditÃ«sua me sukses!");
    } catch {
      alert("âŒ Gabim gjatÃ« pÃ«rditÃ«simit tÃ« profilit.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchUsers(1, search, roleFilter);
  }, [search, roleFilter]);

  const handleVerify = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/admin/verify/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u._id === id ? { ...u, isVerified: true } : u)),
      }));
    } catch {
      alert("âŒ Verifikimi dÃ«shtoi");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt qÃ« dÃ«shiron ta fshish kÃ«tÃ« pÃ«rdorues?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u._id !== id),
      }));
    } catch {
      alert("âŒ Fshirja dÃ«shtoi");
    }
  };

  if (loading) return <div className="container py-4">Duke ngarkuar...</div>;
  if (error) return <div className="container py-4 alert alert-danger">{error}</div>;

  return (
    <div className="container py-4" style={{ backgroundColor: "#FAF7F3", minHeight: "100vh" }}>
      <h2 className="mb-4" style={{ color: "#D9A299" }}>ðŸ“‹ Paneli i Adminit</h2>

      {/* --- Settings/Profile Section --- */}
      <section className="mb-4 p-3 border rounded" style={{ 
        background: "linear-gradient(145deg, #FAF7F3, #F0E4D3)",
        border: "1px solid rgba(220, 197, 178, 0.3)",
        borderRadius: "15px",
        boxShadow: "0 4px 15px rgba(217, 162, 153, 0.1)"
      }}>
        <h4 style={{ color: "#D9A299" }}>ðŸ‘¤ Profili im</h4>
        {!profile ? (
          <p>Duke ngarkuar profilin...</p>
        ) : editingProfile ? (
          <>
            <div className="mb-3">
              <label className="form-label">Emri</label>
              <input
                type="text"
                className="form-control"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                disabled
              />
              <small className="text-muted">Email nuk mund tÃ« ndryshohet.</small>
            </div>
            <button className="btn btn-success me-2" onClick={updateProfile}>
              Ruaj Ndryshimet
            </button>
            <button className="btn btn-secondary" onClick={() => setEditingProfile(false)}>
              Anulo
            </button>
          </>
        ) : (
          <>
            <p>
              <strong>Emri:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Roli:</strong> {profile.role}
            </p>
            <button className="btn btn-primary me-2" onClick={() => setEditingProfile(true)}>
              Edito Profilin
            </button>
            <button className="btn btn-danger" onClick={logout}>
              Dil
            </button>
          </>
        )}
      </section>

      {/* Statistikat */}
      <div className="d-flex gap-3 mb-4 flex-wrap">
        <div className="card p-3 flex-grow-1" style={{ 
          minWidth: "180px",
          background: "linear-gradient(135deg, #D9A299, #DCC5B2)",
          color: "white",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(217, 162, 153, 0.3)"
        }}>
          <h5>PÃ«rdorues Total</h5>
          <p className="fs-3">{stats?.totalUsers || 0}</p>
        </div>
        <div className="card p-3 flex-grow-1" style={{ 
          minWidth: "180px",
          background: "linear-gradient(135deg, #DCC5B2, #F0E4D3)",
          color: "#2c3e50",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(217, 162, 153, 0.3)"
        }}>
          <h5>TÃ« Verifikuar</h5>
          <p className="fs-3">{stats?.verifiedUsers || 0}</p>
        </div>
        <div className="card p-3 flex-grow-1" style={{ 
          minWidth: "180px",
          background: "linear-gradient(135deg, #F0E4D3, #FAF7F3)",
          color: "#2c3e50",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(217, 162, 153, 0.3)"
        }}>
          <h5>TÃ« Pa Verifikuar</h5>
          <p className="fs-3">{stats?.unverifiedUsers || 0}</p>
        </div>
        <div className="card p-3 flex-grow-1" style={{ 
          minWidth: "180px",
          background: "linear-gradient(135deg, #D9A299, #DCC5B2)",
          color: "white",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(217, 162, 153, 0.3)"
        }}>
          <h5>TÃ« Ardhurat</h5>
          <p className="fs-3">${stats?.totalRevenue?.toFixed(2) || "0.00"}</p>
        </div>
      </div>

      {/* Filterat */}
      <div className="mb-3 d-flex gap-2 align-items-center">
        <input
          type="text"
          placeholder="KÃ«rko emÃ«r ose email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control"
          style={{ maxWidth: 300 }}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="form-select"
          style={{ maxWidth: 200 }}
        >
          <option value="">TÃ« gjitha rolet</option>
          <option value="admin">Admin</option>
          <option value="clinic">KlinikÃ«</option>
          <option value="user">PÃ«rdorues</option>
        </select>
      </div>

      {/* Tabela me pÃ«rdoruesit */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Emri</th>
            <th>Email</th>
            <th>Roli</th>
            <th>Verifikuar</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email || "-"}</td>
              <td>{u.role}</td>
              <td>
                {u.isVerified ? (
                  "âœ”ï¸"
                ) : (
                  <button
                    onClick={() => handleVerify(u._id)}
                    className="btn btn-sm btn-outline-success"
                  >
                    Verifiko
                  </button>
                )}
              </td>
              <td>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="btn btn-sm btn-outline-danger"
                >
                  Fshi
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
            <li key={p} className={`page-item ${p === data.page ? "active" : ""}`}>
              <button className="page-link" onClick={() => fetchUsers(p, search, roleFilter)}>
                {p}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Grafiqet */}
      <div className="my-4">
        <h4>ðŸ“ˆ Rritja e PÃ«rdoruesve</h4>
        <UserGrowthChart />
      </div>

      <div className="my-4">
        <h4>ðŸ’° TÃ« Ardhurat Mujore</h4>
        <RevenueChart />
      </div>
    </div>
  );
}
