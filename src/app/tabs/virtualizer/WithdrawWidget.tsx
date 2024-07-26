import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import InputComponent from "@/app/tabs/virtualizer/Input";
import Modal from "./Modal";
import DisabledInputComponent from "./DisabledInput";
import VIRTUALISER_CONTRACT from "../../../contracts/virtualizer.json";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import MUSD_CONTRACT from "../../../contracts/mUSD.json";
import { parseEther } from "viem";
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";
import { addresses } from "@/constants/addresses";
import { toast } from "sonner";
import CustomToast from "@/components/CustomToast";



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
    try {
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

        toast.loading(
          <CustomToast
            message="Waiting for confirmation..."
            message2="ETA: 2 min 25 sec. Take a walk :)"
            gifUrl="walking_orange.gif"
            tokenIcons={["vusd_icon.png","usdc_icon.svg"]}
            tokenLabels={["VUSD","MUSD"]}
            values={[vUSD,vUSD]}
            width={325}
            height={325}
            hash={hash}
          />,
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
          tokenIcons={["vusd_icon.png","usdc_icon.svg"]}
          tokenLabels={["VUSD","MUSD"]}
          values={[vUSD,vUSD]}
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
          tokenIcons={["vusd_icon.png","usdc_icon.svg"]}
          tokenLabels={["VUSD","MUSD"]}
          values={[vUSD,vUSD]}
          width={240}
          height={196}
          hash={hash}
        />,
      );
      refreshBalance?.();
      setvUSD(0);
    }
    if (error) {
      toast.error(
        <CustomToast 
          message="Transaction Failed"
          message2="Error Details"
          gifUrl="confused_apple.gif"
          tokenIcons={["vusd_icon.png","usdc_icon.svg"]}
          tokenLabels={["VUSD","MUSD"]}
          values={[vUSD,vUSD]}
          width={325}
          height={325}
          hash={hash}/>,
      
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
