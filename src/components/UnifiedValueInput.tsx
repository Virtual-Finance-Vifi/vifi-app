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
    <div className="flex rounded-2xl items-left flex-col flex-grow pt-6 mb-4">
      <div className="mb-6 rounded-lg bg-inherit border border-slate-500">
        <div className="flex flex-row">
          {type && (
            <h1 className="mb-2 ml-3 text-white" style={{color:"var(--background)", filter:"invert(1)"}}>
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
          <h1 className="mb-2 ml-3 text-white" style={{color:"var(--background)", filter:"invert(1)"}}>{label}</h1>
        </div>
        <input
          type="number"
          value={inputValue}
          onChange={handleChange}
          placeholder="0"
          disabled={disabled}
          className="pl-3 bg-inherit input input-ghost text-3xl focus:text-white focus:outline-none focus:bg-transparent 
          h-[2.2rem] min-h-[2.2rem] px-1 font-medium placeholder:text-gray-350 text-gray-400 w-full 
          overflow-hidden text-ellipsis whitespace-nowrap"
          style={{color:"var(--background)", filter:"invert(1)"}}
        />
        {balance ? (
          <h1 className="ml-3 text-white">
            Balance: {(Number(balance) / 10 ** 18).toFixed(2)}
          </h1>
        ) : (
          <h1 className="ml-3 text-white">Balance: 0</h1>
        )}
      </div>
    </div>
  );
};

export default UnifiedInput;