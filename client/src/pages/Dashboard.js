import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { API, authHeader } from "../utils/api";

export default function Dashboard() {
  const [usage, setUsage] = useState([]);
  const [liters, setLiters] = useState("");
  const [alertMsg, setAlertMsg] = useState(""); // 🌊 for water shortage alerts

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // ✅ Fetch water usage for this user
  const fetchUsage = async () => {
    try {
      const res = await fetch(`${API}/api/water/user/${user._id}`, {
        headers: authHeader(),
      });
      const data = await res.json();
      setUsage(data);
    } catch (err) {
      console.error("Error fetching usage:", err);
    }
  };

  // ✅ Add new usage record
  const addUsage = async () => {
    try {
      await fetch(`${API}/api/water`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({
          userName: user.name,
          litersUsed: liters,
          region: user.region || "Nairobi", // Optional: assign region if user has one
        }),
      });
      setLiters("");
      fetchUsage();
    } catch (err) {
      console.error("Error adding usage:", err);
    }
  };

  // ✅ Fetch alerts (check if user’s region is at risk)
  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API}/api/alerts`, { headers: authHeader() });
      const data = await res.json();

      // Find if user's region has a shortage alert
      const regionAlert = data.alerts.find(
        (a) =>
          a.region.toLowerCase() ===
          (user.region ? user.region.toLowerCase() : "nairobi")
      );

      if (regionAlert) setAlertMsg(regionAlert.message);
      else setAlertMsg(""); // No alert
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  // ✅ Load usage + alerts when dashboard mounts
  useEffect(() => {
    if (token) {
      fetchUsage();
      fetchAlerts();
    }
  }, [token]);

  // ✅ Chart Data
  const chartData = {
    labels: usage.map((u) => new Date(u.date).toLocaleDateString()),
    datasets: [
      {
        label: "Daily Usage (Liters)",
        data: usage.map((u) => u.litersUsed),
        borderColor: "blue",
        fill: false,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">
        💧 Welcome, {user?.name}
      </h1>

      {/* 🌊 Alert Banner */}
      {alertMsg && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4 rounded">
          <p className="text-yellow-700 font-semibold">{alertMsg}</p>
        </div>
      )}

      {/* Add Usage Form */}
      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          type="number"
          placeholder="Liters used"
          value={liters}
          onChange={(e) => setLiters(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={addUsage}
        >
          Add Usage
        </button>
      </div>

      {/* Usage Chart */}
      <div className="mb-6">
        {usage.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p className="text-gray-500">No usage data yet.</p>
        )}
      </div>

      {/* Google Map for SafeStation */}
      <div className="mt-6">
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={{ lat: -1.2921, lng: 36.8219 }}
            zoom={10}
          >
            <Marker position={{ lat: -1.2921, lng: 36.8219 }} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
