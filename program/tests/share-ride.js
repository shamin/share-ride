const assert = require("assert");
const anchor = require("@project-serum/anchor");

const ADDRESS_LENGTH = 43;

class Driver {
  constructor(properties) {
    Object.keys(properties).map((key) => {
      this[key] = properties[key];
    });
  }
}

describe("share-ride", () => {
  const provider = anchor.Provider.local();

  anchor.setProvider(provider);

  const program = anchor.workspace.ShareRide;

  it("Is runs the constructor", async () => {
    await program.state.rpc.new({
      accounts: {
        authority: provider.wallet.publicKey,
      },
    });
    const state = await program.state.fetch();
    assert.ok(state.drivers.length === 10);
  });

  const value = new Driver({
    archive: "1234567891234567891234567891234567891234567",
  });

  it("Executes a method on the program", async () => {
    await program.state.rpc.addDriver(value, {
      accounts: {
        authority: provider.wallet.publicKey,
      },
    });
    const state = await program.state.fetch();
    console.log(state)
    assert.ok(state.drivers.length === 10);
  });
});
