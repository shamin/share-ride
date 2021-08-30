import Wallet from "@project-serum/sol-wallet-adapter";
import {
  Connection,
  SystemProgram,
  Transaction,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import EventEmitter from "eventemitter3";
import { WalletAdapter } from "../types";

export async function sendMoney(
  connection: Connection,
  wallet: WalletAdapter,
  destPubkey: PublicKey,
  balanceNeeded: number,
) {
  try {
    console.log("starting sendMoney");
    const walletAccountInfo = await connection.getAccountInfo(
      wallet!.publicKey!
    );
    console.log("wallet data size", walletAccountInfo?.data.length);

    const receiverAccountInfo = await connection.getAccountInfo(destPubkey);
    console.log("receiver data size", receiverAccountInfo?.data.length);

    const instruction = SystemProgram.transfer({
      fromPubkey: wallet!.publicKey!,
      toPubkey: destPubkey,
      lamports: balanceNeeded,
    });
    let trans = await setWalletTransaction(connection, wallet, instruction);

    let signature = await signAndSendTransaction(connection, wallet, trans);
    let result = await connection.confirmTransaction(signature, "singleGossip");
    let balanceInAccount = await connection.getBalance(destPubkey);
    console.log("money sent", result.context, result.value, balanceInAccount);
  } catch (e) {
    console.warn("Failed", e);
  }
}

export async function setWalletTransaction(
  connection: Connection,
  wallet: WalletAdapter,
  instruction: TransactionInstruction
): Promise<Transaction> {
  const transaction = new Transaction();
  transaction.add(instruction);
  transaction.feePayer = wallet!.publicKey!;
  let hash = await connection.getRecentBlockhash();
  console.log("blockhash", hash);
  transaction.recentBlockhash = hash.blockhash;
  return transaction;
}

export async function signAndSendTransaction(
  connection: Connection,
  wallet: WalletAdapter,
  transaction: Transaction
): Promise<string> {
  let signedTrans = await wallet.signTransaction(transaction);
  console.log("sign transaction");
  let signature = await connection.sendRawTransaction(signedTrans.serialize());
  console.log("send raw transaction");
  return signature;
}