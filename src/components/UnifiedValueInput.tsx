import React from 'react';


interface UnifiedInputProps{
    label:string;
    value:string;
    setValue:(value:string)=>void;
    type?:string;
}

const UnifiedInput:React.FC<UnifiedInputProps>=({label,value,setValue,type})=>{
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const inputvalue=e.target.value;
    if(inputvalue===""||/^[0-9]*\.?[0-9]*$/.test(inputvalue)){
        setValue(inputvalue);
    }
    };

    return(
        <div className="flex bg-[#2b3655] rounded-2xl items-left flex-col flex-grow pt-6 mb-4">
            <div className="mb-6">
                <div className="flex flex-row">
                {type && (
                    <h1 className="mb-2 ml-3 text-white">
                        {
                            type === 'deposit' ? 'Deposit' :
                            type === 'withdraw'? 'Withdraw':
                            type === 'pay'?'Pay':
                            type === 'receive'?'Receive':''
                        }
                    </h1>
                )}
                <h1 className="mb-2 ml-3 text-white">{label}</h1>
                </div>
                <input
                    type="number"
                    value={value}
                    onChange={handleChange}
                    placeholder="0"
                    className="ml-3 bg-[#2b3655] input input-ghost text-3xl focus:text-white focus:outline-none focus:bg-transparent h-[2.2rem] min-h-[2.2rem] px-1 font-medium placeholder:text-gray-450 text-gray-400"
                />
            </div>
        </div>
    );
};
export default UnifiedInput;