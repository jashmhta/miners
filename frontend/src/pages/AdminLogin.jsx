import React, { useState } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = async () => {
    if (!username || !password) return toast({ title: "Missing fields" });
    try {
      setLoading(true);
      const resp = await axios.post(`${API}/auth/login`, { username, password });
      if (resp?.data?.id) {
        toast({ title: "Admin authenticated" });
        navigate("/admin/dashboard");
      }
    } catch (e) {
      const msg = e?.response?.data?.detail || "Login failed";
      toast({ title: "Error", description: String(msg) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-black text-white">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-black text-center mb-6">Admin Login</h1>
        <div className="bg-gray-900 border-4 border-gray-700 p-6 space-y-4">
          <div>
            <label className="text-gray-300 font-bold text-sm">Username</label>
            <Input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="admin" className="mt-2 bg-black border-gray-700 text-white"/>
          </div>
          <div>
            <label className="text-gray-300 font-bold text-sm">Password</label>
            <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="mt-2 bg-black border-gray-700 text-white"/>
          </div>
          <Button disabled={loading} onClick={login} className="w-full bg-orange-500 text-black border-2 border-black font-black hover:bg-orange-400">
            {loading ? "Working…" : "Login"}
          </Button>
        </div>
        <p className="text-xs text-gray-600 mt-4 text-center">Use the seeded admin credentials if configured in the backend.</p>
      </div>
    </div>
  );
}