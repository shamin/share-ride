import { web3 } from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { WalletAdapter } from "../types";
// @ts-ignore
import mintAccountJson from "./mint-account.json";

export const mintPublicKey = new PublicKey(
  "G8i3di2WFBtYYgfksynQ2gL7pEqc68bYMSWcqAEuEjxF"
);

// Temp token account
const tempTokenAccount = new PublicKey(
  "6Xbi7t5LTjve81XrEzWBeT4mymi8a1gD6JHZMHaU6ru5"
);

export const getMintAuthority = () => {
  const mintAuthority = web3.Keypair.fromSecretKey(
    new Uint8Array(mintAccountJson)
  );
  console.log(mintAuthority.publicKey.toString());
  return mintAuthority;
};

export const createMint = async (
  connection: Connection,
  payerAccount: Keypair
) => {
  const mintAuthority = getMintAuthority();

  const mint = await Token.createMint(
    connection,
    payerAccount,
    mintAuthority.publicKey,
    null,
    0,
    TOKEN_PROGRAM_ID
  );

  return mint;
};

export const createTokenAccount = async (
  connection: Connection,
  wallet: WalletAdapter,
  payerAccount: Keypair
) => {
  const mint = new Token(
    connection,
    mintPublicKey,
    TOKEN_PROGRAM_ID,
    payerAccount
  );

  const tokenAccount = await mint.createAccount(wallet.publicKey);

  return tokenAccount;
};

export const getTokenAccount = (
  connection: Connection,
  payerAccount: Keypair
) => {
  const mint = new Token(
    connection,
    mintPublicKey,
    TOKEN_PROGRAM_ID,
    payerAccount
  );

  return mint.getAccountInfo(new PublicKey(tempTokenAccount));
};

export const getWalletTokenAccountAndMintTo = async (
  connection: Connection,
  payerAccount: Keypair,
  amount: number
): Promise<PublicKey> => {
  const mintAuthority = getMintAuthority();

  const mint = new Token(
    connection,
    mintPublicKey,
    TOKEN_PROGRAM_ID,
    payerAccount
  );

  const tokenAccount = (
    await mint.getAccountInfo(new PublicKey(tempTokenAccount))
  ).address;

  console.log(
    "Bal:",
    (await mint.getAccountInfo(new PublicKey(tokenAccount))).amount.toNumber()
  );

  console.log("Minting to", amount);

  await mint.mintTo(
    tokenAccount,
    mintAuthority.publicKey,
    [mintAuthority],
    amount
  );

  console.log("Token account", tokenAccount?.toString());
  console.log(
    "Bal:",
    (await mint.getAccountInfo(new PublicKey(tokenAccount))).amount.toNumber()
  );

  return tokenAccount;
};
