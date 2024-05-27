"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseEther } from "viem";
import { toast } from "sonner";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import MUSD_CONTRACT from "../../contracts/mUSD.json";
import { Card, Tab, TabGroup, TabList, TabPanels } from "@tremor/react";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import InputComponent from "@/components/amm/InputWidget";
import DisabledInputComponent from "@/components/amm/DisabledInput";
import Modal from "@/components/amm/Modal";
import VTOKEN_CONTRACT from "../../contracts/vtoken.json";
import SWAP_CONTRACT from "../../contracts/swap.json";
import { parse } from "path";
import { VRT_ADDRESS, VTTD_ADDRESS, SWAP_ADDRESS } from "@/constants/addresses";

export default function AmmPage() {
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const [vRT, setvRT] = useState<number>(0);
  const [vTTD, setvTTD] = useState<number>(0);
  const [Swap, setSwap] = useState<string>("vrt");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const openModal = (type: string) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const vrt_to_vttd = [
    VRT_ADDRESS,
    VTTD_ADDRESS,
    3000,
    address,
    Number(parseEther(vRT.toString())),
    1000000000000000,
    0,
  ];

  const vttd_to_vrt = [
    VTTD_ADDRESS,
    VRT_ADDRESS,
    3000,
    address,
    Number(parseEther(vTTD.toString())),
    1000000000000000,
    0,
  ];

  const handleConnect = () => {
    open();
  };
  const handleSwapVrt = () => {
    setSwap("vrt");
  };
  const handleSwapVttd = () => {
    setSwap("vttd");
  };

  const { writeContract, data: hash } = useWriteContract();
  const {
    isLoading: isConfirming,
    error,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    setvRT(parseFloat((vTTD / 0.97).toFixed(2)));
  }, [vTTD]);

  useEffect(() => {
    setvTTD(parseFloat((vRT * 0.97).toFixed(2)));
  }, [vRT]);

  const { data: vrt_approval } = useReadContract({
    abi: VTOKEN_CONTRACT,
    address: VRT_ADDRESS,
    functionName: "allowance",
    args: [address, SWAP_ADDRESS],
  });

  const { data: vttd_approval } = useReadContract({
    abi: VTOKEN_CONTRACT,
    address: VTTD_ADDRESS,
    functionName: "allowance",
    args: [address, SWAP_ADDRESS],
  });

  const { data: vTTD_balance, refetch: refresh_vttd_balance } = useReadContract(
    {
      abi: VTOKEN_CONTRACT,
      address: VTTD_ADDRESS,
      functionName: "balanceOf",
      args: [address],
    }
  );
  const { data: vRT_balance, refetch: refresh_vrt_balance } = useReadContract({
    abi: VTOKEN_CONTRACT,
    address: VRT_ADDRESS,
    functionName: "balanceOf",
    args: [address],
  });

  const vrt_approve = vrt_approval?.toString();
  const vttd_approve = vttd_approval?.toString();

  const handleDeposit = async () => {
    switch (Swap) {
      case "vrt":
        if (vrt_approve !== "0") {
          try {
            writeContract({
              abi: SWAP_CONTRACT,
              address: SWAP_ADDRESS,
              functionName: "exactInputSingle",
              args: [vrt_to_vttd],
            });
            console.log("Transferring:", vRT);
          } catch (error) {
            console.error("Transaction error:", error);
          }
        } else {
          openModal("vrt");
        }
        break;

      case "vttd":
        if (vttd_approve !== "0") {
          try {
            writeContract({
              abi: SWAP_CONTRACT,
              address: SWAP_ADDRESS,
              functionName: "exactInputSingle",
              args: [vttd_to_vrt],
            });
            console.log("Transferring:", vTTD);
          } catch (error) {
            console.error("Transaction error:", error);
          }
        } else {
          openModal("vttd");
        }
        break;

      default:
        console.error("Invalid Swap value:", Swap);
    }
  };

  const refreshBalances = () => {
    refresh_vrt_balance(), refresh_vttd_balance();
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
      setvRT(0);
      setvTTD(0);
    }
    if (error) {
      toast.error("Transaction Failed");
    }
  }, [isConfirmed, isConfirming, error, hash]);

  return (
    <main>
      <Card className="max-w-md mx-auto rounded-3xl lg:mt-0 mt-14 bg-background">
        <TabGroup>
          <TabList className="my-2">
            <Tab
              className="px-4 rounded-2xl hover:bg-secondary"
              icon={UserGroupIcon}
            >
              Swap
            </Tab>
            <Tab
              className="px-4 rounded-2xl hover:bg-secondary"
              icon={UserIcon}
            >
              Limit Order
            </Tab>
            <Tab
              className="px-4 rounded-2xl hover:bg-secondary"
              icon={UserIcon}
            >
              Pool
            </Tab>
          </TabList>
        </TabGroup>
        {Swap === "vrt" ? (
          <>
            <InputComponent
              type="pay"
              label="vRT"
              value={vRT}
              setValue={setvRT}
            />
            <div className="flex justify-center mb-2">
              <button
                onClick={handleSwapVttd}
                className="btn btn-accent hover:bg-secondary p-2 rounded-xl"
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
            <DisabledInputComponent
              type="receive"
              label="vTTD"
              initialValue={vTTD}
              currency="vTTD"
            />
          </>
        ) : (
          <>
            <InputComponent
              type="pay"
              label="vTTD"
              value={vTTD}
              setValue={setvTTD}
            />
            <div className="flex justify-center mb-2">
              <button
                onClick={handleSwapVrt}
                className="btn btn-accent hover:bg-secondary p-2 rounded-xl"
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
            <DisabledInputComponent
              type="receive"
              label="vRT"
              initialValue={vRT}
              currency="vRT"
            />
          </>
        )}
        <div className="flex justify-center">
          {!isConnected ? (
            <Button onClick={handleConnect}>Connect Wallet</Button>
          ) : (
            <Button className="rounded-2xl px-6 w-full" onClick={handleDeposit}>
              Swap
            </Button>
          )}
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal} swapType={modalType}>
          <p>Approve the contract to proceed with the swap.</p>
        </Modal>
        {address && (
          <div className="p-2 flex flex-col w-full">
            <div className="flex justify-center">
              <h1 className="mt-4 mb-2">Balance:</h1>
            </div>
            <div className="flex flex-row justify-between">
              <h1>vTTD: {(Number(vTTD_balance) / 10 ** 18).toFixed(2)}</h1>
              <h1>vRT: {(Number(vRT_balance) / 10 ** 18).toFixed(2)}</h1>
            </div>
          </div>
        )}
      </Card>
    </main>
  );
}
