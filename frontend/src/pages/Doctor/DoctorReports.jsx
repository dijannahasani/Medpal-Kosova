import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorHomeButton from "../../components/DoctorHomeButton";

export default function DoctorReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/reports/doctor`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data);
      } catch (err) {
        console.error("❌ Gabim në marrjen e raporteve të mjekut:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownload = async (reportId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/reports/${reportId}/pdf`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `raporti-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Gabim gjatë shkarkimit të PDF:", err);
    }
  };

  return (
    <div className="container-fluid" style={{ 
      backgroundColor: "#FAF7F3", 
      minHeight: "100vh", 
      padding: "2rem 0",
      background: "linear-gradient(135deg, #FAF7F3 0%, #F0E4D3 50%, #DCC5B2 100%)"
    }}>
      <DoctorHomeButton />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
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
                  📑 Raportet e Mia të Vizitave
                </h2>
                <p className="mt-2 mb-0" style={{ fontSize: "1.1rem", opacity: "0.9", color: "white" }}>
                  Shikoni dhe shkarkoni raportet e vizitave tuaja
                </p>
              </div>
              <div className="card-body p-5">

                {loading ? (
                  <div className="text-center" style={{ padding: "3rem" }}>
                    <div className="spinner-border" role="status" style={{ color: "#D9A299", width: "3rem", height: "3rem" }}></div>
                    <p className="mt-3" style={{ fontSize: "1.2rem", color: "#D9A299" }}>⏳ Duke u ngarkuar...</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="alert text-center" style={{
                    background: "linear-gradient(145deg, #F0E4D3, #DCC5B2)",
                    border: "1px solid rgba(220, 197, 178, 0.3)",
                    borderRadius: "15px",
                    color: "#2c3e50",
                    fontSize: "1.1rem",
                    padding: "2rem"
                  }}>
                    📭 Nuk ka raporte të krijuara ende.
                  </div>
                ) : (
                  <div className="list-group" style={{
                    background: "linear-gradient(145deg, #FAF7F3, #F0E4D3)",
                    borderRadius: "15px",
                    boxShadow: "0 8px 25px rgba(217, 162, 153, 0.2)",
                    border: "1px solid rgba(220, 197, 178, 0.3)"
                  }}>
                    {reports.map((r) => (
                      <div key={r._id} className="list-group-item list-group-item-action mb-3" style={{
                        background: "transparent",
                        border: "1px solid rgba(220, 197, 178, 0.2)",
                        borderRadius: "10px",
                        padding: "1.5rem",
                        color: "#2c3e50"
                      }}>
                        <div className="row align-items-center">
                          <div className="col-md-8">
                            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                              🧑‍💼 <strong style={{ color: "#D9A299" }}>Pacienti:</strong> {r.patientId?.name}
                            </p>
                            <p style={{ fontSize: "0.95rem", marginBottom: "0.5rem", textAlign: "left", marginLeft: "-6px" }}>
                              <span style={{ whiteSpace: "nowrap", display: "inline-block" }}>📅 <strong>Data:</strong>&nbsp;{r.appointmentId?.date}</span>
                              <span style={{ margin: "0 6px", whiteSpace: "nowrap", display: "inline-block" }}>⏰ <strong>Ora:</strong>&nbsp;{r.appointmentId?.time}</span>
                            </p>
                            <p style={{ fontSize: "1rem", marginBottom: "0" }}>
                              📋 <strong>Diagnoza:</strong> {r.diagnosis}
                            </p>
                          </div>
                          <div className="col-md-4 text-end">
                            <button className="btn btn-sm" onClick={() => handleDownload(r._id)} style={{
                              background: "linear-gradient(135deg, #D9A299, #DCC5B2)",
                              border: "none",
                              color: "white",
                              borderRadius: "10px",
                              boxShadow: "0 6px 18px rgba(217, 162, 153, 0.35)",
                              padding: "0.45rem 0.9rem",
                              fontSize: "0.92rem",
                              fontWeight: "600",
                              transition: "all 0.18s ease",
                              display: "inline-block",
                              maxWidth: "220px",
                              width: "auto",
                              whiteSpace: "normal",
                              overflow: "visible",
                              textOverflow: "unset",
                              lineHeight: "1.05"
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = "translateY(-1px)";
                              e.target.style.boxShadow = "0 8px 20px rgba(217, 162, 153, 0.45)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = "translateY(0)";
                              e.target.style.boxShadow = "0 6px 18px rgba(217, 162, 153, 0.35)";
                            }}>
                              ⬇️ Shkarko PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
