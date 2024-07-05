"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
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
import { Card, Tab, TabGroup, TabList } from "@tremor/react";
import InputComponent from "./Input";
import Modal from "./Modal";
import VTOKEN_CONTRACT from "@/contracts/vtoken.json";
import SWAP_CONTRACT from "@/contracts/swap.json";
import VARQ_CONTRACT from "@/contracts/varq.json";
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";
import { addresses } from "@/constants/addresses";

export default function Markets() {
  const chainId = getChainId(config);
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const [vRT, setvRT] = useState<number>(0);
  const [vTTD, setvTTD] = useState<number>(0);
  const [receiveVRT, setReceiveVRT] = useState<number>(0);
  const [receiveVTTD, setReceiveVTTD] = useState<number>(0);
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
    addresses[chainId]["vrt"],
    addresses[chainId]["vttd"],
    500,
    address,
    Number(parseEther(vRT.toString())),
    1000000000000000,
    0,
  ];

  const vttd_to_vrt = [
    addresses[chainId]["vttd"],
    addresses[chainId]["vrt"],
    500,
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

  const { writeContract, data: hash, error: the_error, isError } = useWriteContract();
  const {
    isLoading: isConfirming,
    error,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: vrt_approval, refetch: refetch_vrt_approval } = useReadContract(
    {
      abi: VTOKEN_CONTRACT,
      address: addresses[chainId]["vrt"],
      functionName: "allowance",
      args: [address, addresses[chainId]["swap"]],
    }
  );

  const { data: vttd_approval, refetch: refetch_vttd_approval } =
    useReadContract({
      abi: VTOKEN_CONTRACT,
      address: addresses[chainId]["vttd"],
      functionName: "allowance",
      args: [address, addresses[chainId]["swap"]],
    });

  const { data: vTTD_balance, refetch: refresh_vttd_balance } = useReadContract(
    {
      abi: VTOKEN_CONTRACT,
      address: addresses[chainId]["vttd"],
      functionName: "balanceOf",
      args: [address],
    }
  );
  const { data: vRT_balance, refetch: refresh_vrt_balance } = useReadContract({
    abi: VTOKEN_CONTRACT,
    address: addresses[chainId]["vrt"],
    functionName: "balanceOf",
    args: [address],
  });

  const { data: cb_rate, refetch: refresh_cb_rate } = useReadContract({
    abi: VARQ_CONTRACT,
    address: addresses[chainId]["varq"],
    functionName: "CBrate",
  });

  const formatted_cb_rate = Number(cb_rate) / 10 ** 2;

  useEffect(() => {
    if (formatted_cb_rate !== undefined && !Number.isNaN(formatted_cb_rate)) {
      setReceiveVRT(parseFloat((vTTD - 0.0005 * vTTD).toFixed(3)));
    }
  }, [vTTD]);

  useEffect(() => {
    if (formatted_cb_rate !== undefined && !Number.isNaN(formatted_cb_rate)) {
      console.log("cb rate = ", formatted_cb_rate);
      setReceiveVTTD(parseFloat((vRT - 0.0005 * vRT).toFixed(3)));
    }
  }, [vRT]);

  const vrt_approve = vrt_approval?.toString();
  const vttd_approve = vttd_approval?.toString();

  const vTTD_balance_number = vTTD_balance ? Number(vTTD_balance) : 0;
  const vRT_balance_number = vRT_balance ? Number(vRT_balance) : 0;

  const handleDeposit = async () => {
    switch (Swap) {
      case "vrt":
        if (vrt_approve !== "0") {
          try {
            writeContract({
              abi: SWAP_CONTRACT,
              address: addresses[chainId]["swap"],
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
              address: addresses[chainId]["swap"],
              functionName: "exactInputSingle",
              args: [vttd_to_vrt],
            });
            if (isError) {
              console.log("Error - ", the_error)
            }
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

  const refreshApprovals = () => {
    refetch_vrt_approval(), refetch_vttd_approval();
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
            window.open(`${addresses[chainId]['blockexplorer']}/tx/${hash}`);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, isConfirming, error, hash]);

  return (
    <main className="pt-6">
      <Card className="max-w-md mx-auto rounded-3xl lg:mt-0 bg-background">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <Image
              src="/amm-logo.svg"
              alt="amm-logo"
              width={58}
              height={58}
              priority
            />
            <h1 className="ml-2 text-[#68AAFF] lg:text-3xl font-bold">Markets</h1>
          </div>

          <Image
            src="/settings_icon.svg"
            alt="settings icon"
            width={32}
            height={32}
            priority
          />
        </div>

        <TabGroup>
          <TabList className="my-2">
            <Tab
              className="px-4 rounded-2xl bg-secondary"
              // icon={UserGroupIcon}
            >
              Swap
            </Tab>
            <Tab className="px-4 rounded-2xl">Limit Order</Tab>
            <Tab className="px-4 rounded-2xl">Pool</Tab>
          </TabList>
        </TabGroup>
        {Swap === "vrt" ? (
          <>
            <InputComponent
              type="pay"
              label="vRT"
              value={vRT}
              setValue={setvRT}
              balance={vRT_balance_number}
            />

            <div className="flex justify-center mb-2">
              <button
                onClick={handleSwapVttd}
                className="btn btn-accent hover:bg-secondary p-2 border border-[#8FA2B7] rounded-xl"
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
            <InputComponent
              type="receive"
              value={receiveVTTD}
              setValue={setReceiveVTTD}
              label="vTTD"
              balance={vTTD_balance_number}
              disabled={true}
            />
          </>
        ) : (
          <>
            <InputComponent
              type="pay"
              label="vTTD"
              value={vTTD}
              setValue={setvTTD}
              balance={vTTD_balance_number}
            />
            <div className="flex justify-center mb-2">
              <button
                onClick={handleSwapVrt}
                className="btn btn-accent hover:bg-secondary p-2 border rounded-xl"
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
            <InputComponent
              type="receive"
              value={receiveVRT}
              label="vRT"
              balance={vRT_balance_number}
              setValue={setReceiveVRT}
              disabled={true}
            />
          </>
        )}
        <div className="flex justify-center">
          {!isConnected ? (
            <Button
              className="rounded-2xl px-6 w-full bg-[#68AAFF] hover:bg-[#87b9fb] font-semibold"
              onClick={handleConnect}
            >
              Connect Wallet
            </Button>
          ) : (
            <Button
              className="rounded-2xl px-6 w-full bg-[#68AAFF] hover:bg-[#87b9fb] font-semibold"
              onClick={handleDeposit}
            >
              Swap
            </Button>
          )}
        </div>
        <div className="py-10">Here you can provide liqduity to the protocol by swapping Reserve Tokens for vFCT markets. More Market Maker features will be added in the future.</div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          swapType={modalType}
          refetchApprovals={refreshApprovals}
        >
          <p>Approve the contract to proceed with the swap.</p>
        </Modal>
      </Card>
    </main>
  );
}
