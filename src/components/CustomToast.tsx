import { toast } from "sonner";
import {addresses} from "@/constants/addresses"
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";

const chainId = getChainId(config);

interface CustomToastProps {
    message: string;
    message2: string;
    gifUrl: string;
    tokenIcons?:string[] | null;
    liveRates?:string[];
    transferVal?:number|null;
    tokenLabels?:string[];
    values?:number[];
    type?:string|null;
    width: number;
    height: number;
    hash?:string;
  }
  
  const CustomToast: React.FC<CustomToastProps> = ({
    message,
    message2,
    gifUrl,
    tokenIcons,
    liveRates,
    tokenLabels,
    transferVal,
    values,
    type,
    width,
    height,
    hash,
  }) => (
    <div
      className="flex flex-col w-full h-full align-center justify-center items-center"
    >
      <button onClick={()=>toast.dismiss()} className="fixed top-2 right-2 bg-transparent rounded-full p-1">
        X
      </button>
      <img
        src={gifUrl}
        alt="Toast Icon"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      <h1 className="text-[24px] font-bold font-['Archivo']">{message}</h1>
      {type !=="approval"?(
        <div className="justify-center flex flex-row w-full">
          <img src={tokenIcons?.[0]} alt="usdcicon"/>
          <p className="font-['Archivo'] font-bold text-[18px] pt-2">{values?.[0]}{tokenLabels?.[0]}</p>
          <img src="arrow_right.svg" alt="rarrow" />
          <p className="font-['Archivo'] font-bold text-[18px] pt-2">{values?.[1]}{tokenLabels?.[1]}</p>
          <img src={tokenIcons?.[1]} alt="vusdicon"/>
        </div>
      ):(
        <div className="justify-center flex flex-row w-full">
          <p className="font-['Archivo'] font-bold text-[18px] pt-2">Contract Approval</p>
        </div>
      )}
      
      <p className="border-t border-[#8FA2B7] text-[#8FA2B7] w-2/3 text-center">{message2}</p>
      <button className="bg-[#00A651] rounded-full w-2/3 h-[10%] mt-4 text-[16px] font-['Archivo] text-center">
        <a href={`${addresses[chainId]['blockexplorer']}/tx/${hash}`}> 
          View on Ethscan
        </a>
      </button>
      
    </div>
  );

  export default CustomToast;