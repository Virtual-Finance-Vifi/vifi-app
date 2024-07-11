import React, { useState } from "react";
import { Card } from "@tremor/react";
import { Button } from "@/components/ui/button";
import PlatformSelector from "@/components/PlatformSelector";
import CurrencySelector from "@/components/CurrencySelector";
import CurrencyInput from "@/components/CurrencyInput";

// const platforms = [
//   { value: "wam", label: "wam" },
//   { value: "platform2", label: "Platform 2" },
//   { value: "platform3", label: "Platform 3" },
// ];

// const currencies = [
//   { value: "ttd", label: "TTD", icon: "/path-to-ttd-icon.png" },
//   { value: "usd", label: "USD", icon: "/path-to-usd-icon.png" },
//   { value: "eur", label: "EUR", icon: "/path-to-eur-icon.png" },
// ];

export default function Ramp() {
  return (
    <main className="md:pt-6">
      <div className="flex flex-col lg:flex-row lg:justify-center lg:max-w-md mx-auto">
        <PlatformSelector title="Platform" />
        <CurrencySelector />
      </div>
      <div className="mx-3 lg:mx-auto flex flex-col justify-center lg:max-w-md">
        <CurrencyInput heading="Requesting" currency="USDC" />
        <CurrencyInput heading="You send"  currency="USD" />
        <button className="border border-gray-600 bg-red-600 p-3 rounded-full">Connect Wallet</button>
      </div>
    </main>
  );
}

// lg:justify-center lg:max-w-md mx-auto
