import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState(null);
  const [workingHours, setWorkingHours] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Merr të dhënat e mjekut
    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDoctor(res.data))
      .catch((err) =>
        console.error("❌ Gabim gjatë marrjes së profilit:", err)
      );

    // Merr orarin e punës
    axios
      .get("http://localhost:5000/api/working-hours/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWorkingHours(res.data))
      .catch((err) =>
        console.error("❌ Gabim gjatë marrjes së orarit të punës:", err)
      );
  }, []);

  if (!doctor) return <p className="text-center mt-4">⏳ Duke u ngarkuar...</p>;

  return (
    <div className="container py-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow">
        <div className="card-body">
          <h3 className="mb-4 text-primary">👨‍⚕️ Profili i Mjekut</h3>

          <ul className="list-group mb-3">
            <li className="list-group-item">
              <strong>Emri:</strong> {doctor.name}
            </li>
            <li className="list-group-item">
              <strong>Email:</strong> {doctor.email}
            </li>
            <li className="list-group-item">
              <strong>Kodi i Mjekut:</strong> {doctor.doctorCode}
            </li>
            <li className="list-group-item">
              <strong>Roli:</strong> {doctor.role}
            </li>
            <li className="list-group-item">
              <strong>Departamenti:</strong>{" "}
              {doctor.departmentId?.name || "—"}
            </li>
            <li className="list-group-item">
              <strong>Shërbimet:</strong>{" "}
              {doctor.services?.length > 0
                ? doctor.services.map((s) => s.name).join(", ")
                : "—"}
            </li>
          </ul>

          {workingHours && (
            <div className="mt-4">
              <h5 className="text-success">🕐 Orari i Punës</h5>
              <p>
                <strong>Ditet:</strong> {workingHours.days.join(", ")}
              </p>
              <p>
                <strong>Prej:</strong> {workingHours.startTime} &nbsp; <strong>deri:</strong> {workingHours.endTime}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
