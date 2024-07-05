"use client";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { sepolia, baseSepolia } from "viem/chains";

// Get projectId at https://cloud.walletconnect.com
export const projectId =
  process.env.NEXT_PUBLIC_PROJECT_ID || "d7d3e7d3b57f91f53b714a8b73b02ccc";

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Virtual Finance",
  description: "Stablecoins for Frontier Currencies",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
const chains = [sepolia, baseSepolia ] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  syncConnectedChain: true,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});