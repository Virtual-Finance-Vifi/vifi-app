import React, { useState } from 'react';

interface UnifiedInputProps {
  label: string;
  value: number;
  setValue: (value: number) => void;
  type?: string;
  disabled?:boolean;
}

const UnifiedInput: React.FC<UnifiedInputProps> = ({ label, value, setValue, type , disabled}) => {
  const [inputValue, setInputValue] = useState<string>(value !== 0 ? value.toString() : "");

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
    <div className="flex bg-[#2b3655] rounded-2xl items-left flex-col flex-grow pt-6 mb-4">
      <div className="mb-6">
        <div className="flex flex-row">
          {type && (
            <h1 className="mb-2 ml-3 text-white">
              {type === 'deposit' ? 'Deposit' :
                type === 'withdraw' ? 'Withdraw' :
                  type === 'pay' ? 'You Pay' :
                    type === 'receive' ? 'You receive (≈)' : ''}
            </h1>
          )}
          <h1 className="mb-2 ml-3 text-white">{label}</h1>
        </div>
        <input
          type="number"
          value={inputValue}
          onChange={handleChange}
          placeholder="0"
          disabled={disabled}
          className="indent-3 bg-[#2b3655] input input-ghost text-3xl focus:text-white focus:outline-none focus:bg-transparent 
          h-[2.2rem] min-h-[2.2rem] px-1 font-medium placeholder:text-gray-350 text-gray-400 w-full 
          overflow-hidden text-ellipsis whitespace-nowrap"
        />
      </div>
    </div>
  );
};

export default UnifiedInput;
