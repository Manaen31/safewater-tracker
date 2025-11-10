import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "household", region: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e?.preventDefault();
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.user) {
        alert("Registered — please login");
        navigate("/login");
      } else {
        alert(data.message || "Register failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-2xl font-semibold mb-4">📝 Register</h2>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 mb-2 w-full rounded" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 mb-2 w-full rounded" />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} className="border p-2 mb-2 w-full rounded" />
        <select name="role" value={form.role} onChange={handleChange} className="border p-2 mb-2 w-full rounded">
          <option value="household">Household</option>
          <option value="ngo">NGO</option>
          <option value="admin">Admin</option>
        </select>
        <input name="region" placeholder="Region (e.g., Kikuyu)" value={form.region} onChange={handleChange} className="border p-2 mb-2 w-full rounded" />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
