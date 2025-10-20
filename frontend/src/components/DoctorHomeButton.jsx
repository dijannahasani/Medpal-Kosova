import React from "react";
import { Link } from "react-router-dom";

export default function DoctorHomeButton() {
  return (
    <div className="position-fixed" style={{
      top: "20px",
      left: "20px",
      zIndex: 1050
    }}>
      <Link
        to="/doctor"
        className="btn btn-outline-light d-flex align-items-center gap-2"
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          border: "1px solid rgba(217, 162, 153, 0.3)",
          borderRadius: "25px",
          padding: "0.5rem 1rem",
          fontSize: "0.85rem",
          fontWeight: "600",
          color: "#2c3e50",
          textDecoration: "none",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(217, 162, 153, 0.9)";
          e.target.style.color = "white";
          e.target.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(255, 255, 255, 0.9)";
          e.target.style.color = "#2c3e50";
          e.target.style.transform = "translateY(0)";
        }}
      >
        🏠 Home
      </Link>
    </div>
  );
}