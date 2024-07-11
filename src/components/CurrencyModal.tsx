import React from "react";

interface ModalProps {
  onOptionSelect: (option: string) => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onOptionSelect, onClose }) => {
  const options = [
    { currency: "USD" },
    { currency: "INR" },
    { currency: "TRY" },
    { currency: "EUR, GBP, SGD, USD" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-600 w-96">
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <h2 className="text-lg">Select a Currency</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-3xl"
          >
            &times;
          </button>
        </div>
        <ul>
          {options.map((option) => (
            <li
              key={option.currency}
              className="flex justify-between items-center p-4 hover:bg-gray-800 cursor-pointer"
              onClick={() => onOptionSelect(option.currency)}
            >
              <div className="flex items-center space-x-4 p-2">
                <span className="material-icons text-white">
                  <img src="/dollar_symbol.png" />
                </span>
                <span className="text-gray-400">{option.currency}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="p-4 text-gray-400 border-t border-gray-600 text-center">
          Let us know which platforms you are interested in seeing ZKP2P add
          support for.{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Give feedback
          </a>
        </div>
      </div>
    </div>
  );
};

export default Modal;
