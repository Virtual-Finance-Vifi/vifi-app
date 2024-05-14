import React, { useState } from "react";
import InputComponent from "./Input";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Button } from "../ui/button";

export default function VUSD_to_EMC() {
  const { address } = useAccount();
  const handleConnect = () => {
    open();
  };
  const [VUSD, setVUSD] = useState<number>(0);
  const [VTTD, setVTTD] = useState<number>(0);
  const [VRT, setVRT] = useState<number>(0);
  return (
    <div>
      <div className="flex rounded-2xl items-left flex-col flex-grow pt-4 mx-2 text-accent">
        <h1 className="text-primary ml-2">You pay</h1>
        <InputComponent
          label="vUSD"
          onValueChange={setVUSD}
          initialValue={VUSD}
        />
      </div>
      <div className="flex justify-center">
        <Image
          src="/arrow_down.svg"
          alt="VIFI Logo"
          className="dark:invert"
          width={30}
          height={24}
          priority
        />
      </div>

      <div className="flex rounded-2xl items-left flex-col flex-grow pt-4 mx-2 text-accent">
        <h1 className="text-primary ml-2">You receive</h1>
        <InputComponent
          label="vTTD"
          onValueChange={setVTTD}
          initialValue={VTTD}
        />
      </div>
      <div className="flex rounded-2xl items-left flex-col flex-grow pt-2 mx-2 text-accent">
        <InputComponent label="vRT" onValueChange={setVRT} initialValue={VRT} />
      </div>
      <div className="flex flex-col justify-center mx-2">
        {!address ? (
          <Button onClick={handleConnect}>Connect Wallet</Button>
        ) : (
          <>
            <Button className="rounded-2xl px-6">Convert</Button>
          </>
        )}
      </div>
    </div>
  );
}
