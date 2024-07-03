import React, { useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import VRT_CONTRACT from "../../../contracts/vtoken.json";
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";
import { addresses } from "@/constants/addresses";
import { toast } from "sonner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  swapType: string;
  refetchApprovals: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  swapType,
  refetchApprovals,
}) => {
  const chainId = getChainId(config);
  const {
    writeContractAsync,
    isSuccess,
    isError: error,
    data: hash,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isError: receiptError,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirming) {
      toast.loading("Approval Pending", { style: { background: "black" } });
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
      onClose();
      refetchApprovals?.();
    }
    if (error) {
      toast.error("Approval Failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, isConfirming, error, hash]);

  if (!isOpen) return null;

  const handleApprove = () => {
    const abi = VRT_CONTRACT;
    const address =
      swapType === "vrt"
        ? addresses[chainId]["vrt"]
        : addresses[chainId]["vttd"];

    writeContractAsync({
      abi,
      address,
      functionName: "approve",
      args: [addresses[chainId]["swap"], "10000000000000000000000000"],
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-secondary rounded-lg shadow-lg p-6 w-full max-w-md">
        {children}
        <div className="flex flex-row justify-between">
          <Button
            onClick={onClose}
            disabled={isConfirming}
            className="mt-4 py-2 px-4 bg-[#020817] text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isConfirming}
            className="mt-4 py-2 px-4 bg-[#020817] text-white"
          >
            Approve {swapType.toUpperCase()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
