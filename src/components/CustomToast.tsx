interface CustomToastProps {
    message: string;
    gifUrl: string;
    width: number;
    height: number;
    hash?:string;
  }
  
  const CustomToast: React.FC<CustomToastProps> = ({
    message,
    gifUrl,
    width,
    height,
    hash,
  }) => (
    <div
      className="flex flex-col border border-purple-500 
     w-full h-full align-center justify-center items-center"
    >
      <img
        src={gifUrl}
        alt="Toast Icon"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      <h1 className="text-[24px] font-bold font-['Archivo']">{message}</h1>
      <div className="border-b justify-center border-[#8FA2B7] flex flex-row w-full">
        <img src="usdc_icon.svg" alt="usdcicon" className="border border-yellow-400" />
        <p className="font-['Archivo'] font-bold text-[18px] pt-2">123.123USDC</p>
        <img src="arrow_right.svg" alt="rarrow" className="border border-red-400" />
        <p className="font-['Archivo'] font-bold text-[18px] pt-2">123.123VUSD</p>
        <img src="vusd_icon.png" alt="vusdicon" className="border border-yellow-400" />
      </div>
      <p className="text-[#8FA2B7]">Yippie :D</p>
      <button className="bg-[#00A651] rounded-full w-2/3 h-[10%] mt-4 text-[16px] font-['Archivo] text-center">
        <a href={`https://sepolia.etherscan.io/tx/${hash}`}> 
          View on Ethscan
        </a>
      </button>
      
    </div>
  );

  export default CustomToast;