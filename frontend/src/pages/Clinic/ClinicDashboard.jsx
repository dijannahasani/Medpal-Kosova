import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ClinicDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const cards = [
    { to: "/clinic/doctors", icon: "📋", title: "Lista e Mjekëve", desc: "Shiko të gjithë mjekët e klinikës" },
    { to: "/clinic/add-doctor", icon: "➕", title: "Shto Mjek", desc: "Regjistro një mjek të ri" },
    { to: "/clinic/calendar", icon: "📅", title: "Kalendar", desc: "Shiko terminet e klinikës" },
    { to: "/clinic/appointments", icon: "📆", title: "Terminet", desc: "Shiko dhe shkarko raportet e termineve" },
    { to: "/clinic/services", icon: "🏥", title: "Departamente & Shërbime", desc: "Menaxho departamentet" },
    { to: "/clinic/set-working-hours", icon: "🕒", title: "Orari i Mjekëve", desc: "Cakto orarin për mjekët" },
    { to: "/clinic/reports", icon: "📑", title: "Raportet", desc: "Shiko dhe shkarko raportet" },
    { to: "/clinic/invite-patient", icon: "📧", title: "Fto Pacient", desc: "Dërgo ftesë për verifikim pacientit" },
    { to: "/clinic/profile", icon: "⚙️", title: "Profili i Klinikës", desc: "Përditëso emrin, emailin ose fjalëkalimin" },
  ];

  return (
    <div
      className="container-fluid"
      style={{
        background: "linear-gradient(135deg, #FAF7F3 0%, #F0E4D3 50%, #DCC5B2 100%)",
        minHeight: "100vh",
        padding: "2rem 0",
      }}
    >
      <div className="container">
        {/* Header */}
        <div
          className="d-flex justify-content-between align-items-center p-4 mb-5"
          style={{
            background: "linear-gradient(135deg, #E3CFC3, #DCC5B2)",
            color: "#4A3F35",
            borderRadius: "15px",
            boxShadow: "0 8px 25px rgba(217, 162, 153, 0.3)",
          }}
        >
          <h2 className="m-0 fw-bold" style={{ fontSize: "1.8rem" }}>
            Mirësevini në Klinikën {user?.name || "Klinika e Re"}
          </h2>
          <button
            className="btn btn-outline-dark px-4 fw-semibold"
            style={{
              border: "1.5px solid #4A3F35",
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Dil
          </button>
        </div>

        {/* Cards Grid */}
        <div
          className="d-grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {cards.map((card, index) => (
            <Link to={card.to} key={index} className="text-decoration-none">
              <div
                className="card text-start shadow-sm"
                style={{
                  background: "linear-gradient(145deg, #FFFDFC, #F0E4D3)",
                  border: "1px solid rgba(220, 197, 178, 0.3)",
                  borderRadius: "20px",
                  boxShadow: "0 4px 20px rgba(217, 162, 153, 0.2)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(217, 162, 153, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(217, 162, 153, 0.2)";
                }}
              >
                <div className="card-body py-4 px-3 d-flex flex-column align-items-start justify-content-center" style={{ width: "100%" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      marginBottom: "0.5rem",
                      backgroundColor: "#FFF3EE",
                      borderRadius: "10px",
                      padding: "0.3rem 0.6rem",
                    }}
                  >
                    {card.icon}
                  </div>
                  <h5
                    className="card-title fw-bold mb-1"
                    style={{ color: "#D99991", fontSize: "1.15rem" }}
                  >
                    {card.title}
                  </h5>
                  <p
                    className="card-text text-muted"
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: "1.4",
                      color: "#6b5b53",
                      width: "100%",
                      textAlign: "left",
                      margin: 0
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
