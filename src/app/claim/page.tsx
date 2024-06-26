"use client";
import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import MUSD_CONTRACT from "../../contracts/mUSD.json";
import CLAIM_CONTRACT from "../../contracts/claim.json";
import { Card } from "@tremor/react";
import { toast } from "sonner";
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";
import { addresses } from "@/constants/addresses";

export default function Claim() {
  const chainId = getChainId(config);
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const handleConnect = () => {
    open();
  };
  const { writeContract, data: hash } = useWriteContract();

  const {
    isLoading: isConfirming,
    error,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: mUSDC_balance, refetch: refreshBalance } = useReadContract({
    abi: MUSD_CONTRACT,
    address: addresses[chainId]["musd"],
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (isConfirming) {
      toast.loading("Transaction Pending");
    }
    toast.dismiss();

    if (isConfirmed) {
      toast.success("Transaction Successful", {
        action: {
          label: "View on Etherscan",
          onClick: () => {
            window.open(`https://sepolia.etherscan.io/tx/${hash}`);
          },
        },
      });
      refreshBalance?.();
      console.log("Balance should be refreshed");
    }
    if (error) {
      toast.error("Transaction Failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, isConfirming, error, hash]);

  return (
    <main className="flex flex-row justify-center align-center">
      <Card className="max-w-md mx-auto rounded-3xl lg:mt-0 mt-14 bg-background">
        <div className="flex flex-col justify-center h-96 w-96">
          {!address ? (
            <Button
              className="rounded-2xl px-6 w-full bg-[#68AAFF] hover:bg-[#87b9fb] font-semibold"
              onClick={handleConnect}
            >
              Connect Wallet
            </Button>
          ) : (
            <>
              <Button
                onClick={() =>
                  writeContract({
                    abi: CLAIM_CONTRACT,
                    address: addresses[chainId]["claim"],
                    functionName: "claim",
                  })
                }
                disabled={isConfirming}
                className="rounded-2xl px-6 w-full bg-[#68AAFF] hover:bg-[#87b9fb] font-semibold"
              >
                Claim
              </Button>
            </>
          )}
          <div className="mt-8 flex justify-center">
            <h1>
              Balance: {(Number(mUSDC_balance) / 10 ** 18).toFixed(2)} MUSDC
            </h1>
          </div>
        </div>
      </Card>
    </main>
  );
}
