"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { toast } from "sonner";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Claim from "./claim/page";

import { Markets, Forge, Swap, Virtualizer } from "./tabs";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("Swap");
  const { isConnected } = useAccount();
  const { signMessage } = useSignMessage();
  const { sendTransaction, data: hash } = useSendTransaction();
  const { open } = useWeb3Modal();
  const handleConnect = () => {
    open();
  };
  
  const tabs = [
    { id: "Swap", label: "Swap", logo: "/swap-logo.svg" },
    { id: "Virtualizer", label: "Virtualizer", logo: "/virtualizer-logo.svg" },
    { id: "Forge", label: "Forge", logo: "/forge-logo.svg" },
    { id: "Markets", label: "Markets", logo: "/amm-logo.svg" },
  ];

  return (
    <main>
      {!isConnected ? (
        <>
          <section className="py-12 flex flex-col items-center text-center gap-8">
            <h1 className="text-4xl font-bold">Virtual Finance</h1>
            <p className="text-2xl text-muted-foreground max-w-80">
              ViFi is a synthetic USD-backed stablecoin protocol that mints Frontier Currency Tokens that capture USD parallel market value
            </p>
            <p className="text-2xl text-muted-foreground max-w-80">
              Connect your wallet to get started.
            </p>
            <Button className="bg-vifigreen w-140 mt-5 font-semibold hover:bg-vifigreenlight text-lg rounded-full" onClick={handleConnect}>Connect Wallet</Button>
          </section>
        </>
      ) : (
        <>
          <section className="py-6 flex flex-col">
            <div className="flex gap-6 items-center justify-center">
              <div className="font-semibold text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 px-4 mx-12 text-center focus:outline-none ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
                        : "border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    }`}
                  >
                    <div className="flex flex-row gap-4 items-center">
                      <Image
                        src={tab.logo}
                        alt="virtualizer-logo"
                        width={32}
                        height={32}
                        priority
                      />
                      {tab.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
          <section>
            <div className="p-4">
              {activeTab === "Virtualizer" && <Virtualizer />}
              {activeTab === "Swap" && <Swap />}
              {activeTab === "Forge" && <Forge />}
              {activeTab === "Markets" && <Markets />}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
