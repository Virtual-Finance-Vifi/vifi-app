"use client";
import React from "react";
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
import { useWeb3Modal } from "@web3modal/wagmi/react";
import MUSD_CONTRACT from "../../contracts/mUSD.json";
import CLAIM_CONTRACT from "../../contracts/claim.json";
import { Card } from "@tremor/react";
import { formatEther } from "viem";
import { MUSD_ADDRESS, CLAIM_ADDRESS } from "@/constants/addresses";

export default function Claim() {
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const [formattedMusdcBalance, setFormattedMusdcBalance] = useState("");
  const handleConnect = () => {
    open();
  };
  const { writeContract, data:hash} = useWriteContract();

  const {
    isLoading: isConfirming,
    error,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: mUSDC_balance, refetch:refreshBalance } = useReadContract({
    abi: MUSD_CONTRACT,
    address: MUSD_ADDRESS,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    console.log("Address:", address);
    if (mUSDC_balance !== undefined && mUSDC_balance !== null) {
      const formatted_musdc_balance = formatEther(
        BigInt(Number(mUSDC_balance))
      );
      console.log("MUSDC balance:", formatted_musdc_balance?.toString());
      setFormattedMusdcBalance(formatted_musdc_balance.toString());
    }
  }, [mUSDC_balance, address]);

  useEffect(() => {
    if (isConfirming) {
      console.log("Transaction Pending");
    }
    if (isConfirmed) {
      console.log("Transaction completed")
      refreshBalance?.()
      console.log("Balance should be refreshed")
    }
  }, [isConfirmed, isConfirming])
  


  return (
    <main className="flex flex-row justify-center align-center">
      <Card className="max-w-md mx-auto rounded-3xl lg:mt-0 mt-14 bg-background">
        <div className="flex flex-col justify-center h-96 w-96">
          {!address ? (
            <Button onClick={handleConnect}>Connect Wallet</Button>
          ) : (
            <>
              <Button
                onClick={() =>
                  writeContract({
                    abi: CLAIM_CONTRACT,
                    address: CLAIM_ADDRESS,
                    functionName: "claim",
                  })
                }
                className="rounded-2xl px-6 mt-12"
              >
                Claim
              </Button>
            </>
          )}
          <div className="mt-8 flex justify-center">
            {formattedMusdcBalance && <h1>Balance: {(Number(formattedMusdcBalance)).toFixed(2)} MUSDC</h1>}
          </div>
        </div>
      </Card>
    </main>
  );
}
