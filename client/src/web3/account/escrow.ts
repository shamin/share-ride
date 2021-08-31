import { BN, Provider, utils } from "@project-serum/anchor";
import { Keypair, PublicKey, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { mintPublicKey } from "./mint";
import { loadEscrowProgram } from "./program";
import { getTokenAccount } from "./tokenAccount";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const intializeEscrow = async (provider: Provider) => {
  // TODO: Move this to actual driver & fix passenger amount
  const driver = Keypair.generate();
  const passengerAmount = 20;

  const program = loadEscrowProgram(provider);
  console.log("Program loaded", program);
  const escrowAccount = Keypair.generate();

  const tokenAccount = await getTokenAccount(
    provider,
    mintPublicKey,
    new PublicKey("Fg8GVFCXnxiUo5Xjr2fMTsEN5HYaJN6SYCZWJJT6kYsK")
  );

  await program.rpc.initializeEscrow(new BN(passengerAmount), {
    accounts: {
      passenger: provider.wallet.publicKey,
      passengerDepositTokenAccount: tokenAccount.address,
      escrowAccount: escrowAccount.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      driver: driver.publicKey,
    },
    instructions: [
      await program.account.escrowAccount.createInstruction(escrowAccount),
    ],
    signers: [escrowAccount],
  });

  const [pda, _nonce] = await PublicKey.findProgramAddress(
    [Buffer.from(utils.bytes.utf8.encode("escrow"))],
    program.programId
  );

  return pda;
};
