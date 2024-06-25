import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import InputComponent from "@/components/virtualizer/Input";
import Modal from "./Modal";
import DisabledInputComponent from "./DisabledInput";
import VIRTUALISER_CONTRACT from "../../contracts/virtualizer.json";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import MUSD_CONTRACT from "../../contracts/mUSD.json";
import { parseEther } from "viem";
import { MUSD_ADDRESS, VIRTUALIZER_ADDRESS } from "@/constants/addresses";
import { toast } from "sonner";

interface CustomToastProps {
  message: string;
  gifUrl: string;
  width: number;
  height: number;
}

const CustomToast: React.FC<CustomToastProps> = ({ message, gifUrl, width, height }) => (
  <div className="flex flex-col border border-purple-500 
   w-full h-full align-center justify-center items-center">
    <img src={gifUrl} alt="Toast Icon" className={`border border-green-400 w-[${width}px] h-[${height}px]`} />
    <h1 className="text-[24px] font-bold font-['Archivo']">{message}</h1>
  </div>
);
interface WithdrawWidgetProps {
  refreshBalance: () => void; // Define the type of refreshBalance as a function
  balance: number;
}

const WithdrawWidget: React.FC<WithdrawWidgetProps> = ({ refreshBalance, balance }) => {
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
    address: MUSD_ADDRESS,
    functionName: "allowance",
    args: [address, VIRTUALIZER_ADDRESS],
  });

  const approve_str = approved?.toString();
  const transfer_vUSD = String(parseEther(vUSD.toString()));

  const handleWithdraw = () => {
    try{
      if (approve_str === "0") {
        openModal();
      } else {
        writeContract({
          abi: VIRTUALISER_CONTRACT,
          address: VIRTUALIZER_ADDRESS,
          functionName: "unwrap",
          args: [transfer_vUSD],
        });
  
        console.log("Transferring:", transfer_vUSD);

        toast.loading(<CustomToast message="Waiting for confirmation..." gifUrl="walking_orange.gif" width={186}
        height={197}/>, {
          style: {
            background: '#101419',
            width: '33vw', // 1/3 of viewport width
            height: '75vh', // 1/3 of viewport height
            top: '50%', // Center vertically
            left: '50%', // Center horizontally
            transform: 'translate(-50%, -50%)', // Adjust position relative to center
            position: 'fixed', // Ensure it's fixed position
            border:'solid green',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center'
          },
          //className:"!bg-[#3A4047] !w-1/3 !h-3/4vh !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !fixed !border-solid !border-green"
        });
      }

    }catch{

    }
    
  };

  useEffect(() => {
    if (isConfirming) {
      toast.loading(<CustomToast message="Transaction Pending ..." gifUrl="pending_lemon.gif" width={156}
      height={175}/>,{
        style:{
          background:"#3A4047",
          width:"33vw",
          height:"75vh",
          top:"50%",
          left:"50%",
          transform:"translate(-50%,-50%)",
          position:"fixed"
        },
        //className:"bg-[#3A4047] w-full h-full top-[145px] left-[490px]"
      });
    }
    toast.dismiss();
      
    if (isConfirmed) {
      toast.success(<CustomToast message="Transaction Successful" gifUrl="changing_fruit.gif" width={240}
      height={196}/>, {
        style:{
          background:"#3A4047",
          width:"33vw",
          height:"75vh",
          top:"50%",
          left:"50%",
          transform:"translate(-50%,-50%)",
          position:"fixed"
        },
        //className:"bg-[#3A4047] w-full h-full top-[145px] left-[490px]"
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
  }, [isConfirmed, isConfirming, error, hash])

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
          <Button className="w-full rounded-full bg-red-500 text-white" onClick={handleConnect}>
            Connect Wallet
          </Button>
        ) : (
          <Button className="w-full rounded-full bg-red-500 text-white" onClick={handleWithdraw} disabled={isConfirming}>
            Withdraw
          </Button>
        )}

        <Modal isOpen={isModalOpen} onClose={closeModal} refetchApproval={refetch_approval}>
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
