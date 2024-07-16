import React, { useState, useEffect } from "react";
import CurrencyModal from "./CurrencyModal";

interface Platform {
  name: string;
  currencies: string[];
  flag: string;
}

interface CurrencySelectorProps {
  selectedPlatform: Platform | null;
  onSelect: (currency: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedPlatform,
  onSelect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");

  useEffect(() => {
    if (selectedPlatform) {
      setSelectedCurrency(selectedPlatform.currencies[0]);
      onSelect(selectedPlatform.currencies[0]);
    }
  }, [selectedPlatform]);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedCurrency(option);
    onSelect(option);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full px-3 lg:px-0 pb-2">
      <button
        className="bg-black border border-gray-600 rounded-2xl w-full py-3 px-4 hover:bg-gray-800"
        onClick={handleButtonClick}
      >
        <div className="flex flex-row justify-between w-full">
          <h1 className="text-2xl flex items-center">
            {selectedPlatform ? `${selectedPlatform.flag}` : ""}
          </h1>
          <div className="flex flex-col text-left mr-8">
            <h1 className="text-gray-400">Currency</h1>
            <h1 className="text-lg">
              {selectedCurrency || "Select a Currency"}
            </h1>
          </div>
          <div className="flex flex-col justify-center">
            <img src="arrow_down.png" alt="arrow down icon" />
          </div>
        </div>
      </button>

      {isModalOpen && selectedPlatform && (
        <CurrencyModal
          currencies={selectedPlatform.currencies}
          onOptionSelect={handleOptionSelect}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CurrencySelector;
