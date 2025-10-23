﻿import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorHomeButton from "../../components/DoctorHomeButton";

export default function DoctorAppointmentsManager() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, completed, canceled
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${API_BASE_URL}/api/appointments/mine`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setAppointments(response.data);
    } catch (err) {
      console.error("Gabim nÃ« marrjen e takimeve:", err);
      setError("Nuk u morÃ«n takimet. " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      console.log("ðŸ“ Changing status:", { appointmentId, newStatus });
      const token = localStorage.getItem("token");
      
      const requestData = { status: newStatus };
      console.log("ðŸ“¤ Request data:", requestData);
      
      await axios.put(
       ` ${API_BASE_URL}/api/appointments/${appointmentId}/status`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // PÃ«rditÃ«so listÃ«n lokale
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId 
            ? { ...apt, status: newStatus }
            : apt
        )
      );
      
      alert(`âœ… Statusi i takimit u ndryshua nÃ« "${newStatus}"`);
    } catch (err) {
      console.error("Gabim nÃ« ndryshimin e statusit:", err);
      alert("âŒ Gabim nÃ« ndryshimin e statusit: " + (err.response?.data?.message || err.message));
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: "bg-warning text-dark", text: "â³ NÃ« pritje" },
      approved: { class: "bg-success", text: "âœ… Aprovuar" },
      completed: { class: "bg-primary", text: "âœ… PÃ«rfunduar" },
      canceled: { class: "bg-danger", text: "âŒ Anuluar" }
    };
    
    const statusInfo = statusMap[status] || { class: "bg-secondary", text: status };
    return (
      <span className={`badge ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('sq-AL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter !== 'all' && apt.status !== filter) return false;
    if (selectedDate && apt.date !== selectedDate) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Duke u ngarkuar...</span>
          </div>
          <p className="mt-3">Duke ngarkuar takimet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ 
      backgroundColor: "#FAF7F3", 
      minHeight: "100vh", 
      padding: "2rem 0",
      background: "linear-gradient(135deg, #FAF7F3 0%, #F0E4D3 50%, #DCC5B2 100%)"
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="card shadow-lg" style={{
              background: "linear-gradient(145deg, #FAF7F3, #F0E4D3)",
              border: "1px solid rgba(220, 197, 178, 0.3)",
              borderRadius: "25px",
              boxShadow: "0 20px 40px rgba(217, 162, 153, 0.3)",
              overflow: "hidden"
            }}>
              <div className="card-header text-center py-4" style={{
                background: "linear-gradient(135deg, #D9A299, #DCC5B2)",
                color: "white",
                border: "none"
              }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="card-title mb-0" style={{ fontSize: "2.5rem", fontWeight: "bold", color:"white" }}>
                    ðŸ“‹ Menaxhimi i Takimeve
                  </h2>
                  <button 
                    className="btn btn-outline-light btn-lg"
                    onClick={() => window.location.href = '/doctor/profile'}
                    style={{
                      borderRadius: "12px",
                      padding: "0.75rem 1.5rem",
                      fontSize: "1rem",
                      fontWeight: "bold"
                    }}
                  >
                    â† Kthehu nÃ« Profil
                  </button>
                </div>
                <p className="mt-2 mb-0" style={{ fontSize: "1.1rem", opacity: "0.9" }}>
                  Menaxhoni tÃ« gjitha takimet e pacientÃ«ve tuaj
                </p>
              </div>
              <div className="card-body p-5">

                {error && (
                  <div className="alert mb-4" style={{
                    background: "linear-gradient(145deg, #DCC5B2, #D9A299)",
                    border: "1px solid rgba(220, 197, 178, 0.3)",
                    borderRadius: "15px",
                    color: "white",
                    fontSize: "1.1rem"
                  }}>
                    <strong>âŒ Gabim:</strong> {error}
                    <button 
                      className="btn btn-sm ms-2"
                      onClick={fetchAppointments}
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        color: "white",
                        borderRadius: "8px"
                      }}
                    >
                      ðŸ”„ Provo PÃ«rsÃ«ri
                    </button>
                  </div>
                )}

                {/* Filtrat */}
                <div className="card mb-4" style={{
                  background: "linear-gradient(145deg, #FAF7F3, #F0E4D3)",
                  border: "1px solid rgba(220, 197, 178, 0.3)",
                  borderRadius: "20px",
                  boxShadow: "0 8px 25px rgba(217, 162, 153, 0.2)"
                }}>
                  <div className="card-body p-4">
                    <div className="row align-items-end">
                      <div className="col-md-6">
                        <label className="form-label fw-bold" style={{ color: "#D9A299", fontSize: "1.1rem" }}>Filtro sipas statusit:</label>
                        <select 
                          className="form-select form-select-lg"
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          style={{
                            border: "2px solid rgba(220, 197, 178, 0.3)",
                            borderRadius: "12px"
                          }}
                        >
                          <option value="all">ðŸ” TÃ« gjitha takimet</option>
                          <option value="pending">â³ NÃ« pritje</option>
                          <option value="approved">âœ… Aprovuar</option>
                          <option value="completed">âœ… PÃ«rfunduar</option>
                          <option value="canceled">âŒ Anuluar</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold" style={{ color: "#D9A299", fontSize: "1.1rem" }}>Filtro sipas datÃ«s:</label>
                        <input
                          type="date"
                          className="form-control form-control-lg"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          style={{
                            border: "2px solid rgba(220, 197, 178, 0.3)",
                            borderRadius: "12px"
                          }}
                        />
                      </div>
                      <div className="col-md-2">
                        <button
                          className="btn btn-lg w-100"
                          onClick={() => {
                            setFilter('all');
                            setSelectedDate('');
                          }}
                          style={{
                            background: "linear-gradient(135deg, #DCC5B2, #D9A299)",
                            border: "none",
                            color: "white",
                            borderRadius: "12px",
                            boxShadow: "0 4px 15px rgba(217, 162, 153, 0.3)"
                          }}
                        >
                          ðŸ—‘ï¸ Pastro
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lista e takimeve */}
                <div className="card" style={{
                  background: "linear-gradient(145deg, #FAF7F3, #F0E4D3)",
                  border: "1px solid rgba(220, 197, 178, 0.3)",
                  borderRadius: "20px",
                  boxShadow: "0 8px 25px rgba(217, 162, 153, 0.2)"
                }}>
                  <div className="card-header d-flex justify-content-between align-items-center" style={{
                    background: "linear-gradient(135deg, #D9A299, #DCC5B2)",
                    color: "white",
                    border: "none",
                    borderRadius: "20px 20px 0 0"
                  }}>
                    <h5 className="mb-0" style={{ fontSize: "1.3rem" }}>Lista e Takimeve</h5>
                    <span className="badge" style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      borderRadius: "8px",
                      padding: "0.5rem 1rem",
                      fontSize: "1rem"
                    }}>
                      {filteredAppointments.length} takime
                    </span>
                  </div>
                  <div className="card-body p-0">
                    {filteredAppointments.length === 0 ? (
                      <div className="text-center py-5">
                        <p className="text-muted mb-3" style={{ fontSize: "1.1rem" }}>ðŸ“­ Nuk ka takime pÃ«r t'i shfaqur</p>
                        <button 
                          className="btn btn-lg"
                          onClick={fetchAppointments}
                          style={{
                            background: "linear-gradient(135deg, #D9A299, #DCC5B2)",
                            border: "none",
                            color: "white",
                            borderRadius: "12px",
                            boxShadow: "0 4px 15px rgba(217, 162, 153, 0.3)"
                          }}
                        >
                          ðŸ”„ Rifresko
                        </button>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover mb-0" style={{
                          background: "linear-gradient(145deg, #FAF7F3, #F0E4D3)",
                          borderRadius: "0 0 20px 20px"
                        }}>
                          <thead style={{
                            background: "linear-gradient(135deg, #D9A299, #DCC5B2)",
                            color: "white"
                          }}>
                            <tr>
                              <th style={{ padding: "1rem", fontSize: "1.1rem" }}>ðŸ‘¤ Pacienti</th>
                              <th style={{ padding: "1rem", fontSize: "1.1rem" }}>ðŸ“… Data</th>
                              <th style={{ padding: "1rem", fontSize: "1.1rem" }}>ðŸ• Koha</th>
                              <th style={{ padding: "1rem", fontSize: "1.1rem" }}>ðŸ¥ ShÃ«rbimi</th>
                              <th style={{ padding: "1rem", fontSize: "1.1rem" }}>ðŸ“Š Statusi</th>
                              <th style={{ padding: "1rem", fontSize: "1.1rem" }}>âš™ï¸ Veprime</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAppointments.map(appointment => (
                              <tr key={appointment._id} style={{ fontSize: "1rem" }}>
                                <td style={{ padding: "1rem" }}>
                                  <div>
                                    <strong style={{ color: "#D9A299" }}>{appointment.patientId?.name || 'N/A'}</strong>
                                    <br />
                                    <small className="text-muted">
                                      {appointment.patientId?.email || 'N/A'}
                                    </small>
                                  </div>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                  <strong>{appointment.date}</strong>
                                  <br />
                                  <small className="text-muted">
                                    {formatDate(appointment.date)}
                                  </small>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                  <strong>{appointment.time}</strong>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                  {appointment.serviceId?.name || 'Konsultim i pÃ«rgjithshÃ«m'}
                                </td>
                                <td style={{ padding: "1rem" }}>
                                  {getStatusBadge(appointment.status)}
                                </td>
                                <td style={{ padding: "1rem" }}>
                                  <div className="btn-group btn-group-sm">
                                    {appointment.status === 'pending' && (
                                      <>
                                        <button
                                          className="btn btn-sm"
                                          onClick={() => handleStatusChange(appointment._id, 'approved')}
                                          title="Aprovo takimin"
                                          style={{
                                            background: "linear-gradient(135deg, #D9A299, #DCC5B2)",
                                            border: "none",
                                            color: "white",
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 15px rgba(217, 162, 153, 0.3)"
                                          }}
                                        >
                                          âœ…
                                        </button>
                                        <button
                                          className="btn btn-sm"
                                          onClick={() => handleStatusChange(appointment._id, 'canceled')}
                                          title="Anulo takimin"
                                          style={{
                                            background: "linear-gradient(135deg, #DCC5B2, #D9A299)",
                                            border: "none",
                                            color: "white",
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 15px rgba(217, 162, 153, 0.3)"
                                          }}
                                        >
                                          âŒ
                                        </button>
                                      </>
                                    )}
                                    {appointment.status === 'approved' && (
                                      <button
                                        className="btn btn-sm"
                                        onClick={() => handleStatusChange(appointment._id, 'completed')}
                                        title="ShÃ«no si tÃ« pÃ«rfunduar"
                                        style={{
                                          background: "linear-gradient(135deg, #D9A299, #DCC5B2)",
                                          border: "none",
                                          color: "white",
                                          borderRadius: "8px",
                                          boxShadow: "0 4px 15px rgba(217, 162, 153, 0.3)"
                                        }}
                                      >
                                        âœ… PÃ«rfundo
                                      </button>
                                    )}
                                    {appointment.status === 'completed' && (
                                      <span className="text-success small">
                                        âœ… E pÃ«rfunduar
                                      </span>
                                    )}
                                    {appointment.status === 'canceled' && (
                                      <span className="text-muted small">
                                        âŒ E anuluar
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Statistika */}
                <div className="row mt-4">
                  <div className="col-md-3">
                    <div className="card" style={{
                      background: "linear-gradient(135deg, #F0E4D3, #DCC5B2)",
                      border: "1px solid rgba(220, 197, 178, 0.3)",
                      borderRadius: "15px",
                      boxShadow: "0 8px 25px rgba(217, 162, 153, 0.2)"
                    }}>
                      <div className="card-body text-center">
                        <h4 style={{ color: "#D9A299", fontSize: "2rem" }}>{appointments.filter(a => a.status === 'pending').length}</h4>
                        <small style={{ color: "#2c3e50", fontSize: "1rem" }}>NÃ« pritje</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card" style={{
                      background: "linear-gradient(135deg, #D9A299, #DCC5B2)",
                      border: "1px solid rgba(220, 197, 178, 0.3)",
                      borderRadius: "15px",
                      boxShadow: "0 8px 25px rgba(217, 162, 153, 0.2)"
                    }}>
                      <div className="card-body text-center">
                        <h4 style={{ color: "white", fontSize: "2rem" }}>{appointments.filter(a => a.status === 'approved').length}</h4>
                        <small style={{ color: "white", fontSize: "1rem" }}>Aprovuar</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card" style={{
                      background: "linear-gradient(135deg, #DCC5B2, #F0E4D3)",
                      border: "1px solid rgba(220, 197, 178, 0.3)",
                      borderRadius: "15px",
                      boxShadow: "0 8px 25px rgba(217, 162, 153, 0.2)"
                    }}>
                      <div className="card-body text-center">
                        <h4 style={{ color: "#D9A299", fontSize: "2rem" }}>{appointments.filter(a => a.status === 'completed').length}</h4>
                        <small style={{ color: "#2c3e50", fontSize: "1rem" }}>PÃ«rfunduar</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card" style={{
                      background: "linear-gradient(135deg, #DCC5B2, #D9A299)",
                      border: "1px solid rgba(220, 197, 178, 0.3)",
                      borderRadius: "15px",
                      boxShadow: "0 8px 25px rgba(217, 162, 153, 0.2)"
                    }}>
                      <div className="card-body text-center">
                        <h4 style={{ color: "white", fontSize: "2rem" }}>{appointments.filter(a => a.status === 'canceled').length}</h4>
                        <small style={{ color: "white", fontSize: "1rem" }}>Anuluar</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DoctorHomeButton />
    </div>
  );
}