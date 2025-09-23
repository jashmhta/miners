import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const resp = await axios.get(`${API}/admin/users`);
      setUsers(resp.data.items || []);
    } catch (e) {
      toast({ title: "Error", description: "Failed to load users" });
    }
  };

  const fetchLogs = async (cursor = null) => {
    try {
      setLoading(true);
      const q = new URLSearchParams();
      q.set("limit", "50");
      if (cursor) q.set("cursor", cursor);
      const resp = await axios.get(`${API}/admin/logs?${q.toString()}`);
      const items = resp.data.items || [];
      setLogs((prev) => cursor ? [...prev, ...items] : items);
      setNextCursor(resp.data.next_cursor || null);
    } catch (e) {
      toast({ title: "Error", description: "Failed to load logs" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  return (
    <div className="min-h-[80vh] bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-black mb-6">Admin Dashboard</h1>

        <section className="mb-10">
          <h2 className="text-xl font-black mb-3">Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left p-3 border-b border-gray-700">Username</th>
                  <th className="text-left p-3 border-b border-gray-700">Role</th>
                  <th className="text-left p-3 border-b border-gray-700">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="odd:bg-black even:bg-gray-950">
                    <td className="p-3 border-b border-gray-800">{u.username}</td>
                    <td className="p-3 border-b border-gray-800">{u.role}</td>
                    <td className="p-3 border-b border-gray-800">{new Date(u.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black mb-3">Logs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left p-3 border-b border-gray-700">Time</th>
                  <th className="text-left p-3 border-b border-gray-700">Type</th>
                  <th className="text-left p-3 border-b border-gray-700">Action</th>
                  <th className="text-left p-3 border-b border-gray-700">User</th>
                  <th className="text-left p-3 border-b border-gray-700">Metadata</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="odd:bg-black even:bg-gray-950">
                    <td className="p-3 border-b border-gray-800">{new Date(l.created_at).toLocaleString()}</td>
                    <td className="p-3 border-b border-gray-800">{l.type}</td>
                    <td className="p-3 border-b border-gray-800">{l.action}</td>
                    <td className="p-3 border-b border-gray-800">{l.user_id?.slice(0,8) || "-"}</td>
                    <td className="p-3 border-b border-gray-800">
                      <pre className="whitespace-pre-wrap text-xs text-gray-400">{JSON.stringify(l.metadata || {}, null, 2)}</pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {nextCursor && (
            <div className="mt-4">
              <Button disabled={loading} onClick={() => fetchLogs(nextCursor)} className="bg-orange-500 text-black border-2 border-black font-black hover:bg-orange-400">
                {loading ? "Loading…" : "Load more"}
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}