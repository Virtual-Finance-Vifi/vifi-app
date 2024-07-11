import React from 'react';

interface CurrencyInputProps {
  heading: string;
  currency: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ heading, currency }) => {
  return (
    <div className="flex items-center justify-between border border-gray-600 bg-gray-900 text-gray-400 rounded-2xl p-3 w-full mb-2">
      <div className="flex flex-col">
        <span>{heading}</span>
        <span className="text-2xl">0</span>
      </div>
      <div className="text-2xl">{currency}</div>
    </div>
  );
};

export default CurrencyInput;
