export const stats = [
  { label: "ACTIVE USERS", value: "1000+" },
  { label: "WALLETS FOUND", value: "50K+" },
  { label: "VALUE RECOVERED", value: "$2.5M" },
  { label: "AVG TIME", value: "7.3s" },
];

export const features = [
  {
    icon: "Cpu",
    title: "BRUTE-FORCE ENGINE",
    description: "Advanced multi-threaded brute-force algorithms for maximum efficiency",
  },
  {
    icon: "Zap",
    title: "HIGH PERFORMANCE",
    description: "1.25M+ combinations per second with GPU acceleration",
  },
  {
    icon: "Shield",
    title: "SECURE MINING",
    description: "Enterprise-grade security with encrypted data handling",
  },
  {
    icon: "TrendingUp",
    title: "94.7% SUCCESS RATE",
    description: "Industry-leading success rate with proven algorithms",
  },
];

export const wallets = [
  { icon: "Wallet", name: "MetaMask", status: "FULL", color: "green" },
  { icon: "Link", name: "WalletConnect", status: "FULL", color: "green" },
  { icon: "WalletMinimal", name: "Coinbase Wallet", status: "FULL", color: "green" },
  { icon: "Shield", name: "Trust Wallet", status: "FULL", color: "green" },
  { icon: "Lock", name: "Ledger", status: "PARTIAL", color: "yellow" },
  { icon: "LockKeyhole", name: "Trezor", status: "PARTIAL", color: "yellow" },
  { icon: "Ghost", name: "Phantom", status: "FULL", color: "green" },
  { icon: "Palette", name: "Rainbow", status: "FULL", color: "green" },
];

export const hardwareTiers = [
  {
    label: "MINIMUM",
    color: "red",
    spec: [
      { k: "CPU", v: "4-core 2.5GHz" },
      { k: "RAM", v: "8GB DDR4" },
      { k: "Storage", v: "100GB SSD" },
      { k: "GPU", v: "Integrated" },
      { k: "Network", v: "10 Mbps" },
    ],
  },
  {
    label: "RECOMMENDED",
    color: "orange",
    spec: [
      { k: "CPU", v: "8-core 3.0GHz" },
      { k: "RAM", v: "16GB DDR4" },
      { k: "Storage", v: "500GB NVMe" },
      { k: "GPU", v: "GTX 1660 / RTX 3060" },
      { k: "Network", v: "50 Mbps" },
    ],
  },
  {
    label: "OPTIMAL",
    color: "green",
    spec: [
      { k: "CPU", v: "16-core 3.5GHz" },
      { k: "RAM", v: "32GB DDR4" },
      { k: "Storage", v: "1TB NVMe" },
      { k: "GPU", v: "RTX 4080 / RTX 4090" },
      { k: "Network", v: "100 Mbps" },
    ],
  },
];

export const osSupport = [
  { name: "Windows 10/11", req: "8GB RAM, 4-core CPU", status: "FULL", color: "green" },
  { name: "macOS 12+", req: "8GB RAM, Intel/M1", status: "FULL", color: "green" },
  { name: "Ubuntu 20.04+", req: "8GB RAM, 4-core CPU", status: "FULL", color: "green" },
  { name: "CentOS 8+", req: "16GB RAM, 8-core CPU", status: "PARTIAL", color: "yellow" },
  { name: "Android 10+", req: "Web browser only", status: "LIMITED", color: "red" },
  { name: "iOS 14+", req: "Safari browser", status: "LIMITED", color: "red" },
];

export const browserSupport = [
  { name: "Chrome", version: "Version 90+", status: "FULL", color: "green" },
  { name: "Firefox", version: "Version 88+", status: "FULL", color: "green" },
  { name: "Safari", version: "Version 14+", status: "PARTIAL", color: "yellow" },
  { name: "Edge", version: "Version 90+", status: "FULL", color: "green" },
  { name: "Opera", version: "Version 76+", status: "FULL", color: "green" },
  { name: "Brave", version: "Version 1.24+", status: "FULL", color: "green" },
];

export const quickSetup = {
  web: [
    "1. Open supported browser",
    "2. Visit bruteosaur.com",
    "3. Connect your wallet",
    "4. Start mining operations",
  ],
  desktop: [
    "1. Download BFGMiner client",
    "2. Install with admin privileges",
    "3. Configure hardware settings",
    "4. Connect to Bruteosaur network",
  ],
};