import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { API, authHeader } from "../utils/api";

export default function Dashboard() {
  const [usage, setUsage] = useState([]);
  const [liters, setLiters] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // ✅ Fetch usage
  const fetchUsage = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/water/user/${user._id}`, {
        headers: authHeader(),
      });
      const data = await res.json();
      setUsage(data);

      // Calculate average usage for alerts
      if (data.length > 0) {
        const avg = data.reduce((a, b) => a + b.litersUsed, 0) / data.length;
        if (avg < 20) {
          setAlert(
            `🚨 Low water usage detected (${avg.toFixed(
              1
            )}L avg) — Possible shortage in your area.`
          );
        } else {
          setAlert(null);
        }
      }
    } catch (err) {
      console.error("Error fetching usage:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new usage
  const addUsage = async () => {
    if (!liters) return alert("Enter liters used");
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/water`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ userName: user.name, litersUsed: liters }),
      });
      if (!res.ok) throw new Error("Failed to add usage");
      setLiters("");
      fetchUsage();
    } catch (err) {
      console.error(err);
      alert("Error adding usage");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsage();
  }, []);

  // ✅ Chart configuration
  const chartData = {
    labels: usage.map((u) => new Date(u.date).toLocaleDateString()),
    datasets: [
      {
        label: "Daily Usage (Liters)",
        data: usage.map((u) => u.litersUsed),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        💧 Welcome, {user?.name || "User"}
      </h1>

      {/* Alert banner */}
      {alert && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded mb-4">
          {alert}
        </div>
      )}

      {/* Add Usage */}
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <input
          className="border p-2 mr-2 w-full sm:w-auto mb-2 sm:mb-0 rounded"
          type="number"
          placeholder="Liters used"
          value={liters}
          onChange={(e) => setLiters(e.target.value)}
        />
        <button
          onClick={addUsage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Add Usage"}
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Map */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2 text-blue-600">SafeStations Nearby</h2>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "350px" }}
            center={{ lat: -1.2921, lng: 36.8219 }}
            zoom={11}
          >
            <Marker position={{ lat: -1.2921, lng: 36.8219 }} title="Nairobi SafeStation" />
            <Marker position={{ lat: -1.25, lng: 36.72 }} title="Kikuyu SafeStation" />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
