import { PublicKey } from "@solana/web3.js";

console.log(process.env.REACT_APP_SOLANA_PROGRAMID)

export const programId = new PublicKey(
  process.env.REACT_APP_SOLANA_PROGRAMID as string
);