import React from "react";

interface ModalProps {
  onOptionSelect: (option: string) => void;
}

const Modal: React.FC<ModalProps> = ({ onOptionSelect }) => {
  const options = ["USD", "Currency 2", "Currency 3"];

  return (
    <div className="border border-red-500 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="p-6 bg-gray-900 rounded-lg shadow-lg border border-gray-600">
        <h2 className="text-lg font-bold mb-4">Select a Platform</h2>
        <ul>
          {options.map((option) => (
            <li
              key={option}
              className="py-2 px-4 hover:bg-gray-800 cursor-pointer"
              onClick={() => onOptionSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Modal;
