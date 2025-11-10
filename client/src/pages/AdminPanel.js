import React, { useEffect, useState } from "react";
import { API, authHeader } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const { user } = useAuth();
  const [allUsage, setAllUsage] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchUsage = async () => {
    const endpoint = user.role === "ngo" ? `${API}/api/admin/by-area/${filter || user.region || "Nairobi"}` : `${API}/api/admin/all-usage`;
    const res = await fetch(endpoint, { headers: authHeader() });
    const data = await res.json();
    setAllUsage(data || []);
  };

  const fetchAlerts = async () => {
    const res = await fetch(`${API}/api/alerts`, { headers: authHeader() });
    const data = await res.json();
    setAlerts(data.alerts || []);
  };

  useEffect(() => {
    fetchUsage();
    fetchAlerts();
  }, [filter]);

  return (
    <div className="min-h-screen p-6 bg-blue-50 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-green-700">{user?.role === "ngo" ? "NGO" : "Admin"} Dashboard</h1>
          <div>
            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>Logout</button>
          </div>
        </div>

        {alerts.length > 0 ? (
          <div className="bg-yellow-100 p-4 rounded mb-4 border-l-4 border-yellow-500">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Water Shortage Alerts</h3>
            {alerts.map((a,i) => <p key={i} className="text-gray-800">{a.message}</p>)}
          </div>
        ) : (
          <div className="text-gray-500 mb-4">✅ No shortages detected this week.</div>
        )}

        {user.role === "ngo" && (
          <div className="mb-4">
            <input className="border p-2 rounded w-64" placeholder="Enter region (Kikuyu)" value={filter} onChange={e=>setFilter(e.target.value)} />
            <button className="ml-2 bg-blue-600 text-white px-3 py-1 rounded" onClick={fetchUsage}>Search</button>
          </div>
        )}

        <div className="bg-white p-4 rounded shadow">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">User</th>
                <th className="p-2">Liters</th>
                <th className="p-2">Region</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {allUsage.slice(0,50).map((u,i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{u.userName}</td>
                  <td className="p-2">{u.litersUsed}</td>
                  <td className="p-2">{u.region}</td>
                  <td className="p-2">{new Date(u.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
