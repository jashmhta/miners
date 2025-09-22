import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <p className="mt-5">Bruteosaur Admin — use the Admin link to manage users/logs.</p>
        <Link className="App-link" to="/admin">Go to Admin</Link>
      </header>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}