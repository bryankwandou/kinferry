import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import {WalletProvider} from "@/components/wallet-context";
const inter=Inter({subsets:["latin"],variable:"--font-inter"});
const mono=JetBrains_Mono({subsets:["latin"],variable:"--font-mono"});
export const metadata:Metadata={title:"Kinferry - Guarded money movement for families",description:"A Solana devnet remittance agent with recipient verification, policy limits, quote locks, and duplicate-send protection."};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body className={inter.variable+" "+mono.variable}><WalletProvider>{children}</WalletProvider></body></html>}
