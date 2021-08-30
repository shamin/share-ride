import { web3 } from "@project-serum/anchor";
import { Token } from "@solana/spl-token";
import { Connection } from "@solana/web3.js";
import { WalletAdapter } from "../types";
// @ts-ignore
import payerJson from "./payer.json";
import { sendMoney } from "./transfer";

export const getPayer = () => {
  const payer = web3.Keypair.fromSecretKey(new Uint8Array(payerJson));
  return payer;
};

export const getPayerBalance = async (connection: Connection) => {
  const payer = getPayer();
  return connection.getBalance(payer.publicKey);
};

export const initialisePayer = async (
  connection: Connection,
  wallet: WalletAdapter
) => {
  const payer = getPayer();
  const minBalance = await Token.getMinBalanceRentForExemptAccount(connection);
  await sendMoney(connection, wallet, payer.publicKey, minBalance);
  return payer;
};
