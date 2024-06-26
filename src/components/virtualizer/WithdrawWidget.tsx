import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import InputComponent from "@/components/virtualizer/Input";
import Modal from "./Modal";
import DisabledInputComponent from "./DisabledInput";
import VIRTUALISER_CONTRACT from "../../contracts/virtualizer.json";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import MUSD_CONTRACT from "../../contracts/mUSD.json";
import { parseEther } from "viem";
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";
import { addresses } from "@/constants/addresses";
import { toast } from "sonner";

interface CustomToastProps {
  message: string;
  gifUrl: string;
}

const CustomToast: React.FC<CustomToastProps> = ({ message, gifUrl }) => (
  <div className="flex flex-col items-center">
    <img
      src={gifUrl}
      alt="Toast Icon"
      className="border border-green-400 self-center"
    />
    <h1 className="text-xl font-bold">{message}...</h1>
  </div>
);
interface WithdrawWidgetProps {
  refreshBalance: () => void; // Define the type of refreshBalance as a function
  balance: number | null;
}

const WithdrawWidget: React.FC<WithdrawWidgetProps> = ({
  refreshBalance,
  balance,
}) => {
  const chainId = getChainId(config);
  const { address } = useAccount();
  const [vUSD, setvUSD] = useState<number>(0);
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
  const transfer_vUSD = String(parseEther(vUSD.toString()));

  const handleWithdraw = () => {
    if (approve_str === "0") {
      openModal();
    } else {
      writeContract({
        abi: VIRTUALISER_CONTRACT,
        address: addresses[chainId]["virtualizer"],
        functionName: "unwrap",
        args: [transfer_vUSD],
      });

      console.log("Transferring:", transfer_vUSD);
    }
  };

  useEffect(() => {
    if (isConfirming) {
      toast.loading(
        <CustomToast
          message="TransactionPending"
          gifUrl="walking_orange.gif"
        />,
        {
          style: {
            background: "#3A4047",
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
      toast.success("Transaction Successful", {
        action: {
          label: "View on Etherscan",
          onClick: () => {
            window.open(`https://sepolia.etherscan.io/tx/${hash}`);
          },
        },
      });
      refreshBalance?.();
      setvUSD(0);
    }
    if (error) {
      toast.error("Transaction Failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, isConfirming, error, hash]);

  return (
    <div>
      <div className="flex rounded-2xl items-left flex-col flex-grow pt-4">
        <div>
          <div className="flex mx-2">
            <InputComponent
              label="vUSD"
              type="withdraw"
              initialValue={vUSD}
              onValueChange={setvUSD}
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
            onClick={handleWithdraw}
            disabled={isConfirming}
          >
            Withdraw
          </Button>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          refetchApproval={refetch_approval}
        >
          <DisabledInputComponent
            label="vUSD"
            heading="Approve amount of funds that can be transferred"
            initialValue={1000000}
            currency="vUSD"
          />
        </Modal>
      </div>
    </div>
  );
};

export default WithdrawWidget;
