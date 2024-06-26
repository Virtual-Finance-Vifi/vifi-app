import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import MUSD_CONTRACT from "../../contracts/mUSD.json";
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";
import { addresses } from "@/constants/addresses";
import { toast } from "sonner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void; // Define the type for onClose as a function that returns nothing
  children: React.ReactNode;
  refetchApproval: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  refetchApproval,
}) => {
  const chainId = getChainId(config);
  const {
    writeContractAsync,
    isSuccess,
    isError: error,
    data: hash,
  } = useWriteContract();

  useEffect(() => {
    if (isSuccess === true) {
      onClose();
    }
    if (error) {
      console.error("Transaction Failed");
    }
  }, [isSuccess, error, onClose]);

  const {
    isLoading: isConfirming,
    isError: receiptError,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirming) {
      toast.loading("Approval Pending");
    }
    toast.dismiss();

    if (isConfirmed) {
      toast.success("Approval Successful", {
        action: {
          label: "View on Etherscan",
          onClick: () => {
            window.open(`https://sepolia.etherscan.io/tx/${hash}`);
          },
        },
      });
      refetchApproval?.();
    }
    if (error) {
      toast.error("Approval Failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, isConfirming, error, hash]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-secondary rounded-lg shadow-lg p-6 w-full max-w-md">
        {children}
        <div className="flex flex-row justify-between">
          <Button
            onClick={onClose}
            className="mt-4 py-2 px-4 bg-[#020817] text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              writeContractAsync({
                abi: MUSD_CONTRACT,
                address: addresses[chainId]["musd"],
                functionName: "approve",
                args: [
                  addresses[chainId]["virtualizer"],
                  "1000000000000000000000000",
                ],
              })
            }
            className="mt-4 py-2 px-4 bg-[#020817] text-white"
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
