﻿// src/pages/Clinic/ClinicAddDepartment.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import { getToken } from "../../utils/auth";
import ClinicHomeButton from "../../components/ClinicHomeButton";

export default function ClinicAddDepartment() {
  const [name, setName] = useState("");
  const [departments, setDepartments] = useState([]);
  const token = getToken();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/clinic/departments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(res.data);
      } catch (err) {
        console.error("âŒ Gabim nÃ« marrjen e departamenteve:", err);
      }
    };

    fetchDepartments();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("âš ï¸ Ju lutemi shkruani emrin e departamentit.");

    try {
      await axios.post(
        `${API_BASE_URL}/api/clinic/departments`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      alert("âœ… Departamenti u shtua me sukses!");
      // Rifresko listÃ«n
      const res = await axios.get(`${API_BASE_URL}/api/clinic/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
    } catch (err) {
      console.error("âŒ Gabim:", err);
      console.error("âŒ Error response:", err.response?.data);
      alert("âŒ Gabim gjatÃ« shtimit tÃ« departamentit: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2>âž• Shto Departament</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Emri i departamentit"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Shto</button>
      </form>

      {departments.length > 0 && (
        <>
          <h3 style={{ marginTop: "30px" }}>ðŸ“‹ Departamentet ekzistuese:</h3>
          <ul>
            {departments.map((dep) => (
              <li key={dep._id}>â€¢ {dep.name}</li>
            ))}
          </ul>
        </>
      )}
      <ClinicHomeButton />
    </div>
  );
}
