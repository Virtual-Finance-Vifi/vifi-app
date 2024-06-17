"use client";
import Image from "next/image";
import { ModeToggle } from "./Modetoggle";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav() {
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const storedActiveTab = localStorage.getItem("activeTab");
    if (storedActiveTab) {
      setActiveTab(storedActiveTab);
    }
  }, []);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    localStorage.setItem("activeTab", tabName);
  };

  return (
    <header>
      <nav>
        <div className="flex flex-row justify-between">
          <ul className="flex items-center justify-between w-3/5">
            <li>
              <a
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/vifi-logo.PNG"
                  alt="VIFI Logo"
                  className="invert dark:invert-0"
                  width={100}
                  height={24}
                  priority
                />
              </a>
            </li>
            <Link
              className={`p-2 rounded-2xl hover:bg-secondary ${
                activeTab === "claim"
                  ? "bg-secondary text-white"
                  : "text-gray-500"
              }`}
              href="claim"
            >
              Claim
            </Link>

            <Link href="vex" onClick={() => handleTabChange("swap")}>
              <div
                className={`flex flex-row group hover:text-[#ffcb03] hover:${
                  activeTab === "swap"
                } ${activeTab === "swap" ? "text-[#ffcb03]" : "text-gray-500"}`}
              >
                <Image
                  src="/swap-logo.svg"
                  alt="swap-logo"
                  width={24}
                  height={24}
                  priority
                  className={`mr-1 ${
                    activeTab === "swap"
                      ? ""
                      : "grayscale group-hover:grayscale-0"
                  }`}
                />
                Swap
              </div>
            </Link>

            <Link
              href="virtualizer"
              onClick={() => handleTabChange("virtualizer")}
            >
              <div
                className={`flex flex-row group hover:text-[#F15A22] hover:${
                  activeTab === "virtualizer"
                } ${
                  activeTab === "virtualizer"
                    ? "text-[#F15A22]"
                    : "text-gray-500"
                }`}
              >
                <Image
                  src="/virtualizer-logo.svg"
                  alt="virtualizer-logo"
                  width={24}
                  height={24}
                  priority
                  className={`mr-1 ${
                    activeTab === "virtualizer"
                      ? ""
                      : "grayscale group-hover:grayscale-0"
                  }`}
                />
                Virtualizer
              </div>
            </Link>

            <Link href="varq" onClick={() => handleTabChange("forge")}>
              <div
                className={`flex flex-row group hover:text-[#00A651] hover:${
                  activeTab === "forge"
                } ${
                  activeTab === "forge" ? "text-[#00A651]" : "text-gray-500"
                }`}
              >
                <Image
                  src="/forge-logo.svg"
                  alt="forge-logo"
                  width={24}
                  height={24}
                  priority
                  className={`mr-1 ${
                    activeTab === "forge"
                      ? ""
                      : "grayscale group-hover:grayscale-0"
                  }`}
                />
                Forge
              </div>
            </Link>

            <Link href="amm" onClick={() => handleTabChange("amm")}>
              <div
                className={`flex flex-row group hover:text-[#68AAFF] hover:${
                  activeTab === "amm"
                } ${activeTab === "amm" ? "text-[#68AAFF]" : "text-gray-500"}`}
              >
                <Image
                  src="/amm-logo.svg"
                  alt="amm-logo"
                  width={24}
                  height={24}
                  priority
                  className={`mr-1 ${
                    activeTab === "amm"
                      ? ""
                      : "grayscale group-hover:grayscale-0"
                  }`}
                />
                AMM
              </div>
            </Link>
          </ul>
          <div className="flex flex-row items-center">
            <div className="mr-2">
              <ModeToggle />
            </div>
            <w3m-button size="sm" balance="hide" />
            <w3m-network-button />
          </div>
        </div>
      </nav>
    </header>
  );
}
