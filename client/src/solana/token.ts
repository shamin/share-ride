import { Program, Provider, web3 } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";
import { sendMoney } from "./provider/utils";
import { getSolanaWallet } from "./wallet";
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { getMintAuthority, getWalletTokenAccountAndMintTo } from "./escrow/mint";
import { getPayerBalance, initialisePayer } from "./escrow/payer";

enum SolanaNetworks {
  DEV = "https://api.devnet.solana.com",
  TEST = "https://api.testnet.solana.com",
  MAIN = "https://api.mainnet-beta.solana.com",
  LOCAL = "http://127.0.0.1:8899",
}

export const createTokenAcc = async () => {
  const wallet = getSolanaWallet();
  const provider = new Provider(
    new Connection(SolanaNetworks.LOCAL),
    wallet,
    {}
  );

  console.log(await getPayerBalance(provider.connection));
  const payer = await initialisePayer(provider.connection, wallet);
  console.log(await getPayerBalance(provider.connection));

  await getWalletTokenAccountAndMintTo(provider.connection, payer, 400);
  console.log(await getPayerBalance(provider.connection));
};
