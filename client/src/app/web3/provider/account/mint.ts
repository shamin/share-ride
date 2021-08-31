import { web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import mintAccountJson from "./mint-account.json";

export const mintPublicKey = new PublicKey(
  "G8i3di2WFBtYYgfksynQ2gL7pEqc68bYMSWcqAEuEjxF"
);

export const getMintAuthority = () => {
  const mintAuthority = web3.Keypair.fromSecretKey(
    new Uint8Array(mintAccountJson)
  );
  return mintAuthority;
};
