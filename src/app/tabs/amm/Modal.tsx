import React, { useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import VRT_CONTRACT from "../../../contracts/vtoken.json";
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";
import { addresses } from "@/constants/addresses";
import { toast } from "sonner";
import CustomToast from "@/components/CustomToast";

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
      toast.loading(
        <CustomToast
          message="Transaction Pending ..."
          message2="Your transaction has been submitted. Please check in a while."
          gifUrl="pending_lemon.gif"
          type={"approval"}
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
          type={"approval"}
          width={240}
          height={196}
          hash={hash}
        />,
        
      );
      onClose();
      refetchApprovals?.();
    }
    if (error) {
      toast.error(
        <CustomToast 
          message="Transaction Failed"
          message2="Error Details"
          gifUrl="confused_apple.gif"
          type={"approval"}
          width={325}
          height={325}
          hash={hash}/>,
          
      );
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
