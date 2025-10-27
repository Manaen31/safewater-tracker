import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../utils/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "household" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.user) {
        alert("✅ Registration successful!");
        navigate("/login");
      } else alert(data.message || "Registration failed");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">📝 Register</h2>
      <input
        name="name"
        className="border p-2 mb-2"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="email"
        className="border p-2 mb-2"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="password"
        className="border p-2 mb-2"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <select
        name="role"
        className="border p-2 mb-2"
        value={form.role}
        onChange={handleChange}
      >
        <option value="household">Household</option>
        <option value="ngo">NGO</option>
        <option value="admin">Admin</option>
      </select>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
}
