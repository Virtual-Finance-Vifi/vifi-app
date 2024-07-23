"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useAccount, useReadContract } from "wagmi";
import MUSD_CONTRACT from "@/contracts/mUSD.json";
import { addresses } from "@/constants/addresses";

// Define the context type
interface BalanceContextType {
  balance: number | null;
  refreshBalance: () => void;
}

const BalanceContext = createContext<BalanceContextType>({
  balance: null,
  refreshBalance: () => {},
});

interface BalanceProviderProps {
  children: ReactNode;
}

export const BalanceProvider: React.FC<BalanceProviderProps> = ({
  children,
}) => {
  const [balance, setBalance] = useState<number | null>(null);
  const { address, chain } = useAccount();

  const { data: mUSDC_balance, refetch } = useReadContract({
    abi: MUSD_CONTRACT,
    address: chain?.id ? addresses[chain.id]?.musd : undefined,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (mUSDC_balance !== undefined) {
      const newMusdcBalance = Number(mUSDC_balance);
      setBalance(newMusdcBalance);
    }
  }, [mUSDC_balance]);

  return (
    <BalanceContext.Provider value={{ balance, refreshBalance: refetch }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => useContext(BalanceContext);
