import { toast } from "sonner";
import {addresses} from "@/constants/addresses"
import { config } from "@/configs";
import { getChainId } from "@wagmi/core";

const chainId = getChainId(config);

interface CustomToastProps {
    message: string;
    message2: string;
    gifUrl: string;
    tokenIcon1:string;
    tokenIcon2:string;
    liveRateIn?:number|null;
    liveRateOut?:number|null;
    transferVal?:number|null;
    coinLabel1?:string;
    coinLabel2?:string;
    coinLabel3?:string;
    type?:string|null;
    width: number;
    height: number;
    hash?:string;
  }
  
  const CustomToast: React.FC<CustomToastProps> = ({
    message,
    message2,
    gifUrl,
    tokenIcon1,
    tokenIcon2,
    liveRateIn,
    liveRateOut,
    transferVal,
    coinLabel1,
    coinLabel2,
    coinLabel3,
    type,
    width,
    height,
    hash,
  }) => (
    <div
      className="flex flex-col w-full h-full align-center justify-center items-center"
    >
      <button onClick={()=>toast.dismiss()} className="absolute top-2 right-2 bg-transparent rounded-full p-1">
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
          <img src={tokenIcon1} alt="usdcicon"/>
          <p className="font-['Archivo'] font-bold text-[18px] pt-2">123USDC</p>
          <img src="arrow_right.svg" alt="rarrow" />
          <p className="font-['Archivo'] font-bold text-[18px] pt-2">123VUSD</p>
          <img src={tokenIcon2} alt="vusdicon"/>
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