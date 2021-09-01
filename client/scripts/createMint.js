const anchor = require("@project-serum/anchor");
const { TOKEN_PROGRAM_ID, Token } = require("@solana/spl-token");
const mintAuthorityFile = require("../src/app/web3/provider/account/mint-account.json");

const payer = anchor.web3.Keypair.generate();
const mintAuthority = anchor.web3.Keypair.fromSecretKey(
  new Uint8Array(mintAuthorityFile)
);

const provider = anchor.Provider.local();
anchor.setProvider(provider);

const createMint = async () => {
  return provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(payer.publicKey, 10000000000),
    "confirmed"
  );
};

createMint().then(async () => {
  const mint = await Token.createMint(
    provider.connection,
    payer,
    mintAuthority.publicKey,
    null,
    0,
    TOKEN_PROGRAM_ID
  );

  console.log("Mint public key", mint.publicKey.toString());
});
