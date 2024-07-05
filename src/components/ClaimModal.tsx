import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";
import { addresses } from "@/constants/addresses";
import { toast } from "sonner";
import CLAIM_CONTRACT from "@/contracts/claim.json";
import Link from "next/link";

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const chainId = getChainId(config);
  const { writeContract, data: hash, error } = useWriteContract();

  const {
    isLoading: isConfirming,
    isError: receiptError,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });
  

  useEffect(() => {
    if (isConfirming) {
      toast.loading("Transaction Pending", { style: { background: "black" } });
    }
    toast.dismiss();

    if (isConfirmed) {
      toast.success("Transaction Successful", {
        action: {
          label: "View on Etherscan",
          onClick: () => {
            window.open(`${addresses[chainId]['blockexplorer']}/tx/${hash}`);
          },
        },
      });
      onClose();
    }
    if (error) {
      console.log(error);
      toast.error("Transaction Failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, isConfirming, error, hash]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-secondary rounded-lg shadow-lg p-6 w-1/4-md w-10/12 max-w-md">
        {children}
        <div className="flex justify-between">
          <Button
            onClick={onClose}
            disabled={isConfirming}
            className="mt-4 py-2 px-4 bg-[#020817] hover:bg-[#87b9fb]"
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              writeContract({
                abi: CLAIM_CONTRACT,
                address: addresses[chainId]["claim"],
                functionName: "claim",
              })
            }
            disabled={isConfirming}
            className="mt-4 py-2 px-4 bg-[#020817] hover:bg-[#87b9fb] "
          >
            Get Mock USDC
          </Button>
        </div>
        <div className="flex mt-10 flex-col">
          <p>Need Some Testnet Eth?</p>
          <Link
            className={`mt-4`}
            href="https://learnweb3.io/faucets/base_sepolia/"
            target="_blank"
          >
            Base Eth Faucet
          </Link>
          <Link
            className={`mt-2`}
            href="https://learnweb3.io/faucets/sepolia/"
            target="_blank"
          >
            Sepolia Eth Faucet
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;
