import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { stats, features } from "../mock";
import { Cpu, Zap, Shield, TrendingUp, Download, ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal";

const ICONS = { Cpu, Zap, Shield, TrendingUp };
const HERO_VIDEO = "/assets/hero.mp4"; // moved to local assets

export default function Home() {
  const navigate = useNavigate();

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
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate("/simulate")}
              className="bg-orange-500 text-black px-8 py-4 border-4 border-black font-black text-lg hover:bg-orange-400 transform hover:scale-105 transition-colors duration-200"
            >
              START DEMO <ArrowRight className="inline ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => navigate("/simulate")}
              className="bg-gray-800 text-white px-8 py-4 border-4 border-gray-600 font-black text-lg hover:bg-gray-700 flex items-center"
            >
              <Download className="mr-2 h-5 w-5" /> DOWNLOAD NOW
            </button>
          </div>
        </div>
      </section>

      <section id="success" className="py-20 bg-gray-900 border-y-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i*50}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-orange-500 mb-2">{s.value}</div>
                  <div className="text-gray-400 font-bold text-sm">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              POWERFUL <span className="text-orange-500">FEATURES</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i*80}>
                <FeatureCard icon={f.icon} title={f.title} description={f.description} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-10">
            <h2 className="text-4xl font-black">What miners say</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              name: "Elena R.", quote: "Recovered a lost ETH wallet in minutes. The UI is gorgeous and performance is unreal.", role: "Security Researcher"
            },{
              name: "Marcus L.", quote: "Compatibility matrix saved hours. Mining dashboards are clean and fast.", role: "Pro Miner"
            },{
              name: "Ai Tanaka", quote: "Loved the terminal animation and the step-by-step setup guide.", role: "DevOps Engineer"
            }].map((t,i)=> (
              <Reveal key={t.name} delay={i*80}>
                <div className="bg-gray-900 border-4 border-gray-700 p-6">
                  <p className="text-gray-300 italic">“{t.quote}”</p>
                  <div className="mt-4 font-black text-white">{t.name}</div>
                  <div className="text-gray-500 text-sm">{t.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-orange-500 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">READY TO START MINING?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate("/simulate")}
              className="bg-black text-orange-500 px-8 py-4 border-4 border-black font-black text-lg hover:bg-gray-900 transform hover:scale-105 transition-colors duration-200"
            >
              START MINING NOW
            </button>
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