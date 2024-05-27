"use client";
import CustomTab from "@/components/CustomTab";
import { Card } from "@tremor/react";
import React, { useEffect, useState } from "react";
import VUSD_to_EMC from "@/components/varq/VUSD_to_EMC";
import EMC_to_VUSD from "@/components/varq/EMC_to_VUSD";
import VARQ_CONTRACT from "../../contracts/varq.json";
import VTOKEN_CONTRACT from "../../contracts/vtoken.json";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { VRT_ADDRESS, VTTD_ADDRESS, VUSD_ADDRESS } from "@/constants/addresses";
import { formatEther } from "viem";

export default function Varq() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<string>("deposit");
  const [formattedVUSDBalance, setFormattedVUSDBalance] = useState("");
  const [formattedVRTBalance, setFormattedVRTBalance] = useState("");
  const [formattedVTTDBalance, setFormattedVTTDBalance] = useState("");

  const { data: vUSD_balance, refetch: refresh_vusd_balance } = useReadContract(
    {
      abi: VTOKEN_CONTRACT,
      address: VUSD_ADDRESS,
      functionName: "balanceOf",
      args: [address],
    }
  );
  const { data: vTTD_balance, refetch: refresh_vttd_balance } = useReadContract(
    {
      abi: VTOKEN_CONTRACT,
      address: VTTD_ADDRESS,
      functionName: "balanceOf",
      args: [address],
    }
  );
  const { data: vRT_balance, refetch: refresh_vrt_balance } = useReadContract({
    abi: VTOKEN_CONTRACT,
    address: VRT_ADDRESS,
    functionName: "balanceOf",
    args: [address],
  });

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    if (vUSD_balance !== undefined && vUSD_balance !== null) {
      const formatted_vusdc_balance = formatEther(BigInt(Number(vUSD_balance)));
      setFormattedVUSDBalance(formatted_vusdc_balance.toString());
    }
    if (vTTD_balance !== undefined && vTTD_balance !== null) {
      const formatted_vttd_balance = formatEther(BigInt(Number(vTTD_balance)));
      setFormattedVUSDBalance(formatted_vttd_balance.toString());
    }
    if (vRT_balance !== undefined && vRT_balance !== null) {
      const formatted_vrt_balance = formatEther(BigInt(Number(vRT_balance)));
      setFormattedVUSDBalance(formatted_vrt_balance.toString());
    }
  }, [vUSD_balance, vRT_balance, , vTTD_balance, address]);

  const refreshBalances = () => {
    refresh_vusd_balance();
    refresh_vttd_balance();
    refresh_vrt_balance();
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-6 lg:pt-12">
      <Card className="max-w-md mx-auto rounded-3xl lg:mt-0 mt-14 bg-background">
        <div className="justify-center flex mb-6">
          <CustomTab
            label="USD to EMC"
            isActive={activeTab === "deposit"}
            onClick={() => handleTabChange("deposit")}
          />
          <CustomTab
            label="EMC to USD"
            isActive={activeTab === "withdraw"}
            onClick={() => handleTabChange("withdraw")}
          />
        </div>
        <div>
          {activeTab === "deposit" && (
            <div>
              <VUSD_to_EMC refreshBalance={refreshBalances} />
            </div>
          )}
          {activeTab === "withdraw" && (
            <div>
              <EMC_to_VUSD refreshBalance={refreshBalances}/>
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
