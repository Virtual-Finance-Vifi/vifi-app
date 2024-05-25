import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useWriteContract } from "wagmi";
import MUSD_CONTRACT from "../../contracts/mUSD.json";
import { MUSD_ADDRESS, VIRTUALIZER_ADDRESS } from "@/constants/addresses";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void; // Define the type for onClose as a function that returns nothing
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const { writeContractAsync, isSuccess, isError: error } = useWriteContract();

  useEffect(() => {
    if (isSuccess === true) {
      onClose();
    }
    if (error) {
      console.error("Transaction Failed");
    }
  }, [isSuccess, error, onClose]);

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
                address: MUSD_ADDRESS,
                functionName: "approve",
                args: [VIRTUALIZER_ADDRESS, "1000000000000000000000000"],
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
