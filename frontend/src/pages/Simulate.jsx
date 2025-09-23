import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const WORDS = [
  "abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse","access","accident","account","accuse","achieve","acoustic","acquire","across","action","actor","actual","adapt","address","adjust","admit","adult","advance","advice","afford","again","agent","agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert","alien","alpha","alter","always","amazing","amount","anchor","ancient","anger","animal"
];

const mk = (el, cls = "") => <pre className={`whitespace-pre-wrap text-sm font-mono ${cls}`}>{el}</pre>;

export default function Simulate() {
  const [logs, setLogs] = useState([]);
  const [mnems, setMnems] = useState([]);
  const navigate = useNavigate();
  const timeouts = useRef([]);

  useEffect(() => {
    const q = (fn, t) => timeouts.current.push(setTimeout(fn, t));
    const push = (node) => setLogs((l) => [...l, node].slice(-400));

    // 0-7000ms storyline (Linux-like, sci‑fi vibe)
    q(() => push(mk("$ sudo bfgminer --init", "text-gray-300")), 50);
    q(() => push(mk("[ok] kernel: modules loaded", "text-green-400")), 350);
    q(() => push(mk("gpu0: NVIDIA RTX 4090 • driver 555.85", "text-blue-400")), 650);
    q(() => push(mk("cpu: 16 cores • AES-NI ON", "text-blue-400")), 850);
    q(() => push(mk("$ netctl up mining-net", "text-gray-300")), 950);
    q(() => push(mk("[ok] network online @ 1Gbps", "text-green-400")), 1200);

    // hash rate bursts
    for (let i = 0; i < 8; i++) {
      q(() => {
        const rate = (1200000 + Math.floor(Math.random() * 200000)).toLocaleString();
        push(mk(`hashrate ${rate}/sec • searching entropy …`, "text-gray-200"));
      }, 1300 + i * 500);
    }

    // mnemonic collection
    for (let i = 0; i < 12; i++) {
      q(() => {
        const w = WORDS[Math.floor(Math.random() * WORDS.length)];
        setMnems((m) => [...m, w]);
      }, 1400 + i * 420);
    }

    // Result & redirect
    q(() => push(mk("congratulations 🎊 $250 wallet found (simulation)", "text-green-400")), 6000);
    q(() => push(mk("$ result: matching entropy located", "text-green-400")), 6400);
    q(() => navigate("/auth"), 7000);

    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, [navigate]);

  return (
    <div className="min-h-[80vh] bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-black border-4 border-orange-500 rounded">
          <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-gray-700">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-black" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-black" />
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
            <span className="ml-3 text-gray-400 font-bold">Terminal</span>
          </div>
          <div className="grid md:grid-cols-3">
            <div className="md:col-span-2 p-6 font-mono h-[420px] overflow-y-auto bg-[#0b0b0b]">
              {logs.map((n, i) => (
                <div key={i} className="leading-6">{n}</div>
              ))}
              <div className="type-cursor h-4" />
            </div>
            <div className="border-l-2 border-gray-700 p-6">
              <div className="text-gray-400 font-bold mb-2">CANDIDATE MNEMONICS</div>
              <div className="flex flex-wrap gap-2">
                {mnems.map((w, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-800 border-2 border-gray-600 text-orange-400 font-mono text-xs rounded">{w}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-4">Redirecting to registration …</div>
      </div>
    </div>
  );
}