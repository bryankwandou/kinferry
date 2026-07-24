import type {PublicKey,Transaction} from "@solana/web3.js";
declare global{interface Window{solana?:{isPhantom?:boolean;publicKey:PublicKey|null;connect:()=>Promise<{publicKey:PublicKey}>;disconnect:()=>Promise<void>;signMessage?:(message:Uint8Array,display?:"utf8"|"hex")=>Promise<{signature:Uint8Array;publicKey:PublicKey}>;signAndSendTransaction:(transaction:Transaction)=>Promise<{signature:string}>}}}
export{};
