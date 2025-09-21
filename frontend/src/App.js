import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Compatibility from "./pages/Compatibility";
import { Toaster } from "./components/ui/toaster";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function Demo() {
  return (
    <div className="min-h-[70vh] bg-black text-white">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-black mb-6 text-center">WATCH DEMO</h1>
        <p className="text-gray-400 font-bold text-center max-w-2xl mx-auto mb-8">
          In-app YouTube viewer showcasing Bruteosaur mining simulation and features.
        </p>
        <div className="aspect-video border-4 border-orange-500">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/YE7VzlLtp-4?rel=0"
            title="Bruteosaur Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="min-h-[70vh] bg-black text-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black mb-6">Dashboard (Mock)</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border-4 border-gray-700 p-6">
            <div className="text-gray-400 font-bold">HASH RATE</div>
            <div className="text-3xl font-black text-orange-500">1.25M/sec</div>
          </div>
          <div className="bg-gray-900 border-4 border-gray-700 p-6">
            <div className="text-gray-400 font-bold">SUCCESS RATE</div>
            <div className="text-3xl font-black text-green-500">94.7%</div>
          </div>
          <div className="bg-gray-900 border-4 border-gray-700 p-6">
            <div className="text-gray-400 font-bold">AVG TIME</div>
            <div className="text-3xl font-black text-blue-400">7.3s</div>
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <button className="bg-orange-500 text-black px-6 py-3 border-4 border-black font-black hover:bg-orange-400">Start Mining (Mock)</button>
          <button className="bg-gray-700 text-white px-6 py-3 border-4 border-gray-600 font-black hover:bg-gray-600">Stop</button>
        </div>
      </section>
    </div>
  );
}

function About() {
  return (
    <div className="min-h-[70vh] bg-black text-white">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-black mb-6">About Bruteosaur</h1>
        <p className="text-gray-300 leading-relaxed font-bold">
          Bruteosaur is a professional-grade crypto mining and wallet recovery platform. This is a pixel-close replica with mocked data and UI interactions for demonstration.
        </p>
        <div className="mt-6">
          <Link to="/compatibility" className="text-orange-500 font-black underline">Check compatibility</Link>
        </div>
      </section>
    </div>
  );
}

const HomePage = Home;
const CompatibilityPage = Compatibility;

function App() {
  useEffect(() => {
    // Simple health check to backend using configured env URL only
    const helloWorldApi = async () => {
      try {
        const response = await axios.get(`${API}/`);
        console.log(response.data.message);
      } catch (e) {
        console.error(e, "errored out requesting / api");
      }
    };
    helloWorldApi();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/compatibility" element={<CompatibilityPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;