import React, { useEffect, useState } from "react";
import InputComponent from "./Input";
import Image from "next/image";
import { Button } from "../ui/button";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import VARQ_CONTRACT from "../../contracts/varq.json";
import { parseEther } from "viem";
import { VARQ_ADDRESS } from "@/constants/addresses";
import { toast } from "sonner";

interface EMCToVUSDProps {
  refreshBalance: () => void; 
}

const EMC_to_VUSD: React.FC<EMCToVUSDProps> = ({ refreshBalance }) =>{
  const { address } = useAccount();
  const handleConnect = () => {
    open();
  };
  const [VTTD, setVTTD] = useState<number>(0);
  const [VRT, setVRT] = useState<number>(0);
  const { writeContract, data:hash } = useWriteContract();
  const { open } = useWeb3Modal();
  const transfer_VTTD = String(parseEther(VTTD.toString()));
  const transfer_VRT = String(parseEther(VRT.toString()));

  const handleEMCtoVUSD = () => {
    writeContract({
      abi: VARQ_CONTRACT,
      address: VARQ_ADDRESS,
      functionName: "convertTokensToVUSD",
      args: [transfer_VTTD, transfer_VRT],
    });

    console.log("Transferring:", [VTTD, VRT]);
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
      setVRT(0);
      setVTTD(0);
    }
    if (error) {
      toast.error("Transaction Failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, isConfirming, error, hash]);
  return (
    <div>
      <div className="flex rounded-2xl items-left flex-col flex-grow pt-4 mx-2 text-accent">
        <h1 className="text-primary ml-2">vTTD & vRT -{">"} vUSD</h1>
        <InputComponent
          label="vTTD"
          onValueChange={setVTTD}
          initialValue={VTTD}
        />
      </div>
      <div className="flex rounded-2xl items-left flex-col flex-grow mx-2 text-accent">
        <InputComponent label="vRT" onValueChange={setVRT} initialValue={VRT} />
      </div>
      <div className="flex flex-col justify-center mx-2">
        {!address ? (
          <Button onClick={handleConnect}>Connect Wallet</Button>
        ) : (
          <>
            <Button className="rounded-2xl px-6" onClick={handleEMCtoVUSD}>
              Convert
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default EMC_to_VUSD;
