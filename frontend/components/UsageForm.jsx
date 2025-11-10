import { useState } from 'react';

export default function UsageForm() {
  const [userId, setUserId] = useState('');
  const [litersUsed, setLitersUsed] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, litersUsed }),
    });
    const data = await res.json();
    console.log('Submitted:', data);
    setUserId('');
    setLitersUsed('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Log Water Usage</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Liters Used"
        value={litersUsed}
        onChange={(e) => setLitersUsed(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
}