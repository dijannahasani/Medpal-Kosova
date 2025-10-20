import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ClinicAddDoctor() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    departmentId: "",
    services: [],
  });

  const [departments, setDepartments] = useState([]);
  const [clinicServices, setClinicServices] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔍 Loading departments and services...");

    axios
      .get("http://localhost:5000/api/clinic/departments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("✅ Departments loaded:", res.data);
        setDepartments(res.data);
      })
      .catch((err) => {
        console.error("❌ Gabim në departamente:", err);
        console.error("❌ Error details:", err.response?.data);
      });

    axios
      .get("http://localhost:5000/api/clinic/services", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("✅ Services loaded:", res.data);
        setClinicServices(res.data);
      })
      .catch((err) => {
        console.error("❌ Gabim në shërbime:", err);
        console.error("❌ Error details:", err.response?.data);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceCheckboxChange = (serviceId) => {
    setFormData((prev) => {
      const isSelected = prev.services.includes(serviceId);
      const newServices = isSelected
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services: newServices };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:5000/api/auth/register-doctor", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("👨‍⚕️ Mjeku u shtua me sukses!");
      setFormData({
        name: "",
        email: "",
        password: "",
        departmentId: "",
        services: [],
      });
    } catch (err) {
      const message = err.response?.data?.message || "Gabim gjatë shtimit të mjekut.";
      alert("❌ " + message);
    }
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
          <div className="col-lg-8 col-xl-6">
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
                <h2 className="card-title mb-0" style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white" }}>
                  ➕ Shto Mjek të Ri
                </h2>
                <p className="mt-2 mb-0" style={{ fontSize: "1.1rem", opacity: "0.9" }}>
                  Regjistroni një mjek të ri në klinikën tuaj
                </p>
              </div>
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: "#D9A299", fontSize: "1.1rem" }}>Emri i mjekut</label>
                    <input
                      name="name"
                      className="form-control form-control-lg"
                      placeholder="Dr. Emri Mbiemri"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="off"
                      style={{
                        border: "2px solid rgba(220, 197, 178, 0.3)",
                        borderRadius: "12px",
                        padding: "0.75rem 1rem"
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: "#D9A299", fontSize: "1.1rem" }}>Emaili</label>
                    <input
                      name="email"
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="email@shembull.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="off"
                      style={{
                        border: "2px solid rgba(220, 197, 178, 0.3)",
                        borderRadius: "12px",
                        padding: "0.75rem 1rem"
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: "#D9A299", fontSize: "1.1rem" }}>Fjalëkalimi</label>
                    <input
                      name="password"
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Fjalëkalimi"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      style={{
                        border: "2px solid rgba(220, 197, 178, 0.3)",
                        borderRadius: "12px",
                        padding: "0.75rem 1rem"
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: "#D9A299", fontSize: "1.1rem" }}>Departamenti</label>
                    <select
                      name="departmentId"
                      className="form-select form-select-lg"
                      value={formData.departmentId}
                      onChange={handleChange}
                      required
                      style={{
                        border: "2px solid rgba(220, 197, 178, 0.3)",
                        borderRadius: "12px",
                        padding: "0.75rem 1rem"
                      }}
                    >
                      <option value="">Zgjedh Departamentin</option>
                      {departments.length === 0 ? (
                        <option value="" disabled>Nuk ka departamente të regjistruara</option>
                      ) : (
                        departments.map((d) => (
                          <option key={d._id} value={d._id}>
                            {d.name}
                          </option>
                        ))
                      )}
                    </select>
                    {departments.length === 0 && (
                      <div className="alert alert-warning mt-2" style={{
                        background: "linear-gradient(145deg, #F0E4D3, #DCC5B2)",
                        border: "1px solid rgba(220, 197, 178, 0.3)",
                        borderRadius: "8px",
                        color: "#2c3e50",
                        fontSize: "0.9rem"
                      }}>
                        ⚠️ Nuk ka departamente të regjistruara. Ju lutem shtoni departamente në <a href="/clinic/services" style={{ color: "#D9A299", textDecoration: "underline" }}>Menaxho Departamentet & Shërbimet</a>.
                      </div>
                    )}
                  </div>

                  <div className="mb-5">
                    <label className="form-label fw-bold" style={{ color: "#D9A299", fontSize: "1.1rem" }}>Shërbimet</label>
                    <div className="border rounded p-3" style={{ 
                      maxHeight: "200px", 
                      overflowY: "auto",
                      background: "linear-gradient(145deg, #FAF7F3, #F0E4D3)",
                      border: "2px solid rgba(220, 197, 178, 0.3)",
                      borderRadius: "12px"
                    }}>
                      {clinicServices.length === 0 && <p className="text-muted">Nuk ka shërbime të regjistruara.</p>}
                      {clinicServices.map((s) => (
                        <div className="form-check" key={s._id}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`service-${s._id}`}
                            checked={formData.services.includes(s._id)}
                            onChange={() => handleServiceCheckboxChange(s._id)}
                          />
                          <label className="form-check-label" htmlFor={`service-${s._id}`}>
                            {s.name} – {s.price}€
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-lg w-100" style={{
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
                    e.target.style.boxShadow = "0 12px 35px rgba(217, 162, 153, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 8px 25px rgba(217, 162, 153, 0.4)";
                  }}>
                    ➕ Shto Mjekun
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
