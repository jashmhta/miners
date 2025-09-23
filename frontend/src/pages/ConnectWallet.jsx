import React, { useState } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Use real brand marks hosted from their official assets/CDNs where allowed
const logos = {
  metamask: "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg",
  walletconnect: "https://walletconnect.com/_next/static/media/walletconnect-logo.ebb49b51.svg",
  trust: "https://assets.trustwallet.com/assets/images/media/assets/TWT.png",
  coinbase: "https://avatars.githubusercontent.com/u/1885080?s=200&v=4",
  rainbow: "https://avatars.githubusercontent.com/u/52051690?s=200&v=4",
  phantom: "https://avatars.githubusercontent.com/u/78782331?s=200&v=4",
};

const providers = [
  { key: "metamask", name: "MetaMask", url: "https://metamask.io/", logo: logos.metamask },
  { key: "walletconnect", name: "WalletConnect", url: "https://walletconnect.com/", logo: logos.walletconnect },
  { key: "trust", name: "Trust Wallet", url: "https://trustwallet.com/", logo: logos.trust },
  { key: "coinbase", name: "Coinbase Wallet", url: "https://www.coinbase.com/wallet", logo: logos.coinbase },
  { key: "rainbow", name: "Rainbow", url: "https://rainbow.me/", logo: logos.rainbow },
  { key: "phantom", name: "Phantom", url: "https://phantom.app/", logo: logos.phantom },
];

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ConnectWallet() {
  const [method, setMethod] = useState("providers");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const tryProvider = (p) => {
    window.open(p.url, "_blank");
    toast({ title: `Opened ${p.name}`, description: "Complete the signature in the wallet window. If it fails, use Manual Connection." });
  };

  const validateManual = async () => {
    const a = address.trim();
    if (!a || a.length < 4) {
      toast({ title: "Invalid input", description: "Enter a valid wallet address (0x...)." });
      return;
    }
    try {
      setLoading(true);
      const resp = await axios.post(`${API}/wallet/check-balance`, { address: a });
      if (resp?.data?.status === "validated") {
        toast({ title: "Wallet validated", description: `Balance: ${resp.data.balance} ETH` });
        sessionStorage.setItem("walletConnected", "true");
        navigate("/download-guide");
      }
    } catch (e) {
      const msg = e?.response?.data?.detail || "Validation failed";
      toast({ title: "Error", description: String(msg) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black mb-6 text-center">Connect your wallet</h1>
        <div className="bg-gray-900 border-4 border-gray-700">
          <div className="flex">
            <button onClick={()=>setMethod("providers")} className={`flex-1 px-4 py-3 font-black border-b-4 ${method==="providers"?"border-orange-500 bg-black":"border-transparent bg-gray-800"}`}>Providers</button>
            <button onClick={()=>setMethod("manual")} className={`flex-1 px-4 py-3 font-black border-b-4 ${method==="manual"?"border-orange-500 bg-black":"border-transparent bg-gray-800"}`}>Manual Connection</button>
          </div>
          {method === "providers" ? (
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
              {providers.map((p) => (
                <button key={p.key} onClick={() => tryProvider(p)} className="bg-gray-800 border-2 border-gray-600 hover:border-orange-500 p-6 text-center rounded">
                  <img src={p.logo} alt={p.name} className="h-10 w-10 mx-auto mb-3 object-contain" />
                  <div className="font-black">{p.name}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <p className="text-gray-400 font-bold mb-3">If provider connection fails, enter your wallet address to verify balance.</p>
              <Input value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="0xYourWalletAddress" className="bg-black border-gray-700 text-white" />
              <Button disabled={loading} onClick={validateManual} className="mt-4 bg-orange-500 text-black border-2 border-black font-black hover:bg-orange-400">{loading ? "Checking…" : "Validate & Continue"}</Button>
              <p className="text-xs text-gray-500 mt-2">Never share seed phrases or private keys. We will never ask for them.</p>
            </div>
          )}
        </div>
        <p className="text-center text-gray-400 mt-6">Secure connection for mining operations.</p>
      </div>
    </div>
  );
}