import { web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import mintAccountJson from "./mint-account.json";

export const mintPublicKey = new PublicKey(
  "CjhAyWDmUXxKTfUefqGVsnd1uXk82sAT4q8R5usbxYtz"
);

export const getMintAuthority = () => {
  const mintAuthority = web3.Keypair.fromSecretKey(
    new Uint8Array(mintAccountJson)
  );
  return mintAuthority;
};
