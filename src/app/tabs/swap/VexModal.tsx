import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import VRT_CONTRACT from "../../../contracts/vtoken.json";
import MUSD_CONTRACT from "@/contracts/mUSD.json";
import VEX_CONTRACT from "@/contracts/vex.json";
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";
import { addresses } from "@/constants/addresses";
import { toast } from "sonner";
import CustomToast from "@/components/CustomToast";


const chainId = getChainId(config);
/*const { data: liveRateIn, refetch:refresh_rateIn}=useReadContract(
  {
    abi:VEX_CONTRACT,
    address:addresses[chainId]["vex"],
    functionName:"getLiveRateIn",
    args:["10000000000000000000"],
  }
)
console.log(liveRateIn)

const { data: liveRateOut, refetch:refresh_rateOut}=useReadContract(
  {
    abi:VEX_CONTRACT,
    address:addresses[chainId]["vex"],
    functionName:"getLiveRateOut",
    args:["1000000000000000000"],
  }
)
console.log(liveRateOut)

const liveRateIn_number=liveRateIn?Number(liveRateIn):0;
const liveRateOut_number=liveRateOut?Number(liveRateOut):0;*/

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
          message="Transaction Successful"
          message2="Your transaction has been submitted. Please check in a while."
          gifUrl="pending_lemon.gif"
          tokenIcon1="usdc_icon.svg"
          tokenIcon2="ttd_icon.svg"
          width={240}
          height={196}
          hash={hash}
        />,
        {
          style: {
            background: "#101419",
            width: "33vw",
            height: "75vh",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            position: "fixed",
          },
          //className:"bg-[#3A4047] w-full h-full top-[145px] left-[490px]"
          
        }
      );
    }
    toast.dismiss();

    if (isConfirmed) {
      toast.success(
        <CustomToast
          message="Transaction Successful"
          message2="Yippie :D"
          gifUrl="changing_fruit.gif"
          tokenIcon1="usdc_icon.svg"
          tokenIcon2="ttd_icon.svg"
          width={240}
          height={196}
          hash={hash}
        />,
        {
          style: {
            background: "#101419",
            width: "33vw",
            height: "75vh",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            position: "fixed",
          },
          //className:"bg-[#3A4047] w-full h-full top-[145px] left-[490px]"
          
        }
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
          tokenIcon1="usdc_icon.svg"
          tokenIcon2="vusd_icon.png"
          width={325}
          height={325}
          hash={hash}/>,
          {
            style:{
              background: "#101419",
              width: "33vw",
              height: "75vh",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              position: "fixed",
            }
          }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, isConfirming, error, hash]);

  if (!isOpen) return null;

  const handleApprove = () => {
    const abi = swapType==="musd"?MUSD_CONTRACT:VRT_CONTRACT;
    const address =
      swapType === "mUSD"
        ? addresses[chainId]["musd"]
        : addresses[chainId]["vttd"]; // Replace with actual VTTD contract address

    writeContractAsync({
      abi,
      address,
      functionName: "approve",
      args: [addresses[chainId]["vex"], "10000000000000000000000000"],
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
