const anchor = require("@project-serum/anchor");

describe("share-ride", () => {
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.ShareRide;

  it("Is runs the constructor", async () => {
    await program.rpc.initialize();
  });
});
