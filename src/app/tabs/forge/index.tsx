"use client";
import Image from "next/image";
import CustomTab from "@/components/CustomTab";
import { Card } from "@tremor/react";
import React, { useEffect, useState } from "react";
import VUSD_to_EMC from "./VUSD_to_EMC";
import EMC_to_VUSD from "./EMC_to_VUSD";
import VARQ_CONTRACT from "@/contracts/varq.json";
import VTOKEN_CONTRACT from "@/contracts/vtoken.json";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";
import { addresses } from "@/constants/addresses";
import { formatEther } from "viem";

export default function Varq() {
  const chainId = getChainId(config);
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<string>("deposit");

  const { data: vUSD_balance, refetch: refresh_vusd_balance } = useReadContract(
    {
      abi: VTOKEN_CONTRACT,
      address: addresses[chainId]["vusd"],
      functionName: "balanceOf",
      args: [address],
    }
  );
  const { data: vTTD_balance, refetch: refresh_vttd_balance } = useReadContract(
    {
      abi: VTOKEN_CONTRACT,
      address: addresses[chainId]["vttd"],
      functionName: "balanceOf",
      args: [address],
    }
  );
  const { data: vRT_balance, refetch: refresh_vrt_balance } = useReadContract({
    abi: VTOKEN_CONTRACT,
    address: addresses[chainId]["vrt"],
    functionName: "balanceOf",
    args: [address],
  });

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  const refreshBalances = () => {
    refresh_vusd_balance();
    refresh_vttd_balance();
    refresh_vrt_balance();
  };

  const vRT_balance_number = vRT_balance ? Number(vRT_balance) : 0;
  const vTTD_balance_number = vTTD_balance ? Number(vTTD_balance) : 0;
  const vUSD_balance_number = vUSD_balance ? Number(vUSD_balance) : 0;

  return (
    <div className="flex items-center flex-col flex-grow pt-6">
      <Card className="max-w-md mx-auto rounded-3xl lg:mt-0 mt-14 bg-background">
        <div className="flex flex-row items-center justify-between pb-4">
          <div className="flex flex-row items-center">
            <Image
              src="/forge-logo.svg"
              alt="forge-logo"
              width={58}
              height={58}
              priority
            />
            <h1 className="ml-2 text-[#00A651] lg:text-3xl font-bold">Forge</h1>
          </div>

          <Image
            src="/settings_icon.svg"
            alt="settings icon"
            width={32}
            height={32}
            priority
          />
        </div>
        <div className="justify-left flex px-2">
          <CustomTab
            label="USD to TTD"
            isActive={activeTab === "deposit"}
            onClick={() => handleTabChange("deposit")}
          />
          <CustomTab
            label="TTD to USD"
            isActive={activeTab === "withdraw"}
            onClick={() => handleTabChange("withdraw")}
          />
        </div>
        <div>
          {activeTab === "deposit" && (
            <div>
              <VUSD_to_EMC
                refreshBalance={refreshBalances}
                balance={vUSD_balance_number}
              />
            </div>
          )}
          {activeTab === "withdraw" && (
            <div>
              <EMC_to_VUSD
                refreshBalance={refreshBalances}
                balance={vRT_balance_number}
              />
            </div>
          )}
        </div>
        {address && (
          <div className="p-2 flex flex-col w-full">
            <div className="flex justify-center">
              <h1 className="mt-4 mb-2">Balance:</h1>
            </div>
            <div className="flex flex-row justify-between">
              <h1>vUSD: {(Number(vUSD_balance) / 10 ** 18).toFixed(2)}</h1>
              <h1>vTTD: {(Number(vTTD_balance) / 10 ** 18).toFixed(2)}</h1>
              <h1>vRT: {(Number(vRT_balance) / 10 ** 18).toFixed(2)}</h1>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
