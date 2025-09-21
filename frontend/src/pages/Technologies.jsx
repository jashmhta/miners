import React from "react";
import Reveal from "../components/Reveal";
import { Cpu, Shield, Zap, Gauge, Server, Network, Wrench } from "lucide-react";

const tech = [
  { icon: Cpu, title: "GPU Acceleration", desc: "Optimized CUDA / Metal kernels driving 1.25M+ combos/sec" },
  { icon: Shield, title: "Encrypted Pipelines", desc: "Zero-copy, encrypted memory and disk I/O" },
  { icon: Zap, title: "Parallelism", desc: "Multi-threaded brute-force with adaptive batching" },
  { icon: Server, title: "Distributed Nodes", desc: "Scale out across rigs with resilient job queues" },
  { icon: Gauge, title: "Telemetry", desc: "Real-time metrics and auto-tuning for best hash rate" },
  { icon: Network, title: "Cross-Chain", desc: "Wallet formats across BTC/ETH/SOL and EVM-compatible chains" },
  { icon: Wrench, title: "Plugin SDK", desc: "Extend recoverers via lightweight WASM plugins" },
];

export default function Technologies() {
  return (
    <div className="min-h-[75vh] bg-black text-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">Technologies</h1>
          <p className="text-gray-400 font-bold max-w-2xl mx-auto">Deep optimizations across hardware and software stack to deliver professional-grade performance.</p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tech.map((t, i) => (
            <Reveal key={t.title} delay={i*80}>
              <div className="bg-gray-900 border-4 border-gray-700 hover:border-orange-500 p-6 h-full">
                <div className="bg-orange-500 inline-block p-2 border-2 border-black text-black mb-4">
                  <t.icon className="h-7 w-7" />
                </div>
                <h3 className="font-black text-xl mb-2">{t.title}</h3>
                <p className="text-gray-400 font-bold">{t.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={400} className="mt-12">
          <div className="bg-black border-4 border-orange-500 p-6 font-mono text-sm overflow-x-auto">
            <div className="text-gray-300">$ bfgminer -o stratum+tcp://pool:3333 -O user:pass --gpu-threads 4 --intensity 19</div>
            <div className="text-green-400">[ok] engine online • telemetry streaming</div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}