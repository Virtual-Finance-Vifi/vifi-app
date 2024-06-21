import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { headers } from "next/headers";

import { cn } from "@/lib/utils";
import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/sonner";

import { cookieToInitialState } from "wagmi";

import { config } from "@/configs";
import Web3ModalProvider from "@/contexts/Web3Modal";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const initialState = cookieToInitialState(config, headers().get("cookie")) || null;
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <title>Virtual Finance</title>
        <meta
          name="description"
          content="Stablecoin Protocol for the Frontier Currencies"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >

        <div id="root" className="p-2 w-screen h-screen">
          <div className="fixed bottom-0 left-0 right-0">
            <div className="flex justify-between">
              <img src="bleft_img.svg"/>
              <img src="bright_img.svg"/>
            </div>

          </div>

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Web3ModalProvider>
              <Nav />
              {children}
            </Web3ModalProvider>
          </ThemeProvider>
        </div>
        <Toaster richColors />
      </body>
    </html>
  );
}
