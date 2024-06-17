import React, { useState, useEffect } from "react";

interface DisabledInputComponentProps {
  type: string;
  label: string;
  initialValue: number;
  currency: string;
  balance: number;
}

const DisabledInputComponent: React.FC<DisabledInputComponentProps> = ({
  type,
  label,
  initialValue,
  currency,
  balance,
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const formattedValue = `${value} ${currency}`;

  return (
    <div className="flex border rounded-2xl items-left flex-col flex-grow pt-6 mb-4">
      <div className="mb-6">
        <h1 className="mb-2 ml-3 text-white">{type === 'pay' ? 'You pay' : 'You receive (≈)'}</h1>
        <input
          disabled
          type="text"
          value={formattedValue}
          placeholder="0"
          className="indent-3 bg-background input input-ghost text-3xl focus:text-white focus:outline-none focus:bg-transparent 
          h-[2.2rem] min-h-[2.2rem] px-1 font-medium placeholder:text-accent/50 text-gray-400 w-full 
          overflow-hidden text-ellipsis whitespace-nowrap"
        />
        <h1 className="ml-3">Balance: {(Number(balance) / 10 ** 18).toFixed(2)}</h1>
      </div>
    </div>
  );
};

export default DisabledInputComponent;
