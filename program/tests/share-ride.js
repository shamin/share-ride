const assert = require("assert");
const anchor = require("@project-serum/anchor");

const ADDRESS_LENGTH = 44;

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
    assert.ok(state.drivers.length === 5);
  });

  const value = new Driver({
    address: "asdfgjkljkqwershajsasasaskoikhjwkasasasasasa",
    location: "-90.00000001:-180.00000001", 
    date: "1234567890",
    seats: 1,
    cost: "0.5",
  });

  it("Executes a method on the program", async () => {
    await program.state.rpc.addDriver(value, {
      accounts: {
        authority: provider.wallet.publicKey,
      },
    });
    const state = await program.state.fetch();
    console.log(state)
    assert.ok(state.drivers.length === 5);
  });
});
