import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Compatibility from "./pages/Compatibility";
import { Toaster } from "./components/ui/toaster";
import Simulate from "./pages/Simulate";
import Auth from "./pages/Auth";
import ConnectWallet from "./pages/ConnectWallet";
import DownloadGuide from "./pages/DownloadGuide";
import Technologies from "./pages/Technologies";
import Success from "./pages/Success";
import Testimonials from "./pages/Testimonials";

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
            src="https://www.youtube.com/embed/DgJRoQcz6RQ?rel=0"
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

function About() {
  return (
    <div className="min-h-[70vh] bg-black text-white">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-black mb-6">About Bruteosaur</h1>
        <p className="text-gray-300 leading-relaxed font-bold">
          Bruteosaur is a professional-grade crypto mining and wallet recovery platform. This replica demonstrates the intended UX and flows.
        </p>
      </section>
    </div>
  );
}

const HomePage = Home;
const CompatibilityPage = Compatibility;

function App() {
  useEffect(() => {
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
            <Route path="/technologies" element={<Technologies />} />
            <Route path="/compatibility" element={<CompatibilityPage />} />
            <Route path="/success" element={<Success />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/about" element={<About />} />
            <Route path="/simulate" element={<Simulate />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/connect-wallet" element={<ConnectWallet />} />
            <Route path="/download-guide" element={<DownloadGuide />} />
          </Routes>
        </Layout>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;