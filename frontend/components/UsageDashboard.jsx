import { useEffect, useState } from 'react';

export default function UsageDashboard() {
  const [usageLogs, setUsageLogs] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/usage`)
      .then((res) => res.json())
      .then((data) => setUsageLogs(data))
      .catch((err) => console.error('Error fetching usage logs:', err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Water Usage Logs</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">User ID</th>
            <th className="border px-4 py-2 text-left">Liters Used</th>
            <th className="border px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {usageLogs.map((log) => (
            <tr key={log._id}>
              <td className="border px-4 py-2">{log.userId}</td>
              <td className="border px-4 py-2">{log.litersUsed}</td>
              <td className="border px-4 py-2">{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}