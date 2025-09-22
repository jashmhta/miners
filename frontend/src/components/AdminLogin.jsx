import React, { useState } from "react";
import { login } from "../api";

export default function AdminLogin({ onAuthed }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      onAuthed?.();
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message;
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-[#0b0b0c] border-2 border-gray-800 p-6 text-white">
      <h2 className="text-xl font-black mb-2">Admin Login</h2>
      <p className="text-xs text-gray-400 mb-4">Monitoring dashboard (login only). Use your admin credentials.</p>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-300">Username</label>
          <input className="mt-1 w-full bg-black border border-gray-700 p-2" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="username" required/>
        </div>
        <div>
          <label className="text-sm text-gray-300">Password</label>
          <input type="password" className="mt-1 w-full bg-black border border-gray-700 p-2" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" required/>
        </div>
        {error && <div className="text-red-400 text-sm">{String(error)}</div>}
        <div className="flex items-center gap-3">
          <button disabled={loading} className="bg-orange-500 text-black font-black px-4 py-2 border-2 border-black disabled:opacity-50" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}