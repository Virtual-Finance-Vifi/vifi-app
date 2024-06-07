"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useWaitForTransactionReceipt,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { parseEther } from "viem";
import { toast } from "sonner";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import MUSD_CONTRACT from "../../contracts/mUSD.json";
import VEX_CONTRACT from "../../contracts/vex.json";
import { Card, Tab, TabGroup, TabList, TabPanels } from "@tremor/react";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import InputComponent from "@/components/InputWidget";
import UnifiedInput from "@/components/UnifiedValueInput";
import { VUSD_ADDRESS,VTTD_ADDRESS,MUSD_ADDRESS,VEX_ADDRESS } from "@/constants/addresses";
import VexModal from "@/components/vex/VexModal";
import VTOKEN_CONTRACT from "@/contracts/vtoken.json";


export default function Vex() {
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const [vUSD, setVUSD] = useState<number>(0);

  const [vTTD, setVTTD] = useState<number>(0);
  const [swap, setswap] = useState<boolean>(false);
  const [Swap,setSwap]=useState<string>("vTTD");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const handleConnect = () => {
    open();
  };
  const openModal = (type: string) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSwap = () => {
    setswap(!swap);
  };
  const handleSwapVUSD = () => {
    console.log("swap set vusd");
    setSwap("vUSD");
  };
  const handleSwapVTTD = () => {
    setSwap("vTTD");
    console.log("swap set vttd",Swap==="vTTD");
    
  };
  const { data: name } = useReadContract({
    address: MUSD_ADDRESS,
    abi: MUSD_CONTRACT,
    functionName: "name",
  });
  const { writeContract, data:hash, error } = useWriteContract();

  const {
    isLoading: isConfirming,
    isError:receiptError,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const transfer_vUSD = parseEther(vUSD.toString());
  const transfer_vTTD =parseEther(vTTD.toString());

  const { data: vTTD_balance, refetch: refresh_vTTD_balance } = useReadContract(
    {
      abi: VTOKEN_CONTRACT,
      address: VTTD_ADDRESS,
      functionName: "balanceOf",
      args: [address],
    }
  );
  const { data: vUSD_balance, refetch: refresh_vUSD_balance } = useReadContract({
    abi: VTOKEN_CONTRACT,
    address: VUSD_ADDRESS,
    functionName: "balanceOf",
    args: [address],
  });

  const { data: vUSD_approval, refetch: refetch_vUSD_approval } = useReadContract({
    abi: VTOKEN_CONTRACT,
    address: VUSD_ADDRESS,
    functionName: "allowance",
    args: [address, VEX_ADDRESS],
  });

  const { data: vTTD_approval, refetch: refetch_vTTD_approval } = useReadContract({
    abi: VTOKEN_CONTRACT,
    address: VTTD_ADDRESS,
    functionName: "allowance",
    args: [address, VEX_ADDRESS],
  });
  console.log("vUSD approval:",vUSD_approval?.toString());
  console.log("vTTD approval:",vTTD_approval?.toString());
  const refreshBalances = () => {
    refresh_vUSD_balance(), refresh_vTTD_balance();
  };

  const refreshApprovals = () => {
    refetch_vUSD_approval(), refetch_vTTD_approval();
  }

  const handleDeposit=()=>{
    switch(Swap){
      case "vUSD":
        if (vUSD_approval?.toString()!=="0"){
          try {
            writeContract({
              abi: VEX_CONTRACT,
              address: VEX_ADDRESS,
              functionName: "swapVexIn",
              args: [transfer_vUSD],
            });
            console.log("Transferring:", transfer_vUSD);
          } catch (error) {
            console.error("Transaction error:", error);
          }
        }else{
          openModal("vUSD");
        }
        break;
      
      case "vTTD":
        if(vTTD_approval?.toString()!=="0"){
          try{
            writeContract({
              abi: VEX_CONTRACT,
              address: VEX_ADDRESS,
              functionName: "swapVexOut",
              args: [transfer_vTTD],
            });
            console.log("Transferring:", transfer_vTTD);
          } catch (error) {
            console.error("Transaction error:", error);
          }
        }else{
          openModal("vTTD");
        }
      
      default:
        console.log("Error!Invalid swap value:",Swap);
        console.log(error);
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
      refreshBalances();
      refreshApprovals();
      setVUSD(0);
      setVTTD(0);
    }
    if (error) {
      toast.error("Transaction Failed");
      console.log(receiptError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, isConfirming, error, hash]);


  return (
    <main>
      <section className="py-12 flex flex-col items-center text-center gap-8">
        <h1 className="text-4xl font-bold">Swap</h1>
      </section>

      <Card className="max-w-md mx-auto rounded-3xl lg:mt-0 mt-14 bg-background">
        {Swap ==="vTTD" ? (
          <>
            <UnifiedInput
              type="receive"
              label="vTTD"
              value={vTTD}
              setValue={setVTTD}
            />
            <div className="flex justify-center mb-2">
              <button className="btn btn-accent hover:bg-secondary p-2 rounded-xl" onClick={handleSwapVUSD}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                  />
                </svg>
              </button>
            </div>
            <UnifiedInput
              type="pay"
              label="vUSD"
              value={vUSD}
              setValue={setVUSD}
            />
          </>
        ) : (
          <>
            <UnifiedInput
              type="pay"
              label="vUSD"
              value={vUSD}
              setValue={setVUSD}
            />
            <div className="flex justify-center mb-2">
              <button className="btn btn-accent hover:bg-secondary p-2 rounded-xl" onClick={handleSwapVTTD}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                  />
                </svg>
              </button>
            </div>
            <UnifiedInput
              type="receive"
              label="vTTD"
              value={vTTD}
              setValue={setVTTD}
            />
          </>
        )}

        <div className="flex justify-center">
          {!isConnected ? (
            <Button onClick={handleConnect}>Connect Wallet</Button>
          ) : (
            <>
              <Button className="rounded-2xl px-6" onClick={handleDeposit}>Convert</Button>
            </>
          )}
        </div>
        <VexModal isOpen={isModalOpen} onClose={closeModal} swapType={modalType} refetchApprovals={refreshApprovals}>
          <p>Approve the contract to proceed with the swap.</p>
        </VexModal>
      </Card>
    </main>
  );
}
