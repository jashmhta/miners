import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const bip39 = ["abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse","access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act","action","actor","actress","actual","adapt","add","addict","address","adjust","admit","adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent","agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert","alien","all","alley","allow","almost","alone","alpha","already","also","alter","always","amateur","amazing","among","amount","amused","analyst","anchor","ancient","anger","angle","angry","animal","ankle","announce","annual","another","answer","antenna","antique","anxiety","any","apart","apology","appear","apple","approve","april","arch","arctic","area","arena","argue","arm","armed","armor","army","around","arrange","arrest","arrive","arrow","art","artefact","artist","artwork","ask","aspect","assault","asset","assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction","audit"]; 

export default function Simulate() {
  const [logs, setLogs] = useState([]);
  const [mnemonics, setMnemonics] = useState([]);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    const start = Date.now();
    const push = (t) => setLogs((l) => [...l, t].slice(-300));
    push("$ initializing mining kernel\n");

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const rate = (1200000 + Math.floor(Math.random() * 100000)).toLocaleString();
      push(`$ hash-rate ${rate}/sec  • scanning ...`);
      if (mnemonics.length < 12) setMnemonics((m) => [...m, bip39[Math.floor(Math.random()*bip39.length)]]);
      if (elapsed >= 7) {
        clearInterval(timerRef.current);
        push("\n$ result: matching entropy located\n");
        setTimeout(() => navigate("/auth"), 800);
      }
    }, 450);

    return () => clearInterval(timerRef.current);
  }, [navigate, mnemonics.length]);

  return (
    <div className="min-h-[80vh] bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-black border-4 border-orange-500">
          <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-gray-700">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-black" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-black" />
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
            <span className="ml-3 text-gray-400 font-bold">Terminal</span>
          </div>
          <div className="grid md:grid-cols-3">
            <div className="md:col-span-2 p-6 font-mono text-sm h-[420px] overflow-y-auto bg-[#0b0b0b]">
              {logs.map((l, i) => (
                <pre key={i} className="text-gray-100"><code>{l}</code></pre>
              ))}
            </div>
            <div className="border-l-2 border-gray-700 p-6">
              <div className="text-gray-400 font-bold mb-2">CANDIDATE MNEMONICS</div>
              <div className="flex flex-wrap gap-2">
                {mnemonics.map((w, i) => (
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