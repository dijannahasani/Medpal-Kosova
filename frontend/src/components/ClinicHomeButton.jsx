import { Link } from "react-router-dom";

export default function ClinicHomeButton() {
  return (
    <Link 
      to="/clinic" 
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        zIndex: 1050,
        textDecoration: "none"
      }}
    >
      <button
        style={{
          background: "linear-gradient(135deg, #D9A299, #DCC5B2)",
          border: "none",
          borderRadius: "12px",
          padding: "12px 16px",
          color: "white",
          fontSize: "16px",
          fontWeight: "600",
          boxShadow: "0 4px 15px rgba(217, 162, 153, 0.4)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 6px 20px rgba(217, 162, 153, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 15px rgba(217, 162, 153, 0.4)";
        }}
      >
        🏠 Home
      </button>
    </Link>
  );
}