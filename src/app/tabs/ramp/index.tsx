import React, { useState } from 'react';
import PlatformSelector from '@/components/PlatformSelector';
import CurrencySelector from '@/components/CurrencySelector';
import CurrencyInput from '@/components/CurrencyInput';

interface Platform {
  name: string;
  currencies: string[];
  flag: string;
}

const SwapComponent: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>({
    name: 'Venmo',
    currencies: ['USD'],
    flag: '🇺🇸',
  });
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setSelectedCurrency(platform.currencies[0]);
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
  };

  return (
    <main className="md:pt-6">
      <div className="flex flex-col lg:flex-row lg:justify-center lg:max-w-md mx-auto">
        <PlatformSelector title="Platform" onSelect={handlePlatformSelect} />
        <CurrencySelector selectedPlatform={selectedPlatform} onSelect={handleCurrencySelect} />
      </div>
      <div className="mx-3 lg:mx-auto flex flex-col justify-center lg:max-w-md">
        <CurrencyInput heading="Requesting" currency={`v${selectedCurrency}`} />
        <CurrencyInput heading="You send" currency={selectedCurrency} />
        <button className="border border-gray-600 bg-red-600 p-3 rounded-full hover:bg-red-500">
          Connect Wallet
        </button>
      </div>
    </main>
  );
};

export default SwapComponent;
