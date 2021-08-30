import {
  Connection,
  SystemProgram,
  Transaction,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { WalletAdapter } from "../types";

export async function sendMoney(
  connection: Connection,
  wallet: WalletAdapter,
  destPubkey: PublicKey,
  amount: number // Amount in lombarts
) {
  const instruction = SystemProgram.transfer({
    fromPubkey: wallet!.publicKey!,
    toPubkey: destPubkey,
    lamports: amount,
  });
  let trans = await setWalletTransaction(connection, wallet, instruction);

  let signature = await signAndSendTransaction(connection, wallet, trans);
  await connection.confirmTransaction(signature, "singleGossip");
  let balanceInAccount = await connection.getBalance(destPubkey);
  console.log("Money sent", balanceInAccount);
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
  transaction.recentBlockhash = hash.blockhash;
  return transaction;
}

export async function signAndSendTransaction(
  connection: Connection,
  wallet: WalletAdapter,
  transaction: Transaction
): Promise<string> {
  let signedTrans = await wallet.signTransaction(transaction);
  console.log("Sign transaction complete");
  let signature = await connection.sendRawTransaction(signedTrans.serialize());
  console.log("Send raw transaction complete");
  return signature;
}
