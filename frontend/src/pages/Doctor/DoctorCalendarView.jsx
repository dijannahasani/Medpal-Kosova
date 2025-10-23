import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorHomeButton from "../../components/DoctorHomeButton";
import "../../styles/ClinicCalendarResponsive.css";

export default function DoctorCalendarView() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [activeStartDate, setActiveStartDate] = useState(new Date(date.getFullYear(), date.getMonth(), 1));
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/appointments/doctor`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("❌ Gabim në marrjen e termineve:", err);
      }
    };
    fetchAppointments();
  }, []);

  const selectedDateStr = date.toISOString().split("T")[0];
  const filteredAppointments = appointments.filter(app => app.date === selectedDateStr);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const formatted = date.toISOString().split("T")[0];
      const found = appointments.find(a => a.date === formatted);
      if (found) {
        return (
          <div
            style={{
              backgroundColor: "#0d6efd",
              borderRadius: "50%",
              width: "8px",
              height: "8px",
              margin: "auto",
              marginTop: "2px",
            }}
          />
        );
      }
    }
    return null;
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
                <h3 className="card-title mb-0" style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white" }}>
                  🗓️ Terminet për Dr. {JSON.parse(localStorage.getItem("user"))?.name}
                </h3>
                <p className="mt-2 mb-0" style={{ fontSize: "1.1rem", opacity: "0.9", color: "white" }}>
                  Shikoni terminin tuaj në kalendar
                </p>
              </div>
              <div className="card-body p-5">

                <div className="mb-4" style={{
                  background: "linear-gradient(145deg, #FAF7F3, #F0E4D3)",
                  padding: "2rem",
                  borderRadius: "20px",
                  boxShadow: "0 8px 25px rgba(217, 162, 153, 0.2)",
                  border: "1px solid rgba(220, 197, 178, 0.3)"
                }}>
                  <div className="clinic-calendar-wrapper">
                    <div className="clinic-calendar-header d-flex align-items-center justify-content-between mb-2">
                      <button
                        className="calendar-nav-btn"
                        aria-label="Previous"
                        onClick={() => {
                          if (view === "month") {
                            setActiveStartDate(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() - 1, 1));
                          } else if (view === "year") {
                            setActiveStartDate(new Date(activeStartDate.getFullYear() - 1, activeStartDate.getMonth(), 1));
                          }
                        }}
                      >
                        ‹
                      </button>

                      <button
                        className="calendar-label-btn"
                        onClick={() => setView(view === "month" ? "year" : "month")}
                        aria-label="Toggle month/year view"
                      >
                        {view === "month"
                          ? `${activeStartDate.toLocaleString(undefined, { month: "long" })} ${activeStartDate.getFullYear()}`
                          : `${activeStartDate.getFullYear()}`}
                      </button>

                      <button
                        className="calendar-nav-btn"
                        aria-label="Next"
                        onClick={() => {
                          if (view === "month") {
                            setActiveStartDate(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() + 1, 1));
                          } else if (view === "year") {
                            setActiveStartDate(new Date(activeStartDate.getFullYear() + 1, activeStartDate.getMonth(), 1));
                          }
                        }}
                      >
                        ›
                      </button>
                    </div>

                    <Calendar
                      className="w-100 border rounded shadow-sm"
                      value={date}
                      onChange={(d) => {
                        setDate(d);
                        if (view !== "month") setView("month");
                      }}
                      tileContent={tileContent}
                      activeStartDate={activeStartDate}
                      onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
                      view={view}
                      onViewChange={({ view }) => setView(view)}
                      showNavigation={false}
                      style={{ fontSize: "1.1rem" }}
                    />
                  </div>
                </div>

                <h5 className="text-center mb-4" style={{ color: "#D9A299", fontSize: "1.3rem" }}>
                  Terminet për datën <strong>{date.toDateString()}</strong>:
                </h5>

                {filteredAppointments.length > 0 ? (
                  <ul className="list-group" style={{
                    background: "linear-gradient(145deg, #FAF7F3, #F0E4D3)",
                    borderRadius: "15px",
                    boxShadow: "0 8px 25px rgba(217, 162, 153, 0.2)",
                    border: "1px solid rgba(220, 197, 178, 0.3)"
                  }}>
                    {filteredAppointments.map((a, i) => (
                      <li key={i} className="list-group-item appointment-item" style={{
                        background: "transparent",
                        border: "1px solid rgba(220, 197, 178, 0.2)",
                        borderRadius: "10px",
                        marginBottom: "0.5rem",
                        padding: "1.25rem 1rem",
                        fontSize: "1.05rem",
                        color: "#2c3e50"
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ fontWeight: 600, color: '#D9A299' }}>
                            ⏰ {a.time} – {a.patientId?.name}
                          </div>
                          <div className="appointment-email">
                            {a.patientId?.email}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="alert text-center" style={{
                    background: "linear-gradient(145deg, #F0E4D3, #DCC5B2)",
                    border: "1px solid rgba(220, 197, 178, 0.3)",
                    borderRadius: "15px",
                    color: "#2c3e50",
                    fontSize: "1.1rem",
                    padding: "2rem"
                  }}>
                    Nuk ka termine për këtë datë.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DoctorHomeButton />
    </div>
  );
}
