import React from "react";
import { Link } from "react-router-dom";

export default function Home(){
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200 p-6">
      <div className="max-w-2xl text-center bg-white rounded-xl p-8 shadow">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">💧 SafeWater Tracker</h1>
        <p className="text-gray-700 mb-6">
          Monitor household water use, help NGOs detect shortages and support sustainable water management (SDG 6).
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded">Login</Link>
          <Link to="/register" className="px-6 py-2 border border-blue-600 text-blue-600 rounded">Register</Link>
        </div>
      </div>
    </div>
  );
}
