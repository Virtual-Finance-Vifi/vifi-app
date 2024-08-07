"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addresses } from "@/constants/addresses";
import { useAccount, useReadContract } from "wagmi";
import { Button } from "./ui/button";
import ClaimModal from "@/components/ClaimModal";
import MUSD_CONTRACT from "@/contracts/mUSD.json";
import { useBalance } from "@/contexts/Balance";

export default function Nav() {
  const { chain, address } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { refreshBalance } = useBalance();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const testnet =
    chain?.id !== undefined ? addresses[chain.id]?.testnet : undefined;

  return (
    <header>
      <nav>
        <div className="flex flex-row justify-between">
          <ul className="flex items-center w-3/5">
            <li>
              <a
                className="pointer-events-none flex place-items-center gap-2 p-2 md:p-8 lg:pointer-events-auto lg:p-0"
                href="/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/virtual-finance-logo-white.png"
                  alt="VIFI Logo"
                  width={50}
                  height={12}
                  priority
                  className="md:w-[110px] md:h-[110px]"
                />
              </a>
            </li>
          </ul>
          <div className="flex flex-row items-center">
            {!testnet ? null : (
              <Button
                onClick={() => openModal()}
                className="px-4 rounded-full border text-white border-gray-500 shadow-lg  bg-[#038240] hover:bg-[#00A651] active:border-green-200"
              >
                Faucet
              </Button>
            )}
            <ClaimModal
              isOpen={isModalOpen}
              onClose={() => {
                closeModal();
                refreshBalance();
              }}
            >
              <h1>
                When using ViFi on a testnet, we have provided a Mock USDC
                Faucet that you can use to swap for any of our supported tokens
              </h1>
            </ClaimModal>
            <w3m-button balance="hide" />
            <div className="hidden sm:block px-2"></div>
            <div className="hidden sm:block">
              <w3m-network-button />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
