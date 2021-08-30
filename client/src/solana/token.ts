import { Program, Provider, web3 } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";
import { createTokenAccount } from "./provider/token";
import { sendMoney } from "./provider/utils";
import { getSolanaWallet } from "./wallet";
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";

enum SolanaNetworks {
  DEV = "https://api.devnet.solana.com",
  TEST = "https://api.testnet.solana.com",
  MAIN = "https://api.mainnet-beta.solana.com",
  LOCAL = "http://127.0.0.1:8899",
}

const mintAuthority = web3.Keypair.generate();
const payerAccount = web3.Keypair.generate();

export const createTokenAcc = async () => {
  const wallet = getSolanaWallet();
  const provider = new Provider(
    new Connection(SolanaNetworks.LOCAL),
    wallet,
    {}
  );

  console.log("Provider w", provider, wallet);
  const balanceNeeded = await Token.getMinBalanceRentForExemptMint(provider.connection);
  console.log("Balance Needed", balanceNeeded);

  // const program = new Program(require("./idl.json"), "programId", provider);
  await sendMoney(provider.connection, wallet, payerAccount.publicKey, balanceNeeded);
  // createTokenAccount(provider, 1000);
  let bal = await provider.connection.getBalance(payerAccount.publicKey);

  console.log("Mint started", bal)
  const mint = await Token.createMint(
    provider.connection,
    payerAccount,
    mintAuthority.publicKey,
    null,
    0,
    TOKEN_PROGRAM_ID
  );

  console.log("Mint complete")

  const passengerTokenAccount = await mint.createAccount(
    provider.wallet.publicKey
  );

  console.log("Token account created")

  await mint.mintTo(
    passengerTokenAccount,
    mintAuthority.publicKey,
    [mintAuthority],
    400
  );

  console.log("minting complete, fetching account")

  let _passengerTokenAccountA = await mint.getAccountInfo(
    passengerTokenAccount
  );

  console.log("Account balance", _passengerTokenAccountA.amount.toNumber())

  bal = await provider.connection.getBalance(payerAccount.publicKey);
  console.log("Mint ended", bal)
};
