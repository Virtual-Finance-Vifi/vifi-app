import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import InputComponent from "./Input";
import Modal from "./Modal";
import DisabledInputComponent from "./DisabledInput";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import MUSD_CONTRACT from "../../contracts/mUSD.json";
import VIRTUALISER_CONTRACT from "../../contracts/virtualizer.json";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { parseEther } from "viem";
import { MUSD_ADDRESS, VIRTUALIZER_ADDRESS } from "@/constants/addresses";
import { toast } from "sonner";

interface DepositWidgetProps {
  refreshBalance: () => void; // Define the type of refreshBalance as a function
}

const DepositWidget: React.FC<DepositWidgetProps> = ({ refreshBalance }) => {
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

  const { data: approved } = useReadContract({
    abi: MUSD_CONTRACT,
    address: MUSD_ADDRESS,
    functionName: "allowance",
    args: [address, VIRTUALIZER_ADDRESS],
  });

  const approve_str = approved?.toString();
  const transfer_mUSDC = String(parseEther(mUSDC.toString()));

  const handleDeposit = () => {
    if (approve_str === "0") {
      openModal();
    } else {
      writeContract({
        abi: VIRTUALISER_CONTRACT,
        address: VIRTUALIZER_ADDRESS,
        functionName: "wrap",
        args: [transfer_mUSDC],
      });

      console.log("Transferring:", transfer_mUSDC);
    }
  };

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
      setmUSDC(0);
    }
      if (error) {
      toast.error("Transaction Failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, isConfirming, error, hash])

  return (
    <div>
      <div className="flex rounded-2xl items-left flex-col flex-grow pt-4">
        <div>
          <div className="flex mx-2 text-accent">
            <InputComponent
              label="mUSDC"
              type="deposit"
              initialValue={mUSDC}
              onValueChange={setmUSDC}
            />
          </div>
        </div>
      </div>

      <div className="mx-2">
        {!address ? (
          <Button className="w-full" onClick={handleConnect}>
            Connect Wallet
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={handleDeposit}
            disabled={isConfirming}
          >
            Deposit
          </Button>
        )}

        <Modal isOpen={isModalOpen} onClose={closeModal}>
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
