import React from "react";
import { wallets, hardwareTiers, osSupport, browserSupport, quickSetup } from "../mock";
import { Monitor, Settings, Download } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const Badge = ({ color = "green", children }) => {
  const palette = {
    green: "bg-green-500 text-black",
    yellow: "bg-yellow-500 text-black",
    red: "bg-red-500 text-white",
  };
  return (
    <span className={`px-3 py-1 border-2 border-black font-black text-sm ${palette[color]}`}>{children}</span>
  );
};

export default function Compatibility() {
  const { toast } = useToast();

  const runSystemCheck = () => {
    const ua = navigator.userAgent;
    const isChrome = /Chrome\//.test(ua) && !/Edge\//.test(ua);
    const memory = navigator.deviceMemory || "8";
    toast({
      title: "System Check (mock)",
      description: `Browser: ${isChrome ? "Chrome" : "Other"} • RAM: ${memory}GB • Status: ${isChrome ? "FULL" : "PARTIAL"}`,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-6">
            <span className="text-orange-500">UNIVERSAL</span>
            <br />
            COMPATIBILITY
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-bold">
            Bruteosaur works seamlessly across all major platforms, wallets, and devices. Check your system compatibility below.
          </p>
        </div>

        {/* Supported Wallets */}
        <div className="mb-16">
          <h2 className="text-4xl font-black mb-8 text-center">SUPPORTED WALLETS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {wallets.map((w) => (
              <div key={w.name} className="bg-gray-800 border-[3px] border-gray-600 p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  {/* Using lucide icons to avoid emojis */}
                  <w.icon className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="font-black text-white mb-2">{w.name}</h3>
                <Badge color={w.color}>{w.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Hardware Requirements */}
        <div className="mb-16">
          <h2 className="text-4xl font-black mb-8 text-center">HARDWARE REQUIREMENTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hardwareTiers.map((t) => (
              <div key={t.label} className={`bg-gray-800 border-[3px] p-6 border-${t.color}-500`}>
                <h3 className={`text-2xl font-black mb-6 text-${t.color}-500 text-center`}>{t.label}</h3>
                <div className="space-y-4">
                  {t.spec.map((s) => (
                    <div key={s.k} className="flex items-center justify-between">
                      <span className="text-gray-400 font-bold">{s.k}:</span>
                      <span className="text-white font-bold">{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Systems */}
        <div className="mb-16">
          <h2 className="text-4xl font-black mb-8 text-center">OPERATING SYSTEMS</h2>
          <div className="bg-gray-800 border-[3px] border-gray-600 p-8">
            <div className="space-y-4">
              {osSupport.map((o) => (
                <div key={o.name} className="flex items-center justify-between bg-gray-900 border-2 border-gray-700 p-4">
                  <div className="flex items-center space-x-4">
                    <Monitor className="h-6 w-6 text-orange-500" />
                    <span className="font-black text-white">{o.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400 font-bold">{o.req}</span>
                    <Badge color={o.color}>{o.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Browser Support */}
        <div className="mb-16">
          <h2 className="text-4xl font-black mb-8 text-center">BROWSER SUPPORT</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {browserSupport.map((b) => (
              <div key={b.name} className="bg-gray-800 border-[3px] border-gray-600 p-6 text-center">
                <h3 className="font-black text-white mb-2">{b.name}</h3>
                <p className="text-gray-400 font-bold mb-3">{b.version}</p>
                <Badge color={b.color}>{b.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Setup */}
        <div className="bg-gray-800 border-[3px] border-gray-600 p-8">
          <h2 className="text-3xl font-black mb-8 text-center">QUICK SETUP GUIDE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-black mb-4 text-orange-500">WEB PLATFORM</h3>
              <ol className="space-y-3 text-gray-300 font-bold">
                {quickSetup.web.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-black mb-4 text-orange-500">DESKTOP CLIENT</h3>
              <ol className="space-y-3 text-gray-300 font-bold">
                {quickSetup.desktop.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="text-center mt-8">
            <button onClick={() => toast({ title: "Downloading...", description: "Client download started (mock)" })} className="bg-orange-500 text-black px-8 py-3 border-[3px] border-black font-black hover:bg-orange-400 mr-4">
              <Download className="inline h-5 w-5 mr-2" />
              DOWNLOAD CLIENT
            </button>
            <button onClick={runSystemCheck} className="bg-blue-500 text-white px-8 py-3 border-[3px] border-black font-black hover:bg-blue-400">
              <Settings className="inline h-5 w-5 mr-2" />
              SYSTEM CHECK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}