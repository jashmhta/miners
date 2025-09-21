import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { stats, features } from "../mock";
import { Cpu, Zap, Shield, TrendingUp, Download, ArrowRight } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const ICONS = { Cpu, Zap, Shield, TrendingUp };
const HERO_VIDEO = "https://customer-assets.emergentagent.com/job_bruteosaur-copy/artifacts/jqvoadui_VID_20250616_202438_764.mp4";

export default function Home() {
  const { toast } = useToast();
  const navigate = useNavigate();
  // Terminal demo simulation (kept for Home section)
  const [lines, setLines] = useState([]);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const addLine = (text) => setLines((prev) => [...prev, text].slice(-300));

  const startDemo = () => {
    if (running) return;
    setRunning(true);
    addLine("bruteosaur@mining:~$ initializing engines...");
    let count = 0;
    timerRef.current = setInterval(() => {
      count++;
      const speed = (1200000 + Math.floor(Math.random() * 50000)).toLocaleString();
      const success = (94 + Math.random()).toFixed(2);
      addLine(`[${new Date().toLocaleTimeString()}] rate=${speed}/sec success=${success}% nonce=${Math.random()
        .toString(36)
        .slice(2, 8)}`);
      if (count % 15 === 0) addLine("Potential mnemonic candidate found... verifying...");
      if (count >= 120) {
        addLine("Wallet mnemonic verified. Recovery possible.");
        toast({
          title: "Demo Complete",
          description: "Mnemonic successfully discovered in simulation.",
        });
        stopDemo();
      }
    }, 120);
  };

  const stopDemo = () => {
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const resetDemo = () => {
    stopDemo();
    setLines([]);
  };

  useEffect(() => {
    return () => stopDemo();
  }, []);

  const FeatureCard = ({ icon, title, description }) => {
    const Icon = ICONS[icon] || Cpu;
    return (
      <div className="bg-black border-4 border-gray-600 p-6 hover:border-orange-500 transition-all duration-300">
        <div className="bg-orange-500 text-black p-3 border-[3px] border-black inline-block mb-4">
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-black mb-3 text-white">{title}</h3>
        <p className="text-gray-400 font-bold">{description}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop playsInline muted className="w-full h-full object-cover opacity-20">
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
            <span className="text-white">BRUTE</span>
            <span className="text-orange-500">OSAUR</span>
          </h1>
          <div className="bg-orange-500 text-black px-8 py-4 border-4 border-black inline-block mb-8 -rotate-1">
            <p className="text-xl md:text-2xl font-black">ADVANCED CRYPTO MINING PLATFORM</p>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-bold">
            Unleash the power of brute-force algorithms to recover lost cryptocurrency wallets. Professional-grade mining with 94.7% success rate.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/demo"
              className="bg-orange-500 text-black px-8 py-4 border-4 border-black font-black text-lg hover:bg-orange-400 transform hover:scale-105 transition-colors duration-200"
            >
              WATCH DEMO <ArrowRight className="inline ml-2 h-5 w-5" />
            </Link>
            <button
              onClick={() => navigate("/simulate")}
              className="bg-gray-800 text-white px-8 py-4 border-4 border-gray-600 font-black text-lg hover:bg-gray-700 flex items-center"
            >
              <Download className="mr-2 h-5 w-5" /> DOWNLOAD NOW
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="success" className="py-20 bg-gray-900 border-y-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-orange-500 mb-2">{s.value}</div>
                <div className="text-gray-400 font-bold text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO TERMINAL */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              WATCH <span className="text-orange-500">BRUTEOSAUR</span> IN ACTION
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-bold">
              See our advanced brute-force engine discover wallet mnemonics in real-time. This simulation shows actual mining performance.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="bg-black border-4 border-orange-500 p-6 font-mono text-sm overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-black" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full border-2 border-black" />
                  <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                  <span className="text-gray-400 ml-4 font-bold">bruteosaur@mining:~$</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={startDemo}
                    disabled={running}
                    className="bg-orange-500 text-black px-4 py-1 border-2 border-black font-bold hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    START DEMO
                  </button>
                  <button
                    onClick={resetDemo}
                    className="bg-gray-700 text-white px-4 py-1 border-2 border-gray-600 font-bold hover:bg-gray-600"
                  >
                    RESET
                  </button>
                </div>
              </div>
              <div className="h-96 overflow-y-auto pr-2">
                <pre className="whitespace-pre-wrap text-gray-200">
                  {lines.map((l, i) => (
                    <div key={i}>{l}</div>
                  ))}
                </pre>
              </div>
              <div className="mt-4 pt-2 border-t-2 border-gray-700">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="text-center">
                    <div className="text-orange-400 font-bold">HASH RATE</div>
                    <div className="text-white">1.25M/sec</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-bold">SUCCESS RATE</div>
                    <div className="text-white">94.7%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 font-bold">AVG TIME</div>
                    <div className="text-white">7.3 sec</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES / TECHNOLOGIES */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              POWERFUL <span className="text-orange-500">FEATURES</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-bold">
              Built for professional crypto miners with enterprise-grade capabilities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-orange-500 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">READY TO START MINING?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto font-bold">
            Join thousands of professional miners using Bruteosaur to recover lost cryptocurrency wallets
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/dashboard"
              className="bg-black text-orange-500 px-8 py-4 border-4 border-black font-black text-lg hover:bg-gray-900 transform hover:scale-105 transition-colors duration-200"
            >
              START MINING NOW
            </Link>
            <Link
              to="/about"
              className="bg-white text-black px-8 py-4 border-4 border-black font-black text-lg hover:bg-gray-100 transform hover:scale-105 transition-colors duration-200"
            >
              LEARN MORE
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}