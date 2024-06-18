import React, { useState } from "react";

interface UnifiedInputProps {
  label: string;
  value: number;
  setValue: (value: number) => void;
  type?: string;
  disabled?: boolean;
  balance: number;
}

const UnifiedInput: React.FC<UnifiedInputProps> = ({
  label,
  value,
  setValue,
  type,
  disabled,
  balance,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    value !== 0 ? value.toString() : ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const parsedValue = parseFloat(newValue);
    if (!isNaN(parsedValue)) {
      setValue(parsedValue);
    } else {
      setValue(0);
    }
  };

  return (
    <div className="border border-[#8FA2B7] w-full flex rounded-2xl items-left flex-col flex-grow pt-4 mb-4">
      <div className="pb-4">
        <div className="flex flex-row">
          {type && (
            <h1 className="mb-2 ml-3">
              {type === "deposit"
                ? "Deposit"
                : type === "withdraw"
                ? "Withdraw"
                : type === "pay"
                ? "You Pay"
                : type === "receive"
                ? "You receive (≈)"
                : ""}
            </h1>
          )}
          <h1 className="mb-2 ml-3">{label}</h1>
        </div>
        <input
          type="number"
          value={inputValue}
          onChange={handleChange}
          placeholder="0"
          disabled={disabled}
          className="ml-2 pb-2 bg-background input input-ghost text-3xl text-gray-400 focus:text-primary focus:dark:text-dark-primary focus:outline-none 
          h-[2.2rem] min-h-[2.2rem] px-1 font-medium  
          overflow-hidden text-ellipsis whitespace-nowrap w-auto"
          // style={{color:"var(--background)", filter:"invert(1)"}}
        />
        {balance ? (
          <h1 className="ml-3">
            Balance: {(Number(balance) / 10 ** 18).toFixed(2)}
          </h1>
        ) : (
          <h1 className="ml-3">Balance: 0</h1>
        )}
      </div>
    </div>
  );
};

export default UnifiedInput;
