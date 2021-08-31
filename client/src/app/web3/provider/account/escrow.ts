import { BN, Provider, utils } from "@project-serum/anchor";
import { Keypair, PublicKey, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, AccountInfo } from "@solana/spl-token";
import { loadEscrowProgram } from "../../program";

export const intializeEscrow = async (
  provider: Provider,
  tokenAccount: AccountInfo
) => {
  // TODO: Move this to actual driver & fix passenger amount
  const driverPublicKey = "6KwDFRmHUJcwLJcqU6wFzX8ZZkDR4hgoo3QMbKpg5PwL";
  const passengerAmount = 20;

  const program = loadEscrowProgram(provider);
  console.log("Program loaded", program);
  const escrowAccount = Keypair.generate();

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

  console.log(pda, pda.toString())

  return pda;
};
