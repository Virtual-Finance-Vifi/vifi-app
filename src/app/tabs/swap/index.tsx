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
import { formatEther, parseEther } from "viem";
import { toast } from "sonner";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import VEX_CONTRACT from "@/contracts/vex.json";
import { Card } from "@tremor/react";
import UnifiedInput from "@/components/UnifiedValueInput";
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";
import { addresses } from "@/constants/addresses";
import VexModal from "./VexModal";
import VTOKEN_CONTRACT from "@/contracts/vtoken.json";
import MUSD_CONTRACT from "@/contracts/mUSD.json";
import CustomToast from "@/components/CustomToast";

export default function Vex() {
  const chainId = getChainId(config);
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const [mUSD, setMUSD] = useState<number>(0);
  const [vTTD, setVTTD] = useState<number>(0);
  const [receiveMUSD, setReceiveMUSD] = useState<number>(0);
  const [receiveVTTD, setReceiveVTTD] = useState<number>(0);
  const [Swap, setSwap] = useState<string>("mUSD");
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
    setSwap("mUSD");
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

  const transfer_mUSD = parseEther(mUSD.toString());
  const transfer_vTTD = parseEther(vTTD.toString());


  const { data: vTTD_balance, refetch: refresh_vTTD_balance } = useReadContract(
    {
      abi: VTOKEN_CONTRACT,
      address: addresses[chainId]["vttd"],
      functionName: "balanceOf",
      args: [address],
    }
  );
  const { data: mUSD_balance, refetch: refresh_mUSD_balance } = useReadContract(
    {
      abi: MUSD_CONTRACT,
      address: addresses[chainId]["musd"],
      functionName: "balanceOf",
      args: [address],
    }
  );
  //console.log(mUSD_balance)
  const { data: mUSD_approval, refetch: refetch_mUSD_approval } =
    useReadContract({
      abi: MUSD_CONTRACT,
      address: addresses[chainId]["musd"],
      functionName: "allowance",
      args: [address, addresses[chainId]["vex"]],
    });

  
  //console.log(mUSD_approval?.toString)
  //console.log(error)
  const { data: vTTD_approval, refetch: refetch_vTTD_approval } =
    useReadContract({
      abi: VTOKEN_CONTRACT,
      address: addresses[chainId]["vttd"],
      functionName: "allowance",
      args: [address, addresses[chainId]["vex"]],
    });

  const vTTD_balance_number = vTTD_balance ? Number(vTTD_balance) : 0;
  const mUSD_balance_number = mUSD_balance ? Number(mUSD_balance) : 0;

  const refreshBalances = () => {
    refresh_mUSD_balance(), refresh_vTTD_balance();
  };

  const refreshApprovals = () => {
    refetch_mUSD_approval(), refetch_vTTD_approval();
  };

  const handleDeposit = () => {
    switch (Swap) {
      case "mUSD":
        if (mUSD_approval?.toString() !== "0") {
          try {
            writeContract({
              abi: VEX_CONTRACT,
              address: addresses[chainId]["vex"],
              functionName: "swapVexIn_RWA",
              args: [transfer_mUSD],
            });
            console.log("Transferring:", transfer_mUSD);
            toast.loading(
              <CustomToast
                message="Waiting for confirmation..."
                message2="ETA: 2 min 25 sec. Take a walk :)"
                gifUrl="walking_orange.gif"
                tokenIcon1="usdc_icon.svg"
                tokenIcon2="ttd_icon.svg"
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
          } catch (error) {
            console.error("Transaction error:", error);
          }
        } else {
          openModal("mUSD");
        }
        break;

      case "vTTD":
        if (vTTD_approval?.toString() !== "0") {
          try {
            writeContract({
              abi: VEX_CONTRACT,
              address: addresses[chainId]["vex"],
              functionName: "swapVexOut_RWA",
              args: [transfer_vTTD],
            });
            console.log("Transferring:", transfer_vTTD);
            toast.loading(
              <CustomToast
                message="Waiting for confirmation..."
                message2="ETA: 2 min 25 sec. Take a walk :)"
                gifUrl="walking_orange.gif"
                tokenIcon1="usdc_icon.svg"
                tokenIcon2="ttd_icon.svg"
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
      toast.loading(
        <CustomToast
          message="Transaction Pending ..."
          message2="Your transaction has been submitted. Please check in a while."
          gifUrl="pending_lemon.gif"
          tokenIcon1="usdc_icon.svg"
          tokenIcon2="ttd_icon.svg"
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
          tokenIcon1="usdc_icon.svg"
          tokenIcon2="ttd_icon.svg"
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
      refreshBalances();
      setMUSD(0);
      setVTTD(0);
    }
    if (error) {
      toast.error(
        <CustomToast 
          message="Transaction Failed"
          message2="Error Details"
          gifUrl="confused_apple.gif"
          tokenIcon1="usdc_icon.svg"
          tokenIcon2="ttd_icon.svg"
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
              label="mUSD"
              value={receiveMUSD}
              setValue={setReceiveMUSD}
              balance={mUSD_balance_number}
              disabled={true}
            />
          </>
        ) : (
          <>
            <UnifiedInput
              type="pay"
              label="mUSD"
              value={mUSD}
              setValue={setMUSD}
              balance={mUSD_balance_number}
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
              value={receiveVTTD}
              // setValue={setVTTD}
              setValue={setReceiveVTTD}
              balance={vTTD_balance_number}
              disabled={true}
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
        <div className="pt-10">
          Easily swap USD stablecoins for any vFCT that we support. Use our
          Faucet to get Mock USDC to try it out.
        </div>
        <VexModal
          isOpen={isModalOpen}
          onClose={closeModal}
          swapType={modalType}
          refetchApprovals={refreshApprovals}
        >
          <p>Approve the contract to proceed with the swap.</p>
        </VexModal>
        <Button className="bg-blue-400">
          check rate
        </Button>
      </Card>
    </main>
  );
}
