"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { parseEther } from "viem";
import { toast } from "sonner";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import VEX_CONTRACT from "../../contracts/vex.json";
import { Card } from "@tremor/react";
import UnifiedInput from "@/components/UnifiedValueInput";
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";
import { addresses } from "@/constants/addresses";
import VexModal from "@/components/swap/VexModal";
import VTOKEN_CONTRACT from "@/contracts/vtoken.json";

export default function Vex() {
  const chainId = getChainId(config);
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const [vUSD, setVUSD] = useState<number>(0);
  const [vTTD, setVTTD] = useState<number>(0);
  const [Swap, setSwap] = useState<string>("vTTD");
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
  const handleSwapVUSD = () => {
    // console.log("swap set vusd");
    setSwap("vUSD");
  };
  const handleSwapVTTD = () => {
    setSwap("vTTD");
    // console.log("swap set vttd", Swap === "vTTD");
  };
  const { writeContract, data: hash, error } = useWriteContract();

  const {
    isLoading: isConfirming,
    isError: receiptError,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const transfer_vUSD = parseEther(vUSD.toString());
  const transfer_vTTD = parseEther(vTTD.toString());

  const { data: vTTD_balance, refetch: refresh_vTTD_balance } = useReadContract(
    {
      abi: VTOKEN_CONTRACT,
      address: addresses[chainId]["vttd"],
      functionName: "balanceOf",
      args: [address],
    }
  );
  const { data: vUSD_balance, refetch: refresh_vUSD_balance } = useReadContract(
    {
      abi: VTOKEN_CONTRACT,
      address: addresses[chainId]["vusd"],
      functionName: "balanceOf",
      args: [address],
    }
  );

  const { data: vUSD_approval, refetch: refetch_vUSD_approval } =
    useReadContract({
      abi: VTOKEN_CONTRACT,
      address: addresses[chainId]["vusd"],
      functionName: "allowance",
      args: [address, addresses[chainId]["vex"]],
    });

  const { data: vTTD_approval, refetch: refetch_vTTD_approval } =
    useReadContract({
      abi: VTOKEN_CONTRACT,
      address: addresses[chainId]["vttd"],
      functionName: "allowance",
      args: [address, addresses[chainId]["vex"]],
    });

  // console.log("vUSD approval:", vUSD_approval?.toString());
  // console.log("vTTD approval:", vTTD_approval?.toString());
  const vTTD_balance_number = vTTD_balance ? Number(vTTD_balance) : 0;
  const vUSD_balance_number = vUSD_balance ? Number(vUSD_balance) : 0;

  const refreshBalances = () => {
    refresh_vUSD_balance(), refresh_vTTD_balance();
  };

  const refreshApprovals = () => {
    refetch_vUSD_approval(), refetch_vTTD_approval();
  };

  const handleDeposit = () => {
    switch (Swap) {
      case "vUSD":
        if (vUSD_approval?.toString() !== "0") {
          try {
            writeContract({
              abi: VEX_CONTRACT,
              address: addresses[chainId]["vex"],
              functionName: "swapVexIn",
              args: [transfer_vUSD],
            });
            console.log("Transferring:", transfer_vUSD);
          } catch (error) {
            console.error("Transaction error:", error);
          }
        } else {
          openModal("vUSD");
        }
        break;

      case "vTTD":
        if (vTTD_approval?.toString() !== "0") {
          try {
            writeContract({
              abi: VEX_CONTRACT,
              address: addresses[chainId]["vex"],
              functionName: "swapVexOut",
              args: [transfer_vTTD],
            });
            console.log("Transferring:", transfer_vTTD);
          } catch (error) {
            console.error("Transaction error:", error);
          }
        } else {
          openModal("vTTD");
        }
        break;

      default:
        console.log("Error!Invalid swap value:", Swap);
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
    <main className="pt-6">
      <Card className="max-w-md mx-auto rounded-3xl lg:mt-0 mt-14 bg-background">
        <div className="flex flex-row items-center justify-between pb-4">
          <div className="flex flex-row items-center">
            <Image
              src="/swap-logo.svg"
              alt="swap-logo"
              width={58}
              height={58}
              priority
            />
            <h1 className="ml-2 text-[#FFCB05] lg:text-3xl font-bold">Swap</h1>
          </div>

          <Image
            src="/settings_icon.svg"
            alt="settings icon"
            width={32}
            height={32}
            priority
          />
        </div>
        {Swap === "vTTD" ? (
          <>
            <UnifiedInput
              type="pay"
              label="vTTD"
              value={vTTD}
              setValue={setVTTD}
              balance={vTTD_balance_number}
            />
            <div className="flex justify-center mb-2">
              <button
                className="btn btn-accent hover:bg-secondary p-2 border border-[#8FA2B7] rounded-xl"
                onClick={handleSwapVUSD}
              >
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
              label="vUSD"
              value={vUSD}
              setValue={setVUSD}
              balance={vUSD_balance_number}
            />
          </>
        ) : (
          <>
            <UnifiedInput
              type="pay"
              label="vUSD"
              value={vUSD}
              setValue={setVUSD}
              balance={vUSD_balance_number}
            />
            <div className="flex justify-center mb-2">
              <button
                className="btn btn-accent hover:bg-secondary p-2 rounded-xl"
                onClick={handleSwapVTTD}
              >
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
              balance={vTTD_balance_number}
            />
          </>
        )}

        <div className="flex justify-center">
          {!isConnected ? (
            <Button
              className="rounded-2xl px-6 w-full bg-[#FFCB05] hover:bg-[#FBD873] font-semibold"
              onClick={handleConnect}
            >
              Connect Wallet
            </Button>
          ) : (
            <>
              <Button
                className="rounded-2xl px-6 w-full bg-[#FFCB05] hover:bg-[#FBD873] font-semibold"
                onClick={handleDeposit}
              >
                Convert
              </Button>
            </>
          )}
        </div>
        <VexModal
          isOpen={isModalOpen}
          onClose={closeModal}
          swapType={modalType}
          refetchApprovals={refreshApprovals}
        >
          <p>Approve the contract to proceed with the swap.</p>
        </VexModal>
      </Card>
    </main>
  );
}
