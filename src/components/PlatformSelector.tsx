import React, { useState } from "react";
import Modal from "./PlatformModal";

interface PlatformSelectorProps {
  title: string;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("Venmo");
  const platform = selectedPlatform || "Select a Platform";

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedPlatform(option);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full px-3 lg:px-0 lg:pr-3 pb-2 lg:pb-0">
      <button
        className="bg-black border border-gray-600 rounded-2xl w-full py-3 px-4 hover:bg-gray-800"
        onClick={handleButtonClick}
      >
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col text-left">
            <h1 className="text-gray-400">{title}</h1>
            <h1 className="text-lg">{platform}</h1>
          </div>
          <div className="flex flex-col justify-center">^</div>
        </div>
      </button>

      {isModalOpen && <Modal onOptionSelect={handleOptionSelect} />}
    </div>
  );
};

export default PlatformSelector;
