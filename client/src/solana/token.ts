import { Program, Provider, web3, BN, utils } from "@project-serum/anchor";
import {
  Connection,
  PublicKey,
  Transaction,
  Keypair,
  SystemProgram,
} from "@solana/web3.js";
import { sendMoney, signAndSendTransaction } from "./provider/utils";
import { getSolanaWallet } from "./wallet";
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import {
  getMintAuthority,
  // getTokenAccount,
  getWalletTokenAccountAndMintTo,
  mintPublicKey,
} from "./escrow/mint";
import { getPayer, getPayerBalance, initialisePayer } from "./escrow/payer";
import { loadEscrowProgram } from "./escrow/program";
import { TokenInstructions } from "@project-serum/serum";
import { WalletAdapter } from "./types";
import { getTokenAccount } from "./escrow/tokenAccount";

enum SolanaNetworks {
  DEV = "https://api.devnet.solana.com",
  TEST = "https://api.testnet.solana.com",
  MAIN = "https://api.mainnet-beta.solana.com",
  LOCAL = "http://127.0.0.1:8899",
}

export const createTokenAcc = async () => {
  const passengerAmount = 20;

  const wallet = getSolanaWallet();
  const provider = new Provider(
    new Connection(SolanaNetworks.LOCAL),
    wallet,
    {}
  );

  const program = loadEscrowProgram(provider);
  console.log("Program loaded", program);
  const escrowAccount = web3.Keypair.generate();
  const driver = web3.Keypair.generate();

  const tokenAccount = await getTokenAccount(
    provider,
    mintPublicKey,
    new PublicKey("Fg8GVFCXnxiUo5Xjr2fMTsEN5HYaJN6SYCZWJJT6kYsK")
  );
  console.log("Token account loaded, BAL:",tokenAccount.amount.toNumber(), tokenAccount.owner.toString());

  // await mintToTokenAccount(provider, tokenAcc.address)

  console.log("Escrow initing", tokenAccount);
  await program.rpc.initializeEscrow(new BN(passengerAmount), {
    accounts: {
      passenger: provider.wallet.publicKey,
      passengerDepositTokenAccount: tokenAccount.address,
      escrowAccount: escrowAccount.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
      driver: driver.publicKey,
    },
    instructions: [
      await program.account.escrowAccount.createInstruction(escrowAccount),
    ],
    signers: [escrowAccount],
  });

  const [_pda, _nonce] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode("escrow"))],
    program.programId
  );

  console.log(_pda, _nonce);

  // console.log(await getPayerBalance(provider.connection));
  // const payer = await initialisePayer(provider.connection, wallet);
  // console.log(await getPayerBalance(provider.connection));

  // await getWalletTokenAccountAndMintTo(provider.connection, payer, 400);
  // console.log(await getPayerBalance(provider.connection));
};
