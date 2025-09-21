import React from "react";
import Reveal from "../components/Reveal";

export default function Success() {
  return (
    <div className="min-h-[75vh] bg-black text-white">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">Success Rate</h1>
          <p className="text-gray-400 font-bold">Field-proven recovery rates with transparent methodology.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{k:"Overall",v:"94.7%"},{k:"ETH",v:"92.1%"},{k:"BTC",v:"96.8%"}].map((s,i)=> (
            <Reveal key={s.k} delay={i*100}>
              <div className="bg-gray-900 border-4 border-gray-700 p-6 text-center">
                <div className="text-orange-500 text-4xl font-black mb-2">{s.v}</div>
                <div className="text-gray-400 font-bold">{s.k}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={350} className="mt-10">
          <div className="bg-black border-4 border-orange-500 p-6">
            <h3 className="font-black text-xl mb-2">Methodology</h3>
            <p className="text-gray-300 font-bold">Success rates are measured on consenting customer datasets with reproducible parameters and verified balances. Performance varies by entropy, device, and chain congestion.</p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}