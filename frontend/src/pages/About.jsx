import React from "react";
import Reveal from "../components/Reveal";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_bruteosaur-copy/artifacts/2xlf2dip_1758496554596.jpg";

export default function About(){
  return (
    <div className="min-h-[80vh] bg-black text-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <img src={LOGO_URL} alt="Bruteosaur" className="w-40 h-40 object-cover rounded shadow-lg border-4 border-orange-500"/>
          <div>
            <h1 className="text-5xl font-black mb-4">About Bruteosaur</h1>
            <p className="text-gray-300 font-bold">We build professional-grade recovery and mining tooling for crypto-native users and enterprises. Our platform combines high-performance compute with modern UX to make wallet recovery transparent, measurable, and fast.</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{
            t:"Mission",d:"Empower legitimate owners to regain access to lost wallets with reliable, auditable technology."
          },{
            t:"Values",d:"Security first, zero data retention, verifiable results, and honest metrics."
          },{
            t:"Roadmap",d:"Upcoming: multi-chain balance proofs, automated case audit trails, and desktop rig orchestrator."
          }].map((c,i)=> (
            <Reveal key={c.t} delay={i*80}>
              <div className="bg-gray-900 border-4 border-gray-700 p-6 h-full">
                <h3 className="font-black text-xl mb-2">{c.t}</h3>
                <p className="text-gray-400 font-bold">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={300} className="mt-12">
          <div className="bg-black border-4 border-orange-500 p-6">
            <h3 className="font-black text-xl mb-2">Contact</h3>
            <p className="text-gray-300 font-bold">Looking to collaborate or request a recovery? Reach us at team@bruteosaur.example (placeholder) and we will follow up with secure onboarding.</p>
          </div>
        </Reveal>
      </section>
    </div>
  )
}