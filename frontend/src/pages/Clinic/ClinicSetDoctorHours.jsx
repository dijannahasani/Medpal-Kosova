import { useState, useEffect } from "react";
import axios from "axios";
import ClinicHomeButton from "../../components/ClinicHomeButton";
import "./ClinicSetDoctorHours.css";

export default function ClinicSetDoctorHours() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [workingHours, setWorkingHours] = useState({
    monday: { start: "", end: "" },
    tuesday: { start: "", end: "" },
    wednesday: { start: "", end: "" },
    thursday: { start: "", end: "" },
    friday: { start: "", end: "" },
    saturday: { start: "", end: "" },
    sunday: { start: "", end: "" },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}/api/clinic/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("âŒ Gabim nÃ« marrjen e mjekÃ«ve:", err));
  }, []);

  const handleChange = (day, field, value) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
       ` ${API_BASE_URL}/api/working-hours/${selectedDoctor}`,
        { workingHours },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("âœ… Orari u ruajt me sukses!");
    } catch (err) {
      console.error("âŒ Gabim nÃ« ruajtje:", err);
      alert("âŒ DÃ«shtoi ruajtja e orarit.");
    }
  };

  const dayLabels = {
    monday: "E HÃ«nÃ«",
    tuesday: "E MartÃ«",
    wednesday: "E MÃ«rkurÃ«",
    thursday: "E Enjte",
    friday: "E Premte",
    saturday: "E ShtunÃ«",
    sunday: "E Diel",
  };

  return (
    <div className="container-fluid" style={{
      backgroundColor: "#FAF7F3",
      minHeight: "100vh",
      padding: "2rem 0",
      background: "linear-gradient(135deg, #FAF7F3 0%, #F0E4D3 50%, #DCC5B2 100%)"
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
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
                <h2 className="card-title mb-0" style={{ fontSize: "2.5rem", fontWeight: "bold", color:"white" }}>
                  ðŸ• Vendos Orarin pÃ«r Mjekun
                </h2>
                <p className="mt-2 mb-0" style={{ fontSize: "1.1rem", opacity: "0.9" }}>
                  PÃ«rcaktoni orarin e punÃ«s pÃ«r mjekÃ«t e klinikÃ«s
                </p>
              </div>
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: "#D9A299", fontSize: "1.1rem" }}>Zgjedh Mjekun</label>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="form-select form-select-lg"
                      required
                      style={{
                        border: "2px solid rgba(220, 197, 178, 0.3)",
                        borderRadius: "12px",
                        padding: "0.75rem 1rem"
                      }}
                    >
                      <option value="">Zgjedh Mjekun</option>
                      {doctors.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                          {doc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {Object.entries(workingHours).map(([day, hours]) => (
                    <div key={day} className="mb-4 day-card">
                      <label className="form-label fw-bold mb-3 day-label">{dayLabels[day]}:</label>
                      <div className="d-flex flex-column flex-md-row gap-3 align-items-center">
                        <input
                          type="time"
                          value={hours.start}
                          onChange={(e) => handleChange(day, "start", e.target.value)}
                          className="form-control form-control-lg time-input"
                          aria-label={`${day}-start`}
                        />
                        <span className="fw-bold time-sep">deri</span>
                        <input
                          type="time"
                          value={hours.end}
                          onChange={(e) => handleChange(day, "end", e.target.value)}
                          className="form-control form-control-lg time-input"
                          aria-label={`${day}-end`}
                        />
                      </div>
                    </div>
                  ))}

                  <button className="btn btn-lg w-100" type="submit" disabled={!selectedDoctor} style={{
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
                    if (!e.target.disabled) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 12px 35px rgba(217, 162, 153, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 8px 25px rgba(217, 162, 153, 0.4)";
                    }
                  }}>
                    ðŸ’¾ Ruaj Orarin
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ClinicHomeButton />
    </div>
  );
}
