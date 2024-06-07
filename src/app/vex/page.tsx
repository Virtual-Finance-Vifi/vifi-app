"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useWaitForTransactionReceipt,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { parseEther } from "viem";
import { toast } from "sonner";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import MUSD_CONTRACT from "../../contracts/mUSD.json";
import VEX_CONTRACT from "../../contracts/vex.json";
import { Card, Tab, TabGroup, TabList, TabPanels } from "@tremor/react";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import InputComponent from "@/components/InputWidget";
import UnifiedInput from "@/components/UnifiedValueInput";
import { MUSD_ADDRESS,VEX_ADDRESS } from "@/constants/addresses";

export default function Vex() {
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const [vUSD, setVUSD] = useState<number>(0);

  const [vTTD, setVTTD] = useState<number>(0);
  const [swap, setSwap] = useState<boolean>(false);

  const handleConnect = () => {
    open();
  };
  const handleSwap = () => {
    setSwap(!swap);
  };
  const { data: name } = useReadContract({
    address: MUSD_ADDRESS,
    abi: MUSD_CONTRACT,
    functionName: "name",
  });
  const { writeContract, error } = useWriteContract();
  const transfer_vUSD = parseEther(vUSD.toString());
  const handleVUSDtoVTTD=()=>{
    writeContract({
      abi: VEX_CONTRACT,
      address: VEX_ADDRESS,
      functionName: "swapVexIn",
      args: [transfer_vUSD],
    });
    console.log("transferring");
    console.log(error);
  };

  return (
    <main>
      <section className="py-12 flex flex-col items-center text-center gap-8">
        <h1 className="text-4xl font-bold">Swap</h1>
      </section>

      <Card className="max-w-md mx-auto rounded-3xl lg:mt-0 mt-14 bg-background">
        {swap ? (
          <>
            <UnifiedInput
              type="receive"
              label="vTTD"
              value={vTTD}
              setValue={setVTTD}
            />
            <div className="flex justify-center mb-2" onClick={handleSwap}>
              <button className="btn btn-accent hover:bg-secondary p-2 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                  />
                </svg>
              </button>
            </div>
            <UnifiedInput
              type="pay"
              label="vUSDC"
              value={vUSD}
              setValue={setVUSD}
            />
          </>
        ) : (
          <>
            <UnifiedInput
              type="pay"
              label="vUSDC"
              value={vUSD}
              setValue={setVUSD}
            />
            <div className="flex justify-center mb-2" onClick={handleSwap}>
              <button className="btn btn-accent hover:bg-secondary p-2 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                  />
                </svg>
              </button>
            </div>
            <UnifiedInput
              type="receive"
              label="vTTD"
              value={vTTD}
              setValue={setVTTD}
            />
          </>
        )}

        <div className="flex justify-center">
          {!isConnected ? (
            <Button onClick={handleConnect}>Connect Wallet</Button>
          ) : (
            <>
              <Button className="rounded-2xl px-6" onClick={handleVUSDtoVTTD}>Convert</Button>
            </>
          )}
        </div>
      </Card>
    </main>
  );
}
