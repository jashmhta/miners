import React, { useEffect } from "react";
import { Download } from "lucide-react";

export default function DownloadGuide() {
  useEffect(() => {
    // Simulate BFGMiner zip download (mock)
    const a = document.createElement("a");
    a.href = "https://github.com/luke-jr/bfgminer/archive/refs/heads/master.zip";
    a.download = "bfgminer.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  return (
    <div className="min-h-[75vh] bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black mb-6 text-center">Download started</h1>
        <div className="bg-gray-900 border-4 border-gray-700 p-6">
          <div className="flex items-center gap-3 text-orange-500 font-black">
            <Download className="h-6 w-6" /> BFGMiner archive is downloading...
          </div>
          <ol className="list-decimal mt-6 space-y-2 text-gray-300 font-bold ml-6">
            <li>Unzip the archive to a preferred directory.</li>
            <li>Install dependencies for your OS (see README inside).</li>
            <li>Configure your hardware settings as per Compatibility.</li>
            <li>Run the mining command from terminal: <span className="text-white">./bfgminer -o stratum+tcp://pool:3333 -O user:pass</span></li>
            <li>Monitor the hash rate and logs.</li>
          </ol>
          <p className="text-xs text-gray-500 mt-4">Refer to the official BFGMiner docs for OS-specific flags and driver notes.</p>
        </div>
      </div>
    </div>
  );
}