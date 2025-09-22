import React, { useEffect, useState } from "react";
import { fetchUsers, fetchLogs, fetchStats, getMe, logout } from "../api";
import AdminLogin from "./AdminLogin";

function Section({ title, children }) {
  return (
    <section className="bg-[#0b0b0c] border-2 border-gray-800 p-6">
      <h3 className="text-lg font-black mb-4">{title}</h3>
      {children}
    </section>
  );
}

export default function AdminDashboard() {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const loadAll = async () => {
    setLoading(true);
    setErr("");
    try {
      const meRes = await getMe();
      setMe(meRes);
      const [{ items: userItems }, logRes, statsRes] = await Promise.all([
        fetchUsers(),
        fetchLogs({ limit: 50 }),
        fetchStats(),
      ]);
      setUsers(userItems || []);
      setLogs(logRes?.items || []);
      setCursor(logRes?.next_cursor || null);
      setStats(statsRes);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!me) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-5xl mx-auto">
          <AdminLogin onAuthed={loadAll} />
          {err && <p className="text-red-400 text-xs mt-3">{String(err)}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">Admin Dashboard</h1>
          <div className="text-sm text-gray-400">Signed in as <span className="text-white font-bold">{me.username}</span> ({me.role})
            <button className="ml-4 underline" onClick={async()=>{ await logout(); window.location.reload(); }}>Logout</button>
          </div>
        </div>

        <Section title="Users">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-black">
                <tr>
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Username</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-t border-gray-800">
                    <td className="p-2 text-gray-400">{u.id}</td>
                    <td className="p-2">{u.username}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2 text-gray-400">{new Date(u.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Logs (latest)">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-black">
                <tr>
                  <th className="text-left p-2">Time</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Action</th>
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">IP</th>
                  <th className="text-left p-2">UA</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(l => (
                  <tr key={l.id} className="border-t border-gray-800">
                    <td className="p-2 text-gray-400">{new Date(l.created_at).toLocaleString()}</td>
                    <td className="p-2">{l.type}</td>
                    <td className="p-2">{l.action}</td>
                    <td className="p-2 text-gray-400">{l.user_id || "-"}</td>
                    <td className="p-2 text-gray-400">{l.ip || "-"}</td>
                    <td className="p-2 text-gray-400 truncate max-w-[320px]">{l.ua || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cursor && <div className="text-xs text-gray-400 mt-2">Next cursor: {cursor}</div>}
        </Section>

        <Section title="Stats">
          {!stats ? (
            <div className="text-gray-400">No data</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black border border-gray-800 p-4">
                <div className="text-sm text-gray-400">Users</div>
                <div className="text-3xl font-black">{stats.totals?.users ?? 0}</div>
              </div>
              <div className="bg-black border border-gray-800 p-4">
                <div className="text-sm text-gray-400">Logs</div>
                <div className="text-3xl font-black">{stats.totals?.logs ?? 0}</div>
              </div>
              <div className="bg-black border border-gray-800 p-4">
                <div className="text-sm text-gray-400">Wallet Validations</div>
                <div className="text-3xl font-black">{stats.totals?.wallet_validations ?? 0}</div>
              </div>
              <div className="md:col-span-3 bg-black border border-gray-800 p-4">
                <div className="text-sm text-gray-400 mb-2">Validations by Status</div>
                <div className="flex flex-wrap gap-3">
                  {(stats.validations_by_status || []).map(v => (
                    <div key={v.status} className="px-3 py-2 bg-[#0b0b0c] border border-gray-800">
                      <span className="font-bold">{v.status}</span>: {v.count}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}