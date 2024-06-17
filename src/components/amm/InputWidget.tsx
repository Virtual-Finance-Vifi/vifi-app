import React, { useState, useEffect } from "react";

interface InputComponentProps {
  label: string;
  value: number;
  setValue: (value: number) => void;
  type: string;
  balance: number;
}

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  value,
  setValue,
  type,
  balance
}) => {
  const [inputValue, setInputValue] = useState<string>(
    value !== 0 ? value.toString() : ""
  );

  useEffect(() => {
    setInputValue(value !== 0 ? value.toString() : "");
  }, [value]);

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
    <div className="flex border rounded-2xl items-left flex-col flex-grow pt-6 mb-4">
      <div className="mb-6">
        <h1 className="mb-2 ml-3 text-white">
          {type === "pay" ? "You pay" : "You receive"}
        </h1>
        <div className="flex flex-row items-center">
          <input
            type="number"
            value={inputValue}
            onChange={handleChange}
            placeholder="0"
            className="ml-2 bg-background input input-ghost text-3xl focus:text-white focus:outline-none focus:bg-transparent 
            h-[2.2rem] min-h-[2.2rem] px-1 font-medium placeholder:text-gray-350 text-gray-400 
            overflow-hidden text-ellipsis whitespace-nowrap w-auto"
          />
          <h1 className="mr-6 ml-4 text-gray-400 text-2xl">{label}</h1>
        </div>
        <h1 className="ml-3">Balance: {(Number(balance) / 10 ** 18).toFixed(2)}</h1>
      </div>
    </div>
  );
};

export default InputComponent;
