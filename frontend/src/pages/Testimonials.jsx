import React from "react";
import Reveal from "../components/Reveal";

const items = [
  { name:"Elena R.", role:"Security Researcher", quote:"Recovered a lost ETH wallet in minutes. Beautiful interface and powerful engine."},
  { name:"Marcus L.", role:"Pro Miner", quote:"Compatibility matrix saved hours. Mining dashboards are clean and fast."},
  { name:"Ai Tanaka", role:"DevOps Engineer", quote:"Loved the sci‑fi terminal and the setup guide. Seamless onboarding."},
];

export default function Testimonials(){
  return (
    <div className="min-h-[70vh] bg-black text-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal className="text-center mb-12">
          <h1 className="text-5xl font-black mb-2">Testimonials</h1>
          <p className="text-gray-400 font-bold">Trusted by professionals worldwide</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t,i)=> (
            <Reveal key={t.name} delay={i*100}>
              <div className="bg-gray-900 border-4 border-gray-700 p-6 h-full">
                <p className="text-gray-300 italic">“{t.quote}”</p>
                <div className="mt-4 font-black">{t.name}</div>
                <div className="text-gray-500 text-sm">{t.role}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}