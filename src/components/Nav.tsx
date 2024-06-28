"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addresses } from "@/constants/addresses";
import { useAccount } from "wagmi";

export default function Nav() {
  const {chain} = useAccount();
  const [activeTab, setActiveTab] = useState<string>("");

  const testnet = chain?.id !== undefined ? addresses[chain.id]?.testnet : undefined;

  useEffect(() => {
    const storedActiveTab = localStorage.getItem("activeTab");
    if (storedActiveTab) {
      setActiveTab(storedActiveTab);
    }
  }, []);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    localStorage.setItem("activeTab", tabName);
  };
  

  return (
    <header>
      <nav>
        <div className="flex flex-row justify-between">
          <ul className="flex items-center justify-between w-3/5">
            <li>
              <a
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/vifi-logo.PNG"
                  alt="VIFI Logo"
                  className="invert dark:invert-0"
                  width={100}
                  height={24}
                  priority
                />
              </a>
            </li> 
          </ul>
          <div className="flex flex-row items-center">
            {!testnet ? null : (
              <Link
                className={`py-2 px-4 rounded-full border text-white border-gray-500 shadow-lg  bg-[#038240] hover:bg-[#00A651] ${
                  activeTab === "claim"
                    ? "border-green-200 border-2"
                    : "text-gray-500"
                }`}
                href="claim"
              >
                Faucet
              </Link>
            )}
            <w3m-button size="sm" balance="hide" />
            <w3m-network-button />
          </div>
        </div>
      </nav>
    </header>
  );
}
