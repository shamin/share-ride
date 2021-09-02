import { BN, Provider, utils } from "@project-serum/anchor";
import { Keypair, PublicKey, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, AccountInfo } from "@solana/spl-token";
import { loadEscrowProgram } from "../../program";
import { getTokenAccount } from "./tokenAccount";
import { mintPublicKey } from "./mint";

export const intializeEscrow = async (
  provider: Provider,
  tokenAccount: AccountInfo,
  passengerAmount: number,
  driverPublicKey: string
) => {
  const program = loadEscrowProgram(provider);
  console.log("Program loaded", program, passengerAmount, driverPublicKey);
  const escrowAccount = Keypair.generate();

  console.log(tokenAccount);

  await program.rpc.initializeEscrow(new BN(passengerAmount), {
    accounts: {
      passenger: provider.wallet.publicKey,
      passengerDepositTokenAccount: tokenAccount.address,
      escrowAccount: escrowAccount.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      driver: driverPublicKey,
    },
    instructions: [
      await program.account.escrowAccount.createInstruction(escrowAccount),
    ],
    signers: [escrowAccount],
  });

  console.log(escrowAccount);
  console.log(escrowAccount.publicKey.toString());

  const [pda, _nonce] = await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode("escrow"))],
    program.programId
  );

  console.log(pda, pda.toString());

  return escrowAccount.publicKey.toString();
};

export const getEscrowAccount = (
  provider: Provider,
  escrowAccPublicKey: string
) => {
  const program = loadEscrowProgram(provider);
  return program.account.escrowAccount.fetch(escrowAccPublicKey);
};

export const exchangeEscrow = async (
  provider: Provider,
  tokenAccount: AccountInfo,
  escrow: string,
) => {
  const program = loadEscrowProgram(provider);

  const escrowAccount = (await getEscrowAccount(provider, escrow)) as any;
  
  const passengerTokenAccount = await getTokenAccount(
    provider,
    mintPublicKey,
    escrowAccount.passengerDepositTokenAccount
  );

  await program.rpc.exchange({
    accounts: {
      driver: provider.wallet.publicKey,
      driverReceiveTokenAccount: tokenAccount.address,
      passengerMainAccount: escrowAccount.passengerKey,
      pdaAccount: passengerTokenAccount.owner.toString(),
      pdaDepositTokenAccount: escrowAccount.passengerDepositTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      escrowAccount: escrow,
    },
  });

  console.log("Token exchange complete");
};
