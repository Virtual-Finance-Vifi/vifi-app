import React, { useState, useEffect } from "react";
import InputComponent from "./Input";
import { Button } from "../../../components/ui/button";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import VARQ_CONTRACT from "../../../contracts/varq.json";
import { Address, parseEther } from "viem";
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";
import { addresses } from "@/constants/addresses";
import { toast } from "sonner";
import CustomToast from "@/components/CustomToast";

interface VUSDToEMCProps {
  refreshBalance: () => void;
  balance: number;
}

const VUSD_to_EMC: React.FC<VUSDToEMCProps> = ({ refreshBalance, balance }) => {
  const chainId = getChainId(config);
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const [destinationAddress, setDestinationAddress] = useState<Address>(
    address || "0x"
  );
  const handleConnect = () => {
    open();
  };

  const [VUSD, setVUSD] = useState<number>(0);
  const {
    writeContract,
    data: hash,
    error: the_error,
    isError,
  } = useWriteContract();
  const transfer_VUSD = parseEther(VUSD.toString());

  const handleDestinationAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDestinationAddress(
      newValue ? (newValue as Address) : address || ("0x" as Address)
    );
  };

  const handleVUSDtoEMC = () => {
    writeContract({
      abi: VARQ_CONTRACT,
      address: addresses[chainId]["varq"],
      functionName: "convertVUSDToTokens",
      args: [transfer_VUSD, destinationAddress],
    });
    console.log("Transferring:", VUSD + "to " + destinationAddress);
    toast.loading(
      <CustomToast
        message="Waiting for confirmation..."
        message2="ETA: 2 min 25 sec. Take a walk :)"
        gifUrl="walking_orange.gif"
        tokenIcons={["usdc_icon.svg","vrt_icon.png"]}
        tokenLabels={["VUSD","VTTD&VRT"]}
        values={[VUSD,0.0]}
        width={325}
        height={325}
        hash={hash}
      />,
      
    );
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
      toast.loading(
        <CustomToast
          message="Transaction Pending ..."
          message2="Your transaction has been submitted. Please check in a while."
          gifUrl="pending_lemon.gif"
          tokenIcons={["usdc_icon.svg","vrt_icon.png"]}
          tokenLabels={["VUSD","VTTD&VRT"]}
          values={[VUSD,0.0]}
          width={225}
          height={126}
          hash={hash}
        />,
        
      );
    }
    toast.dismiss();

    if (isConfirmed) {
      toast.success(
        <CustomToast
          message="Transaction Successful"
          message2="Yippie :D"
          gifUrl="changing_fruit.gif"
          tokenIcons={["usdc_icon.svg","vrt_icon.png"]}
          tokenLabels={["VUSD","VTTD&VRT"]}
          values={[VUSD,0.0]}
          width={240}
          height={196}
          hash={hash}
        />,
        
      );
      refreshBalance?.();
      setVUSD(0);
    }
    if (error) {
      toast.error(
        <CustomToast 
          message="Transaction Failed"
          message2="Error Details"
          gifUrl="confused_apple.gif"
          tokenIcons={["usdc_icon.svg","vrt_icon.png"]}
          tokenLabels={["VUSD","VTTD&VRT"]}
          values={[VUSD,0.0]}
          width={325}
          height={325}
          hash={hash}/>,
          
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, isConfirming, error, hash]);

  return (
    <div>
      <div className="flex rounded-2xl items-left flex-col flex-grow pt-4 mx-2">
        <h1 className="ml-2">vUSD -{">"} vTTD</h1>
        <InputComponent
          label="vUSD"
          onValueChange={setVUSD}
          initialValue={VUSD}
          balance={balance}
        />
        <p className="ml-2">Destination Address (Optional)</p>
        <input
          className="pl-4 rounded-xl mb-4 bg-inherit border border-[#8FA2B7] input input-ghost text-xl focus:text-white focus:outline-none h-[2.2rem] min-h-[2.2rem] px-1 font-medium placeholder:text-[#9ba3af] text-gray-400"
          type="text"
          name="destinationAddress"
          placeholder="0x"
          onChange={handleDestinationAddress}
        />
      </div>
      <div className="flex flex-col justify-center mx-2">
        {!address ? (
          <Button
            className="bg-[#00A651] rounded-2xl px-6 hover:bg-[#C2D952]"
            onClick={handleConnect}
          >
            Connect Wallet
          </Button>
        ) : (
          <>
            <Button
              className="bg-[#00A651] rounded-2xl px-6 hover:bg-[#C2D952]"
              onClick={handleVUSDtoEMC}
            >
              Convert
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VUSD_to_EMC;
