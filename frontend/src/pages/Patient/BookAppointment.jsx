﻿import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import MobileNavbar from "../../components/MobileNavbar";
import PatientHomeButton from "../../components/PatientHomeButton";

export default function BookAppointment() {
  const [form, setForm] = useState({
    doctorId: "",
    serviceId: "",
    date: "",
    time: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [workingHours, setWorkingHours] = useState(null);
  const [takenTimes, setTakenTimes] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingServices, setLoadingServices] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/doctors/public`);
        setDoctors(res.data);
      } catch (err) {
        console.error("âŒ Gabim nÃ« marrjen e mjekÃ«ve:", err);
      }
    };
    fetchDoctors();
  }, []);

  const fetchServicesAndHours = async (doctorId) => {
    setLoadingServices(true);
    try {
      const [servicesRes, hoursRes] = await Promise.all([
        axios.get`(${API_BASE_URL}/api/doctors/${doctorId}/services`), // VetÃ«m shÃ«rbimet e doktorit
        axios.get`(${API_BASE_URL}/api/working-hours/${doctorId}`),
      ]);
      setServices(servicesRes.data);
      setWorkingHours(hoursRes.data);
    } catch (err) {
      console.error("âŒ Gabim nÃ« marrjen e shÃ«rbimeve ose orarit:", err);
      setServices([]);
      setWorkingHours(null);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchTakenTimes = async (doctorId, date) => {
    try {
      const res = await axios.get(
       ` ${API_BASE_URL}/api/appointments/taken?doctorId=${doctorId}&date=${date}`
      );
      setTakenTimes(res.data);
    } catch (err) {
      console.error("âŒ Gabim nÃ« kontrollin e orÃ«ve tÃ« zÃ«na:", err);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "doctorId") {
      await fetchServicesAndHours(value);
      setForm((prev) => ({ ...prev, serviceId: "", date: "", time: "" }));
    }

    if (name === "date" && form.doctorId) {
      await fetchTakenTimes(form.doctorId, value);
      setForm((prev) => ({ ...prev, time: "" }));
    }
  };

  const currentDaySchedule = () => {
    if (!form.date || !workingHours) return null;
    const weekday = new Date(form.date).toLocaleDateString("en-US", {
      weekday: "long",
    }).toLowerCase();
    return workingHours[weekday] || null;
  };

  const isTimeAvailable = (time) => !takenTimes.includes(time);

  const timeOptions = () => {
    const schedule = currentDaySchedule();
    if (!schedule || !schedule.start || !schedule.end) return [];

    const [startH, startM] = schedule.start.split(":").map(Number);
    const [endH, endM] = schedule.end.split(":").map(Number);

    const times = [];
    let current = new Date(0, 0, 0, startH, startM);
    const end = new Date(0, 0, 0, endH, endM);

    while (current < end) {
      const hh = current.getHours().toString().padStart(2, "0");
      const mm = current.getMinutes().toString().padStart(2, "0");
      const time = `${hh}:${mm}`;
      if (isTimeAvailable(time)) times.push(time);
      current.setMinutes(current.getMinutes() + 30);
    }

    return times;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setSuccessMessage("");

    // â›” Kontroll nÃ«se mjeku nuk punon atÃ« ditÃ«
    if (!currentDaySchedule()) {
      setSuccessMessage("âŒ Mjeku nuk punon kÃ«tÃ« ditÃ«. Ju lutemi zgjidhni njÃ« ditÃ« tjetÃ«r.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/appointments`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("âœ… Termini u regjistrua me sukses!");
      setTimeout(() => {
        navigate("/patient");
      }, 1500);
    } catch (err) {
      if (err.response?.status === 409) {
        setSuccessMessage("âŒ Ky orar Ã«shtÃ« i zÃ«nÃ« pÃ«r kÃ«tÃ« mjek.");
      } else if (err.response?.data?.message) {
        setSuccessMessage("âŒ " + err.response.data.message);
      } else {
        setSuccessMessage("âŒ Gabim gjatÃ« rezervimit.");
      }
      console.error(err);
    }
  };

  return (
    <div className="container-fluid" style={{
      backgroundColor: "#FAF7F3",
      minHeight: "100vh",
      padding: "1rem 0",
      background: "linear-gradient(135deg, #FAF7F3 0%, #F0E4D3 50%, #DCC5B2 100%)"
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="card shadow-lg" style={{
              background: "linear-gradient(145deg, #FAF7F3, #F0E4D3)",
              border: "1px solid rgba(220, 197, 178, 0.3)",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(217, 162, 153, 0.3)",
              overflow: "hidden"
            }}>
              <div className="card-header text-center py-3" style={{
                background: "linear-gradient(135deg, #D9A299, #DCC5B2)",
                color: "white",
                border: "none"
              }}>
                <h2 className="card-title mb-0" style={{ fontSize: "1.75rem", fontWeight: "bold", color: "white" }}>
                  ðŸ“… Rezervo Terminin
                </h2>
                <p className="mt-2 mb-0 small d-none d-md-block" style={{ opacity: "0.9", color: "white" }}>
                  Zgjidhni mjekun dhe orarin qÃ« ju pÃ«rshtatet
                </p>
              </div>
              <div className="card-body p-3 p-md-4">

                {successMessage && (
                  <div
                    className="alert mb-3"
                    role="alert"
                    style={{
                      background: successMessage.startsWith("âœ…") 
                        ? "linear-gradient(145deg, #F0E4D3, #DCC5B2)" 
                        : "linear-gradient(145deg, #DCC5B2, #D9A299)",
                      border: "1px solid rgba(220, 197, 178, 0.3)",
                      borderRadius: "8px",
                      color: "#2c3e50",
                      fontSize: "0.95rem",
                      fontWeight: "500"
                    }}
                  >
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="d-grid gap-3">
                  <div className="form-group">
                    <label className="form-label fw-bold mb-2" style={{ color: "#D9A299", fontSize: "1rem" }}>
                      ðŸ‘¨â€âš•ï¸ Zgjedh Mjekun
                    </label>
                    <select
                      name="doctorId"
                      value={form.doctorId}
                      onChange={handleChange}
                      className="form-select"
                      required
                      style={{
                        border: "2px solid rgba(220, 197, 178, 0.3)",
                        borderRadius: "8px",
                        padding: "0.75rem",
                        fontSize: "16px",
                        minHeight: "48px"
                      }}
                    >
                      <option value="">Zgjedh Mjekun</option>
                      {doctors.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label fw-bold mb-2" style={{ color: "#D9A299", fontSize: "1rem" }}>
                      ðŸ¥ Zgjedh ShÃ«rbimin
                    </label>
                    <select
                      name="serviceId"
                      value={form.serviceId}
                      onChange={handleChange}
                      className="form-select"
                      required
                      disabled={!services.length}
                      style={{
                        border: "2px solid rgba(220, 197, 178, 0.3)",
                        borderRadius: "8px",
                        padding: "0.75rem",
                        fontSize: "16px",
                        minHeight: "48px"
                      }}
                    >
                      <option value="">Zgjedh ShÃ«rbimin</option>
                      {services.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} â€“ {s.price}â‚¬
                        </option>
                      ))}
                    </select>
                  </div>

                  {!loadingServices && services.length === 0 && form.doctorId && (
                    <div className="alert alert-warning" style={{
                      background: "linear-gradient(145deg, #F0E4D3, #DCC5B2)",
                      border: "1px solid rgba(220, 197, 178, 0.3)",
                      borderRadius: "8px",
                      color: "#2c3e50",
                      fontSize: "0.9rem"
                    }}>
                      âš ï¸ Ky mjek nuk ka shÃ«rbime tÃ« disponueshme.
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label fw-bold mb-2" style={{ color: "#D9A299", fontSize: "1rem" }}>
                      ðŸ“… Zgjedh DatÃ«n
                    </label>
                    <input
                      name="date"
                      type="date"
                      className="form-control"
                      value={form.date}
                      onChange={handleChange}
                      required
                      disabled={!form.doctorId}
                      min={new Date().toISOString().split("T")[0]}
                      style={{
                        border: "2px solid rgba(220, 197, 178, 0.3)",
                        borderRadius: "8px",
                        padding: "0.75rem",
                        fontSize: "16px",
                        minHeight: "48px"
                      }}
                    />
                  </div>

                  {form.date && (
                    currentDaySchedule() ? (
                      <div className="alert alert-info" style={{
                        background: "linear-gradient(145deg, #F0E4D3, #DCC5B2)",
                        border: "1px solid rgba(220, 197, 178, 0.3)",
                        borderRadius: "12px",
                        color: "#2c3e50"
                      }}>
                        ðŸ•’ Orari pÃ«r kÃ«tÃ« ditÃ«: {currentDaySchedule().start} - {currentDaySchedule().end}
                      </div>
                    ) : (
                      <div className="alert alert-danger" style={{
                        background: "linear-gradient(145deg, #DCC5B2, #D9A299)",
                        border: "1px solid rgba(220, 197, 178, 0.3)",
                        borderRadius: "12px",
                        color: "white"
                      }}>
                        âŒ Mjeku nuk punon kÃ«tÃ« ditÃ«.
                      </div>
                    )
                  )}

                  <div className="form-group">
                    <label className="form-label fw-bold mb-2" style={{ color: "#D9A299", fontSize: "1.1rem" }}>
                      ðŸ•’ Zgjedh OrÃ«n
                    </label>
                    <select
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      className="form-select form-select-lg"
                      required
                      disabled={!currentDaySchedule()}
                      style={{
                        border: "2px solid rgba(220, 197, 178, 0.3)",
                        borderRadius: "12px",
                        padding: "0.75rem 1rem",
                        fontSize: "1.1rem"
                      }}
                    >
                      <option value="">Zgjedh OrÃ«n</option>
                      {timeOptions().map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-lg w-100 mt-4 reserve-btn"
                    disabled={!form.time}
                    style={{
                      background: "linear-gradient(135deg, #D9A299, #DCC5B2)",
                      border: "none",
                      color: "white",
                      borderRadius: "15px",
                      boxShadow: "0 8px 25px rgba(217, 162, 153, 0.4)",
                      padding: "1rem 2rem",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 8px 20px rgba(217, 162, 153, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 15px rgba(217, 162, 153, 0.3)";
                    }}
                  >
                    âœ… Rezervo Terminin
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PatientHomeButton />
    </div>
  );
}
