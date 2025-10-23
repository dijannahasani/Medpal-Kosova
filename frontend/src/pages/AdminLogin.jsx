import React, { useState } from "react";
import API_BASE_URL from "../config/api";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          expectedRole: "admin",
          adminSecret,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gabim nÃ« login");

      // Ruaj token dhe user nÃ« localStorage pÃ«r PrivateRoute
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ThÃ«rrit onLogin pa parametra, sepse tokenin e ruajtÃ«m vetÃ«
      if (onLogin) onLogin();

    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login Admin</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="FjalÃ«kalimi"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Kodi sekret i adminit"
        value={adminSecret}
        onChange={e => setAdminSecret(e.target.value)}
        required
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">KyÃ§u</button>
    </form>
  );
}
