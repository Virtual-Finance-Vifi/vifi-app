import React, { useEffect, useState } from "react";
import InputComponent from "./Input";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import VARQ_CONTRACT from "../../contracts/varq.json";
import { Address, parseEther } from "viem";
import { VARQ_ADDRESS } from "@/constants/addresses";
import { toast } from "sonner";

interface EMCToVUSDProps {
  refreshBalance: () => void;
  balance: number;
}

const EMC_to_VUSD: React.FC<EMCToVUSDProps> = ({ refreshBalance, balance }) => {
  const { address } = useAccount();
  const handleConnect = () => {
    open();
  };
  const [destinationAddress, setDestinationAddress] = useState<Address>(
    () => address || "0x"
  );
  const [VRT, setVRT] = useState<number>(0);
  const { writeContract, data: hash } = useWriteContract();
  const { open } = useWeb3Modal();
  const transfer_VRT = String(parseEther(VRT.toString()));

  const handleDestinationAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === "") {
      setDestinationAddress(address || "0x" as Address);
    } else {
      setDestinationAddress(newValue as Address);
    }
  };

  const handleEMCtoVUSD = () => {
    writeContract({
      abi: VARQ_CONTRACT,
      address: VARQ_ADDRESS,
      functionName: "convertTokensToVUSD",
      args: [transfer_VRT, destinationAddress],
    });

    console.log("Transferring: ", [VRT] + "to " + [destinationAddress]);
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
      </div>
      <div className="flex rounded-2xl items-left flex-col flex-grow mx-2 text-accent">
        <InputComponent label="vRT" onValueChange={setVRT} initialValue={VRT} balance={balance}/>
        <p className="text-primary ml-2">Destination Address (Optional)</p>
        <input
          className="pl-4 rounded-xl mb-4 bg-[#2b3655] input input-ghost text-xl focus:text-white focus:outline-none h-[2.2rem] min-h-[2.2rem] px-1 font-medium placeholder:text-[#9ba3af] text-gray-400"
          type="text"
          name="destinationAddress"
          placeholder="0x"
          onChange={handleDestinationAddress}
        />
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
};

export default EMC_to_VUSD;
