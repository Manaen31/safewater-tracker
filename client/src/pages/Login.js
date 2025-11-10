import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e?.preventDefault();
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        login(data);
        // slight delay to ensure state is set
        setTimeout(() => {
          if (data.user.role === "admin") navigate("/admin");
          else navigate("/dashboard");
        }, 250);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-2xl font-semibold text-center mb-4">🔐 Login</h2>
        <input className="border p-2 mb-3 w-full rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2 mb-4 w-full rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
        <p className="text-sm mt-3 text-center">No account? <a className="text-blue-600" href="/register">Register</a></p>
      </form>
    </div>
  );
}
