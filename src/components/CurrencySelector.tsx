import React, { useState } from "react";
import Modal from "./CurrencyModal";

const CurrencySelector: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const currency = selectedCurrency || "Select a Currency";

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedCurrency(option);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full px-3 lg:px-0 pb-2">
      <button
        className="bg-black border border-gray-600 rounded-2xl w-full py-3 px-4 hover:bg-gray-800"
        onClick={handleButtonClick}
      >
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col text-left">
            <h1 className="text-gray-400">Currency</h1>
            <h1 className="text-lg">{currency}</h1>
          </div>
          <div className="flex flex-col justify-center">^</div>
        </div>
      </button>

      {isModalOpen && <Modal onOptionSelect={handleOptionSelect} />}
    </div>
  );
};

export default CurrencySelector;
