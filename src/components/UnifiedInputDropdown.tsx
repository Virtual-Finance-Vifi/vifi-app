import React, { ReactElement, ReactHTMLElement, useEffect, useState } from "react";
import  Select, {StylesConfig, SingleValue, ActionMeta,MultiValue} from "react-select";

const customStyles: StylesConfig<OptionsType> = {
    control: (provided) => ({
      ...provided,
      borderRadius: '0.5rem',  // Equivalent to Tailwind's `rounded-lg`
      borderColor: '#8FA2B7',  // Custom border color
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#8FA2B7',
      },
      marginLeft:'auto',
      backgroundColor:'#080A0C',
      height:'4rem',
      maxWidth:'10rem'
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.5rem',  // Equivalent to Tailwind's `rounded-lg`
      marginTop: '0px',
      backgroundColor: '#080A0C',  // Background color for the dropdown menu
      
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#007bff' : '#ffffff',
      color: state.isSelected ? '#ffffff' : '#000000',
      padding: '0.5rem 1rem',  // Equivalent to Tailwind's `p-2 pl-4`
      '&:hover': {
        backgroundColor: '#e9ecef',  // Hover effect similar to Tailwind's `hover:bg-gray-200`
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      fontSize:'16px',
      textOverflow:'ellipsis',
      whiteSpace:'nowrap',
      overflow:'hidden',
      maxWidth: 'calc(100% - 20px)',
      color:'white'
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#8FA2B7',
      '&:hover': {
        color: '#8FA2B7',
      },
    }),
    valueContainer:(provided)=>({
        ...provided,
        padding: '0',  // Remove any padding that might push the content down
        display: 'flex',
        alignItems: 'center',  // Vertically center the selected option
        overflow: 'hidden',  // Hide any overflow
    }),
  };

interface OptionsType{
    value?: string;
    label: string;
    icon: React.ReactNode;

}

const options:OptionsType[] =[
    {value: 'vTTD',label:'VTTD',icon:<img src="ttd_icon.svg" alt="vttd"/>},
    {value: 'vTRY',label:'VTRY',icon:<img src="lira_icon.svg" alt="vtry"/>},
    {value: 'vKES',label:'VKES',icon:<img src="shilling_icon.svg" alt="vttd"/> },
    {value: 'USDC',label:'USDC',icon:<img src="usdc_icon.svg" alt="usdc"/>}

]

interface CustomSingleValueProps {
    data: OptionsType;
  }

const CustomSingleValue:React.FC<CustomSingleValueProps>=({data, ...props})=>{
    return(
        <div className="react-select__single-value flex items-center">
            {data.icon}
            <span className="ml-2">{data.label}</span>
        </div>
    );
    
}

interface CustomOptionProps {
    data: OptionsType;
    innerRef: any;
    innerProps: any;
  }
  
  const CustomOption: React.FC<CustomOptionProps> = ({ data, innerRef, innerProps }) => {
    return (
      <div ref={innerRef} {...innerProps} className="flex items-center">
        {data.icon}
        <span className="ml-2">{data.label}</span>
      </div>
    );
  };

interface UnifiedInputProps {
  label: string;
  value: number;
  setValue: (value: number) => void;
  type?: string;
  disabled?: boolean;
  balance: number | null;
  refetch?: () => void;
  dropdownOptions?: string[];
  selectedDropdownOption?: OptionsType[];
  setSelectedDropdownOption?: (value: OptionsType | null) => void;
}

const UnifiedInputDropdown: React.FC<UnifiedInputProps> = ({
  label,
  value,
  setValue,
  type,
  disabled,
  balance,
  refetch,
  dropdownOptions,
  selectedDropdownOption,
  setSelectedDropdownOption,
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
    if (refetch) {
      refetch();
    }

    const parsedValue = parseFloat(newValue);
    if (!isNaN(parsedValue)) {
      setValue(parsedValue);
    } else {
      setValue(0);
      if (refetch) {
        refetch();
      }
    }
  };

  /*const handleDropdownChange = (selectedOption: OptionsType|null) => {
    setSelectedDropdownOption?.(selectedOption);
  };*/
  /*const handleDropdownChange = (
    newValue: SingleValue<OptionsType>, 
    actionMeta: ActionMeta<OptionsType>
  ) => {
    setSelectedDropdownOption?.(newValue);
  };*/
  const handleDropdownChange = (
    newValue: SingleValue<OptionsType> | MultiValue<OptionsType>, 
    actionMeta: ActionMeta<OptionsType>
  ) => {
    if (!Array.isArray(newValue)) {
      setSelectedDropdownOption?.(newValue as SingleValue<OptionsType>);
    } else {
      // Handle multi-select case (if needed)
    }
  };

  return (
    <div className="border border-[#8FA2B7] w-full flex rounded-2xl items-left flex-col flex-grow pt-4 mb-4">
      <div className="flex flex-row justify-between pb-4">
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
        <Select
            value={selectedDropdownOption}
            onChange={handleDropdownChange}
            options={options}
            components={{ SingleValue: CustomSingleValue, Option:CustomOption }}
            styles={customStyles}
        />
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
      />
      {balance !== null ? (
        <h1 className="ml-3">
          Balance: {(Number(balance) / 10 ** 18).toFixed(2)}
        </h1>
      ) : (
        <h1 className="ml-3">Loading balance...</h1>
      )}
    </div>
  );
};

export default UnifiedInputDropdown;