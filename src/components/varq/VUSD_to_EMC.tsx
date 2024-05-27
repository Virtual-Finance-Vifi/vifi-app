import React, { useState, useEffect } from "react";
import InputComponent from "./Input";
import { Button } from "../ui/button";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import VARQ_CONTRACT from "../../contracts/varq.json";
import { parseEther } from "viem";
import { VARQ_ADDRESS } from "@/constants/addresses";
import { toast } from "sonner";

interface VUSDToEMCProps {
  refreshBalance: () => void; 
}

const VUSD_to_EMC: React.FC<VUSDToEMCProps> = ({ refreshBalance }) => {
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const handleConnect = () => {
    open();
  };

  const [VUSD, setVUSD] = useState<number>(0);
  const { writeContract, data: hash } = useWriteContract();
  const transfer_VUSD = String(parseEther(VUSD.toString()));

  const handleVUSDtoEMC = () => {
    writeContract({
      abi: VARQ_CONTRACT,
      address: VARQ_ADDRESS,
      functionName: "convertVUSDToTokens",
      args: [transfer_VUSD],
    });

    console.log("Transferring:", VUSD);
  };

  const {
    isLoading: isConfirming,
    error,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
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
      setVUSD(0);
    }
    if (error) {
      toast.error("Transaction Failed");
    }
  }, [isConfirmed, isConfirming, error, hash]);

  return (
    <div>
      <div className="flex rounded-2xl items-left flex-col flex-grow pt-4 mx-2 text-accent">
        <h1 className="text-primary ml-2">vUSD -{">"} vTTD</h1>
        <InputComponent
          label="vUSD"
          onValueChange={setVUSD}
          initialValue={VUSD}
        />
      </div>
      <div className="flex flex-col justify-center mx-2">
        {!address ? (
          <Button onClick={handleConnect}>Connect Wallet</Button>
        ) : (
          <>
            <Button className="rounded-2xl px-6" onClick={handleVUSDtoEMC}>
              Convert
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VUSD_to_EMC;
