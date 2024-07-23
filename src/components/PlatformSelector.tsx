import React, { useState } from "react";
import PlatformModal from "./PlatformModal";

interface Platform {
  name: string;
  currencies: string[];
  flag: string;
}

interface PlatformSelectorProps {
  title: string;
  onSelect: (platform: Platform) => void;
}

const platforms: Platform[] = [
  { name: 'Venmo', currencies: ['USD'], flag: '🇺🇸' },
  { name: 'Kotani Pay', currencies: ['KES'], flag: '🇰🇪' },
  { name: 'Garanti', currencies: ['TRY'], flag: '🇹🇷' },
  { name: 'Wam', currencies: ['TTD'], flag: '🇹🇹' },
];

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ title, onSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(platforms[0]);
  const platform = selectedPlatform ? selectedPlatform.name : "Select a Platform";

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleOptionSelect = (platformName: string) => {
    const platform = platforms.find(p => p.name === platformName);
    if (platform) {
      setSelectedPlatform(platform);
      onSelect(platform);
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
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
          <div className="flex flex-col justify-center"><img src="/arrow_down.png" alt="arrow down icon" /></div>
        </div>
      </button>

      {isModalOpen && <PlatformModal onOptionSelect={handleOptionSelect} onClose={handleCloseModal} />}
    </div>
  );
};

export default PlatformSelector;
