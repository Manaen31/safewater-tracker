// client/src/pages/AdminPanel.js
import React, { useEffect, useState } from "react";
import { API, authHeader } from "../utils/api";

export default function AdminPanel() {
  const [allUsage, setAllUsage] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch usage data (region-filtered for NGO, all for admin)
  const fetchUsage = async () => {
    const endpoint =
      user.role === "ngo"
        ? `${API}/api/admin/by-area/${filter || "Nairobi"}`
        : `${API}/api/admin/all-usage`;
    const res = await fetch(endpoint, { headers: authHeader() });
    const data = await res.json();
    setAllUsage(data);
  };

  // Fetch alerts
  const fetchAlerts = async () => {
    const res = await fetch(`${API}/api/alerts`, { headers: authHeader() });
    const data = await res.json();
    setAlerts(data.alerts);
  };

  useEffect(() => {
    fetchUsage();
    fetchAlerts();
  }, [filter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-700">
        🏢 {user.role === "ngo" ? "NGO" : "Admin"} Dashboard
      </h1>

      {alerts.length > 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4 rounded">
          <h2 className="font-semibold text-yellow-700 mb-2">⚠️ Water Shortage Alerts</h2>
          {alerts.map((a, i) => (
            <p key={i} className="text-sm text-gray-800">{a.message}</p>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-4">✅ No shortages detected this week.</p>
      )}

      {user.role === "ngo" && (
        <input
          className="border p-2 mb-4"
          placeholder="Enter region (e.g., Kikuyu)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      )}

      <p className="mb-2 font-semibold">Total Records: {allUsage.length}</p>
      <table className="border w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">User</th>
            <th className="p-2">Liters</th>
            <th className="p-2">Region</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {allUsage.slice(0, 20).map((u, i) => (
            <tr key={i}>
              <td className="p-2">{u.userName}</td>
              <td className="p-2">{u.litersUsed}</td>
              <td className="p-2">{u.region}</td>
              <td className="p-2">{new Date(u.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
