const anchor = require("@project-serum/anchor");
const { TOKEN_PROGRAM_ID, Token } = require("@solana/spl-token");
const assert = require("assert");

describe("escrow", () => {
  const provider = anchor.Provider.local();

  anchor.setProvider(provider);

  const program = anchor.workspace.ShareRideEscrow;

  let mintA = null;
  let passengerTokenAccountA = null;
  const passengerAmount = 20;

  const escrowAccount = anchor.web3.Keypair.generate();
  const payer = anchor.web3.Keypair.generate();
  const mintAuthority = anchor.web3.Keypair.generate();
  
  const driver = anchor.web3.Keypair.generate();

  it("Initialise escrow state", async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payer.publicKey, 10000000000),
      "confirmed"
    );

    mintA = await Token.createMint(
      provider.connection,
      payer,
      mintAuthority.publicKey,
      null,
      0,
      TOKEN_PROGRAM_ID
    );

    passengerTokenAccountA = await mintA.createAccount(
      provider.wallet.publicKey
    );

    await mintA.mintTo(
      passengerTokenAccountA,
      mintAuthority.publicKey,
      [mintAuthority],
      passengerAmount
    );

    let _passengerTokenAccountA = await mintA.getAccountInfo(
      passengerTokenAccountA
    );

    assert.ok(_passengerTokenAccountA.amount.toNumber() == passengerAmount);
  });

  it("Intialize escrow", async () => {
    await program.rpc.initializeEscrow(new anchor.BN(passengerAmount), {
      accounts: {
        passenger: provider.wallet.publicKey,
        passengerDepositTokenAccount: passengerTokenAccountA,
        escrowAccount: escrowAccount.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        driver: driver.publicKey,
      },
      instructions: [
        await program.account.escrowAccount.createInstruction(escrowAccount),
      ],
      signers: [escrowAccount],
    });

    const [pda, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("escrow"))],
      program.programId
    );

    let _passengerTokenAccountA = await mintA.getAccountInfo(passengerTokenAccountA);
    let _escrowAccount = await program.account.escrowAccount.fetch(
      escrowAccount.publicKey
    );
  
    assert.ok(_passengerTokenAccountA.owner.equals(pda));
    assert.ok(_escrowAccount.passengerKey.equals(provider.wallet.publicKey));
    assert.ok(_escrowAccount.driverKey.equals(driver.publicKey));

    assert.ok(_escrowAccount.passengerAmount.toNumber() == passengerAmount);
    assert.ok(
      _escrowAccount.passengerDepositTokenAccount.equals(passengerTokenAccountA)
    );
  });
});
