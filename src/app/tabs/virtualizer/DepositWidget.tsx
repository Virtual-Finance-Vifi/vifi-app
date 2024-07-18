import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import InputComponent from "./Input";
import Modal from "./Modal";
import DisabledInputComponent from "./DisabledInput";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import MUSD_CONTRACT from "../../../contracts/mUSD.json";
import VIRTUALISER_CONTRACT from "../../../contracts/virtualizer.json";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { parseEther } from "viem";
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";
import { addresses } from "@/constants/addresses";
import { toast } from "sonner";
import CustomToast from "@/components/CustomToast";




interface DepositWidgetProps {
  refreshBalance: () => void; // Define the type of refreshBalance as a function
  balance: number | null;
}

const DepositWidget: React.FC<DepositWidgetProps> = ({
  refreshBalance,
  balance,
}) => {
  const chainId = getChainId(config);
  const { address } = useAccount();
  const [mUSDC, setmUSDC] = useState<number>(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const { writeContract, data: hash } = useWriteContract();
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const { open } = useWeb3Modal();
  const handleConnect = () => {
    open();
  };

  const {
    isLoading: isConfirming,
    error,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: approved, refetch: refetch_approval } = useReadContract({
    abi: MUSD_CONTRACT,
    address: addresses[chainId]["musd"],
    functionName: "allowance",
    args: [address, addresses[chainId]["virtualizer"]],
  });

  const approve_str = approved?.toString();
  const transfer_mUSDC = String(parseEther(mUSDC.toString()));

  const handleDeposit = () => {
    try {
      if (approve_str === "0") {
        openModal();
      } else {
        writeContract({
          abi: VIRTUALISER_CONTRACT,
          address: addresses[chainId]["virtualizer"],
          functionName: "wrap",
          args: [transfer_mUSDC],
        });

        console.log("Transferring:", transfer_mUSDC);

        toast.loading(
          <CustomToast
            message="Waiting for confirmation..."
            message2="ETA: 2 min 25 sec. Take a walk :)"
            gifUrl="walking_orange.gif"
            tokenIcons={["usdc_icon.svg","vusd_icon.png"]}
            tokenLabels={["MUSD","VUSD"]}
            values={[mUSDC,mUSDC]}
            width={325}
            height={325}
            hash={hash}
          />,
          {
            style: {
              background: "#101419",
              width: "33vw", // 1/3 of viewport width
              height: "75vh", // 1/3 of viewport height
              top: "50%", // Center vertically
              left: "50%", // Center horizontally
              transform: "translate(-50%, -50%)", // Adjust position relative to center
              position: "fixed", // Ensure it's fixed position
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            },
            //className:"!bg-[#3A4047] !w-1/3 !h-3/4vh !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !fixed !border-solid !border-green"
          }
        );
      }
    } catch {}
  };

  useEffect(() => {
    if (isConfirming) {
      toast.loading(
        <CustomToast
          message="Transaction Pending ..."
          message2="Your transaction has been submitted. Please check in a while."
          gifUrl="pending_lemon.gif"
          tokenIcons={["usdc_icon.svg","vusd_icon.png"]}
          tokenLabels={["MUSD","VUSD"]}
          values={[mUSDC,mUSDC]}
          width={225}
          height={126}
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
          tokenIcons={["usdc_icon.svg","vusd_icon.png"]}
          tokenLabels={["MUSD","VUSD"]}
          values={[mUSDC,mUSDC]}
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
      refreshBalance?.();
      setmUSDC(0);
    }
    if (error) {
      toast.error(
        <CustomToast 
          message="Transaction Failed"
          message2="Error Details"
          gifUrl="confused_apple.gif"
          tokenIcons={["usdc_icon.svg","vusd_icon.png"]}
          tokenLabels={["MUSD","VUSD"]}
          values={[mUSDC,mUSDC]}
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

  return (
    <div>
      <div className="flex rounded-2xl items-left flex-col flex-grow pt-4">
        <div>
          <div className="flex mx-2">
            <InputComponent
              label="mUSDC"
              type="deposit"
              initialValue={mUSDC}
              onValueChange={setmUSDC}
              balance={balance}
            />
          </div>
        </div>
      </div>

      <div className="mx-2">
        {!address ? (
          <Button
            className="w-full rounded-full bg-[#F15A22] hover:bg-[#F5846F] font-semibold"
            onClick={handleConnect}
          >
            Connect Wallet
          </Button>
        ) : (
          <Button
            className="w-full rounded-full bg-[#F15A22] hover:bg-[#F5846F] font-semibold"
            onClick={handleDeposit}
            disabled={isConfirming}
          >
            Deposit
          </Button>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          refetchApproval={refetch_approval}
        >
          <DisabledInputComponent
            label="mUSDC"
            heading="Approve amount of funds that can be transferred"
            initialValue={1000000}
            currency="mUSDC"
          />
        </Modal>
      </div>
    </div>
  );
};

export default DepositWidget;
