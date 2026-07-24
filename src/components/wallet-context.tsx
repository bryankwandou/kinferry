"use client";
import {createContext,useContext,useMemo,useState} from "react";
import {Connection,PublicKey} from "@solana/web3.js";
import {connectWallet,provider} from "@/lib/solana-browser";

type WalletState={address:string;publicKey:PublicKey|null;balance:number|null;busy:boolean;error:string;connect:()=>Promise<PublicKey>;disconnect:()=>Promise<void>;refresh:()=>Promise<void>};
const WalletContext=createContext<WalletState|null>(null);const rpc=process.env.NEXT_PUBLIC_SOLANA_RPC_URL||"https://solana-devnet.api.onfinality.io/public";
export function WalletProvider({children}:{children:React.ReactNode}){const[publicKey,setPublicKey]=useState<PublicKey|null>(null);const[balance,setBalance]=useState<number|null>(null);const[busy,setBusy]=useState(false);const[error,setError]=useState("");async function loadBalance(key:PublicKey){const lamports=await new Connection(rpc,"confirmed").getBalance(key,"confirmed");setBalance(lamports/1_000_000_000)}async function connect(){setBusy(true);setError("");try{const key=await connectWallet();setPublicKey(key);await loadBalance(key);return key}catch(reason){const message=reason instanceof Error?reason.message:"Wallet connection failed.";setError(message);throw reason}finally{setBusy(false)}}async function disconnect(){await provider().disconnect();setPublicKey(null);setBalance(null)}async function refresh(){if(publicKey)await loadBalance(publicKey)}const value=useMemo(()=>({address:publicKey?.toBase58()||"",publicKey,balance,busy,error,connect,disconnect,refresh}),[publicKey,balance,busy,error]);return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>}
export function useWallet(){const value=useContext(WalletContext);if(!value)throw new Error("useWallet must be used inside WalletProvider");return value}
