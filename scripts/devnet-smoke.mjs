import fs from "node:fs";
import {Connection,Keypair,PublicKey,SystemProgram,Transaction,TransactionInstruction,sendAndConfirmTransaction} from "@solana/web3.js";

const PROGRAM=new PublicKey("HZiw1u9BoKkdhppnN22HJzXUQJDca2yMeDY8wqywSdEs");
const recipient=new PublicKey(process.env.DEVNET_RECIPIENT||"ELcxVvxi5yxktxQsySFhbMqyt37PxzJKMhEhiKnJzxT7");
const payerPath=process.env.SOLANA_KEYPAIR||"C:/Users/arche/.config/solana/veztra-deploy.json";
const payer=Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(payerPath,"utf8"))));
const connection=new Connection(process.env.SOLANA_RPC_URL||"https://solana-devnet.api.onfinality.io/public","confirmed");
const policy=PublicKey.findProgramAddressSync([Buffer.from("policy"),payer.publicKey.toBuffer()],PROGRAM)[0];
const allowlist=PublicKey.findProgramAddressSync([Buffer.from("recipient"),payer.publicKey.toBuffer(),recipient.toBuffer()],PROGRAM)[0];
const u64=value=>{const data=Buffer.alloc(8);data.writeBigUInt64LE(BigInt(value));return data};
const send=instruction=>sendAndConfirmTransaction(connection,new Transaction().add(instruction),[payer],{commitment:"confirmed"});
const signatures={};

if(!await connection.getAccountInfo(policy)){signatures.policy=await send(new TransactionInstruction({programId:PROGRAM,keys:[{pubkey:policy,isSigner:false,isWritable:true},{pubkey:payer.publicKey,isSigner:true,isWritable:true},{pubkey:SystemProgram.programId,isSigner:false,isWritable:false}],data:Buffer.concat([Buffer.from([9,186,86,225,129,162,231,56]),u64(10_000_000),u64(50_000_000)])}))}
if(!await connection.getAccountInfo(allowlist)){signatures.allowlist=await send(new TransactionInstruction({programId:PROGRAM,keys:[{pubkey:policy,isSigner:false,isWritable:false},{pubkey:allowlist,isSigner:false,isWritable:true},{pubkey:payer.publicKey,isSigner:true,isWritable:true},{pubkey:recipient,isSigner:false,isWritable:false},{pubkey:SystemProgram.programId,isSigner:false,isWritable:false}],data:Buffer.from([207,170,166,28,210,186,242,145])}))}
const before=await connection.getBalance(recipient,"confirmed");
signatures.transfer=await send(new TransactionInstruction({programId:PROGRAM,keys:[{pubkey:policy,isSigner:false,isWritable:true},{pubkey:allowlist,isSigner:false,isWritable:false},{pubkey:payer.publicKey,isSigner:true,isWritable:true},{pubkey:recipient,isSigner:false,isWritable:true},{pubkey:SystemProgram.programId,isSigner:false,isWritable:false}],data:Buffer.concat([Buffer.from([233,126,160,184,235,206,31,119]),u64(1_000_000)])}));
const after=await connection.getBalance(recipient,"confirmed");
const blocked={};
try{await send(new TransactionInstruction({programId:PROGRAM,keys:[{pubkey:policy,isSigner:false,isWritable:true},{pubkey:allowlist,isSigner:false,isWritable:false},{pubkey:payer.publicKey,isSigner:true,isWritable:true},{pubkey:recipient,isSigner:false,isWritable:true},{pubkey:SystemProgram.programId,isSigner:false,isWritable:false}],data:Buffer.concat([Buffer.from([233,126,160,184,235,206,31,119]),u64(11_000_000)])}));blocked.cap=false}catch{blocked.cap=true}
const stranger=Keypair.generate().publicKey;const strangerAllowlist=PublicKey.findProgramAddressSync([Buffer.from("recipient"),payer.publicKey.toBuffer(),stranger.toBuffer()],PROGRAM)[0];
try{await send(new TransactionInstruction({programId:PROGRAM,keys:[{pubkey:policy,isSigner:false,isWritable:true},{pubkey:strangerAllowlist,isSigner:false,isWritable:false},{pubkey:payer.publicKey,isSigner:true,isWritable:true},{pubkey:stranger,isSigner:false,isWritable:true},{pubkey:SystemProgram.programId,isSigner:false,isWritable:false}],data:Buffer.concat([Buffer.from([233,126,160,184,235,206,31,119]),u64(1_000_000)])}));blocked.unallowlisted=false}catch{blocked.unallowlisted=true}
console.log(JSON.stringify({program:PROGRAM.toBase58(),owner:payer.publicKey.toBase58(),recipient:recipient.toBase58(),policy:policy.toBase58(),allowlist:allowlist.toBase58(),recipient_balance_delta:after-before,blocked,signatures},null,2));
