import React, { useState } from 'react';
import PlatformSelector from '@/components/PlatformSelector';
import ProviderSelector from '@/components/ProviderSelector';
import CurrencySelector from '@/components/CurrencySelector';
import CurrencyInput from '@/components/CurrencyInput';
import InputComponent from "./Input"
import { useBalance } from "@/contexts/Balance";
import { addresses } from '@/constants/addresses';
import { useAccount, useReadContract } from 'wagmi';
import VTOKEN_CONTRACT from "@/contracts/vtoken.json";
import { getChainId } from "@wagmi/core";
import { config } from "@/configs";


interface Platform {
  name: string;
  currencies: string[];
  flag: string;
}

const SwapComponent: React.FC = () => {
  const chainId = getChainId(config);
  const { address } = useAccount();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [amount, setamount] = useState<number>(0);
  const { isConnected } = useAccount();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>({
    name: 'M-PESA',
    currencies: ['KES'],
    flag: '🇰🇪',
  });
  

  const { data: balance, refetch: refresh_vTTD_balance } = useReadContract(
    {
      abi: VTOKEN_CONTRACT,
      address: addresses[chainId]["vttd"],
      functionName: "balanceOf",
      args: [address],
    }
  );

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setSelectedCurrency(platform.currencies[0]);
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
  };

  const handleProvider = () => {
    
  }

  return (
    <main className="md:pt-6">
      <div className="flex flex-col lg:flex-row lg:justify-center lg:max-w-md mx-auto">
        <PlatformSelector title="Platform" onSelect={handlePlatformSelect} />
        <CurrencySelector selectedPlatform={selectedPlatform} onSelect={handleCurrencySelect} />
      </div>
      <div className="mx-3 lg:mx-auto flex flex-col justify-center lg:max-w-md">
        <div className="my-4">
          <ProviderSelector title="Provider" onSelect={handleProvider} />
        </div>
        <InputComponent
          label="Amount"
          type="receive"
          initialValue={0}
          onValueChange={setamount}
          balance={balance as number }
        />
        <InputComponent
          label="Mobile Number"
          type="mobile"
          initialValue={0}
          balance={balance as number }
        />
        <div className="flex items-center justify-between bg-gray-900 text-gray-400 rounded-2xl p-4 w-full border border-gray-600 mb-4">
          <div className="flex flex-col">
            <span>Provider Percentage: 0.02%</span>
            <span>{`Provider Fees: ${amount * 0.002}`}</span>
            <span className="text-2xl">{`You receive: ${amount - (amount * 0.002)}`}</span>
          </div>
        </div>
        <button className="border border-gray-600 bg-red-600 p-3 rounded-full hover:bg-red-500">
          Send Money
        </button>
      </div>
    </main>
  );
};

export default SwapComponent;
