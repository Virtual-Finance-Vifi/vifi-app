import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { headers } from "next/headers";
import { BalanceProvider } from "@/contexts/Balance";

import { cn } from "@/lib/utils";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          type="image/png"
        />
        <title>Virtual Finance</title>
        <meta
          name="description"
          content="Stablecoin Protocol for the Frontier Currencies"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-black font-sans antialiased",
          fontSans.variable
        )}
      >
        {/* <div className="fixed bottom-0 left-0 right-0">
            <div className="flex justify-between">
              <img src="bleft_img.svg" />
              <img src="bright_img.svg" />
            </div>
          </div> */}

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Web3ModalProvider>
            <BalanceProvider>
              <div className="flex flex-col min-h-screen">
                <Nav />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </BalanceProvider>
          </Web3ModalProvider>
        </ThemeProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "none",
              // width: "33vw",
              // height: "75vh",
              // top: "50%",
              // left: "50%",
              // transform: "translate(-50%,-50%)",
              // position: "fixed",
              border: "transparent",
            },
          }}
        />
      </body>
    </html>
  );
}
