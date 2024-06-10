"use client";
import { Card } from "@tremor/react";
import React, { useEffect, useState } from "react";
import CustomTab from "@/components/CustomTab";
import DepositWidget from "@/components/virtualizer/DepositWidget";
import WithdrawWidget from "@/components/virtualizer/WithdrawWidget";
import { useAccount, useReadContract } from "wagmi";
import MUSD_CONTRACT from "../../contracts/mUSD.json";
import VUSD_CONTRACT from "../../contracts/vtoken.json";
import { MUSD_ADDRESS, VUSD_ADDRESS } from "@/constants/addresses";
import { formatEther } from "viem";

export default function Virtualizer() {
  const [activeTab, setActiveTab] = useState<string>("deposit");
  const { address } = useAccount();

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  const { data: mUSDC_balance, refetch: refresh_musdc_Balance } =
    useReadContract({
      abi: MUSD_CONTRACT,
      address: MUSD_ADDRESS,
      functionName: "balanceOf",
      args: [address],
    });

  const { data: vUSD_balance, refetch: refresh_vusd_Balance } = useReadContract(
    {
      abi: VUSD_CONTRACT,
      address: VUSD_ADDRESS,
      functionName: "balanceOf",
      args: [address],
    }
  );

  const refreshBalances = () => {
    refresh_musdc_Balance();
    refresh_vusd_Balance();
  };

  const mUSD_balance_number = mUSDC_balance ? Number(mUSDC_balance) : 0;
  const vUSD_balance_number = vUSD_balance ? Number(vUSD_balance) : 0;


  return (
    <div className="flex items-center flex-col flex-grow pt-6 lg:pt-12">
      <Card className="max-w-md mx-auto rounded-3xl lg:mt-0 mt-14 bg-background">
        <div className="justify-center flex mb-6">
          <CustomTab
            label="Deposit"
            isActive={activeTab === "deposit"}
            onClick={() => handleTabChange("deposit")}
          />
          <CustomTab
            label="Withdraw"
            isActive={activeTab === "withdraw"}
            onClick={() => handleTabChange("withdraw")}
          />
        </div>
        <div>
          {activeTab === "deposit" && (
            <div>
              <DepositWidget refreshBalance={refreshBalances} balance={mUSD_balance_number} />
            </div>
          )}
          {activeTab === "withdraw" && (
            <div>
              <WithdrawWidget refreshBalance={refreshBalances} balance={vUSD_balance_number} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
