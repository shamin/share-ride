const assert = require("assert");
const anchor = require("@project-serum/anchor");

class Driver {
  constructor(properties) {
    Object.keys(properties).map((key) => {
      this[key] = properties[key];
    });
  }
}

describe("escrow", () => {
  const provider = anchor.Provider.local();

  anchor.setProvider(provider);

  const program = anchor.workspace.ShareRideEscrow;

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
    address: "asdfrghld",
    location: "qwsderefd",
    seat: "zxcdserdf",
  });

  it("Executes a method on the program", async () => {
    await program.state.rpc.addDriver(value, {
      accounts: {
        authority: provider.wallet.publicKey,
      },
    });
    const state = await program.state.fetch();
    assert.ok(state.drivers.length === 10);
  });
});
